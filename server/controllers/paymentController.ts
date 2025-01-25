import { Request, Response, NextFunction } from "express";
import Course from "../models/Course";
import Stripe from "stripe";
import orderModel from "../models/Orders";
import CartModel from "../models/Cart";
import Instructor from "../models/Instructor";

const stripeSecretKey = process.env.STRIPE_KEY as string;

if (!stripeSecretKey) {
  throw new Error("Stripe secret key not provided");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-11-20.acacia",
});

export const stripePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { cartItems } = req.body;    

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      res.status(400).json({ error: "Cart items are required." });
      return;
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
          cartItems.map(({ courseId, studentId, courseFee, thumbnail }) => ({
            courseId,
            studentId,
            courseFee,
            thumbnail,
          })), 
        )
      }
    });

    res.json({
      status: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Payment Error:", error);
    res.status(500).json({ error: "Payment processing failed." });
  }
};

let endpointSecret:any;

export const handleStripeWebhook = async (req: Request, res: Response) => {
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

      } catch (err:any) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
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
        if(result){
          res.json({ status: 'success'});
        }
      }else if (flowType === 'course_purchase') {
      const session = data as Stripe.Checkout.Session;

      const cartItems = session.metadata?.cartItems ? JSON.parse(session.metadata.cartItems) : [];
      
      const sessionId = session.id; 
      
      const orderPromises = cartItems.map(async (item: any) => {
        const { courseId, studentId, courseFee } = item;

        const courseData = await Course.findById(courseId);
        if (!courseData) {
          throw new Error('Course not found');
        }

        const order = await orderModel.create({
          studentId,
          courseId: courseData._id,
          tutorId: courseData.instructorId,
          amount: courseFee,
          paymentMethod: 'Stripe',
          sessionId, 
        });

        await Course.findByIdAndUpdate(courseData._id, {
          $push: { students: studentId },
        });

        const instructor = await Instructor.findById(courseData.instructorId);
        if (!instructor) throw new Error('Instructor not found');
        
        const earnings = courseData.courseFee * 0.2;
        instructor.currentBalance = (instructor.currentBalance as number) + earnings;
        await instructor.save();

        if (order) {
        const deletedCart = await CartModel.findOneAndDelete({ user: studentId });
  
        if (deletedCart) {
          console.log("Cart cleared for user:", studentId);
        } else {
          console.warn("No cart found for user:", studentId);
        }
      }
        return order;
      });

      const orders = await Promise.all(orderPromises);
      res.json({ status: 'success', orders });
    }else {
      console.log('Unknown flow type:', flowType);
    }
    }
    res.status(200).end();
};

const handleInstructorPayout = async (session: any) => {
  const { email, amount } = session.metadata;
  const instructor = await Instructor.findOne({ email });
  const withdrawnAmount = (amount*1) / 100; 

  if(!instructor){
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
