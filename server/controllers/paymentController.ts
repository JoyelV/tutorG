import { Request, Response, NextFunction } from "express";
import Course from "../models/Course";
import Stripe from "stripe";
import orderModel from "../models/Orders";
import CartModel from "../models/Cart";

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
    console.log(cartItems,"cartItems");
    
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
            description: title,
            metadata: {
              courseId,
            },
          },
          unit_amount: courseFee * 100, 
        },
        quantity: 1,
      };
    });
    console.log(lineItems,"lineItems");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      billing_address_collection: "required",
      success_url: `${process.env.CLIENT_URL}/paymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        cartItems: JSON.stringify(cartItems), 
      }
    });
    console.log(session,"session");

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
  console.log(sig,"sig...............")
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
        console.log(event,"event...............")

      } catch (err:any) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
      data = event.data.object;
      eventType = event.type;
      console.log(data,"data in if...............")
      console.log(eventType,"eventType...............")
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
      console.log(data,"data...............")
      console.log(eventType,"eventType...............")
    }

    if (eventType === "checkout.session.completed") {
      console.log(data,"hurreeyyyyyyyyyyyy");
      const session = data as Stripe.Checkout.Session;
      console.log(session, "session................");

      const cartItems = session.metadata?.cartItems ? JSON.parse(session.metadata.cartItems) : [];
      console.log(cartItems, "cartItems");

      const orderPromises = cartItems.map(async (item: any) => {
        const { courseId, studentId, courseFee } = item;

        const courseData = await Course.findById(courseId);
        if (!courseData) {
          throw new Error('Course not found');
        }
        console.log(courseData, 'courseData');

        const order = await orderModel.create({
          studentId,
          courseId: courseData._id,
          tutorId: courseData.instructorId,
          amount: courseFee,
          paymentMethod: 'Stripe',
        });
        console.log(order, 'order');

        await Course.findByIdAndUpdate(courseData._id, {
          $push: { students: studentId },
        });

        if (order) {
        const deletedCart = await CartModel.findOneAndDelete({ user: studentId });
        console.log(deletedCart, 'deletedCart');
  
        if (deletedCart) {
          console.log("Cart cleared for user:", studentId);
        } else {
          console.warn("No cart found for user:", studentId);
        }
      }
        return order;
      });
      console.log(orderPromises, "orderPromises");

      const orders = await Promise.all(orderPromises);
      console.log(orders, 'orders');
      res.json({ status: 'success', orders });
    }

    res.status(200).end();
};