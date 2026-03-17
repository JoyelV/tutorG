import { Request, Response, NextFunction } from "express";
import Course from "../models/Course";
import Stripe from "stripe";
import orderModel from "../models/Orders";
import CartModel from "../models/Cart";
import { OrderController } from './orderController';
import { logger } from '../utils/logger';
import Instructor from "../models/Instructor";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { ApiResponse } from "../utils/ApiResponse";
import { socketService } from "../utils/socketService";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;

if (!stripeSecretKey) {
  throw new Error("Stripe secret key not provided");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-11-20.acacia",
});

export const stripePayment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { cartItems } = req.body;

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new AppError(400, "Cart items are required");
  }

  const lineItems = cartItems.map((item: any) => {
    const { courseId, courseFee, title, thumbnail } = item;

    return {
      price_data: {
        currency: "INR",
        product_data: {
          name: title,
          images: thumbnail ? [thumbnail] : [],
          metadata: {
            courseId,
          },
        },
        unit_amount: courseFee * 100,
      },
      quantity: 1,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    billing_address_collection: 'auto',
    success_url: `${process.env.CLIENT_URL}/paymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
    metadata: {
      type: 'course_purchase',
      cartItems: JSON.stringify(
        cartItems.map(({ courseId, studentId }) => ({
          courseId,
          studentId,
        })),
      )
    }
  });

  res.status(200).json(new ApiResponse(200, { url: session.url }, "Stripe session created successfully"));
});

let endpointSecret: any;

export const handleStripeWebhook = asyncHandler(async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  let eventType;
  let data;

  if (endpointSecret) {
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig as string,
        endpointSecret
      );

    } catch (err: any) {
      throw new AppError(400, `Webhook Error: ${err.message}`);
    }
    data = event.data.object;
    eventType = event.type;
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
  }

  if (eventType === "checkout.session.completed") {
    const flowType = data.metadata?.type;

    if (flowType === 'instructor_payout') {
      const result = await handleInstructorPayout(data);
      if (result) {
        res.status(200).json({ status: 'success' });
        return;
      }
    } else if (flowType === 'course_purchase') {
      const session = data as Stripe.Checkout.Session;
      const cartItems = session.metadata?.cartItems ? JSON.parse(session.metadata.cartItems) : [];
      const sessionId = session.id;

      const orderPromises = cartItems.map(async (item: any) => {
        const { courseId, studentId } = item;

        const courseData = await Course.findById(courseId);
        if (!courseData) {
          throw new AppError(404, 'Course not found in purchase flow');
        }

        const order = await orderModel.create({
          studentId,
          courseId: courseData._id,
          tutorId: courseData.instructorId,
          amount: courseData.courseFee,
          paymentMethod: 'Stripe',
          sessionId,
        });

        await Course.findByIdAndUpdate(courseData._id, {
          $push: { students: studentId },
        });

        const instructor = await Instructor.findById(courseData.instructorId);
        if (!instructor) throw new AppError(404, 'Instructor not found for earnings update');

        const earnings = courseData.courseFee * 0.2;
        instructor.currentBalance = (instructor.currentBalance as number) + earnings;
        await instructor.save();

        if (order) {
          // Real-time notification for instructor
          socketService.emitNotification(courseData.instructorId.toString(), {
            title: 'New Student Enrollment!',
            message: `A new student has enrolled in your course "${courseData.title}".`,
            type: 'info'
          });

          const deletedCart = await CartModel.findOneAndDelete({ user: studentId });
          if (deletedCart) {
            logger.info(`Cart cleared for user: ${studentId}`);
          } else {
            logger.warn("No cart found for user:", studentId);
          }
        }
        return order;
      });

      const orders = await Promise.all(orderPromises);
      res.status(200).json({ status: 'success', orders });
      return;
    } else {
      logger.warn(`Unknown flow type: ${flowType}`);
    }
  }
  res.status(200).json({ received: true });
});

const handleInstructorPayout = async (session: any) => {
  const { email, amount } = session.metadata;
  const instructor = await Instructor.findOne({ email });
  const withdrawnAmount = (amount * 1) / 100;

  if (!instructor) {
    return false;
  }
  instructor.earnings = (Number(instructor.earnings) + withdrawnAmount) as number;
  instructor.totalWithdrawals = (Number(instructor.totalWithdrawals) + 1) as number;
  instructor.currentBalance = (Number(instructor.currentBalance) - withdrawnAmount) as number;

  const newTransaction = {
    date: new Date(),
    method: 'Stripe',
    status: 'completed',
    amount: withdrawnAmount
  };

  instructor.transactions = instructor.transactions || [];
  instructor.transactions.push(newTransaction);
  await instructor.save();
  return true;
};
