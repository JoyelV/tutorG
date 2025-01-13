"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStripeWebhook = exports.stripePayment = void 0;
const Course_1 = __importDefault(require("../models/Course"));
const stripe_1 = __importDefault(require("stripe"));
const Orders_1 = __importDefault(require("../models/Orders"));
const Cart_1 = __importDefault(require("../models/Cart"));
const Instructor_1 = __importDefault(require("../models/Instructor"));
const stripeSecretKey = process.env.STRIPE_KEY;
if (!stripeSecretKey) {
    throw new Error("Stripe secret key not provided");
}
const stripe = new stripe_1.default(stripeSecretKey, {
    apiVersion: "2024-11-20.acacia",
});
const stripePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cartItems } = req.body;
        console.log(cartItems, "cartItems");
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            res.status(400).json({ error: "Cart items are required." });
            return;
        }
        const lineItems = cartItems.map((item) => {
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
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            billing_address_collection: 'auto',
            success_url: `${process.env.CLIENT_URL}/paymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cart`,
            metadata: {
                type: 'course_purchase',
                cartItems: JSON.stringify(cartItems),
            }
        });
        console.log(session, "session");
        res.json({
            status: true,
            url: session.url,
        });
    }
    catch (error) {
        console.error("Stripe Payment Error:", error);
        res.status(500).json({ error: "Payment processing failed." });
    }
});
exports.stripePayment = stripePayment;
let endpointSecret;
const handleStripeWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const sig = req.headers["stripe-signature"];
    let eventType;
    let data;
    if (endpointSecret) {
        let event;
        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        }
        catch (err) {
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }
        data = event.data.object;
        eventType = event.type;
    }
    else {
        data = req.body.data.object;
        eventType = req.body.type;
    }
    if (eventType === "checkout.session.completed") {
        const flowType = (_a = data.metadata) === null || _a === void 0 ? void 0 : _a.type;
        if (flowType === 'instructor_payout') {
            const result = yield handleInstructorPayout(data);
            if (result) {
                res.json({ status: 'success' });
            }
        }
        else if (flowType === 'course_purchase') {
            const session = data;
            const cartItems = ((_b = session.metadata) === null || _b === void 0 ? void 0 : _b.cartItems) ? JSON.parse(session.metadata.cartItems) : [];
            const sessionId = session.id;
            const orderPromises = cartItems.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                const { courseId, studentId, courseFee } = item;
                const courseData = yield Course_1.default.findById(courseId);
                if (!courseData) {
                    throw new Error('Course not found');
                }
                const order = yield Orders_1.default.create({
                    studentId,
                    courseId: courseData._id,
                    tutorId: courseData.instructorId,
                    amount: courseFee,
                    paymentMethod: 'Stripe',
                    sessionId,
                });
                yield Course_1.default.findByIdAndUpdate(courseData._id, {
                    $push: { students: studentId },
                });
                const instructor = yield Instructor_1.default.findById(courseData.instructorId);
                if (!instructor)
                    throw new Error('Instructor not found');
                const earnings = courseData.courseFee * 0.2;
                instructor.currentBalance = instructor.currentBalance + earnings;
                yield instructor.save();
                if (order) {
                    const deletedCart = yield Cart_1.default.findOneAndDelete({ user: studentId });
                    if (deletedCart) {
                        console.log("Cart cleared for user:", studentId);
                    }
                    else {
                        console.warn("No cart found for user:", studentId);
                    }
                }
                return order;
            }));
            const orders = yield Promise.all(orderPromises);
            res.json({ status: 'success', orders });
        }
        else {
            console.log('Unknown flow type:', flowType);
        }
    }
    res.status(200).end();
});
exports.handleStripeWebhook = handleStripeWebhook;
const handleInstructorPayout = (session) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, amount } = session.metadata;
    const instructor = yield Instructor_1.default.findOne({ email });
    const withdrawnAmount = (amount * 1) / 100;
    if (!instructor) {
        return false;
    }
    instructor.earnings = (Number(instructor.earnings) + withdrawnAmount);
    instructor.totalWithdrawals = (Number(instructor.totalWithdrawals) + 1);
    instructor.currentBalance = (Number(instructor.currentBalance) - withdrawnAmount);
    const newTransaction = {
        date: new Date(),
        method: 'Stripe',
        status: 'completed',
        amount: withdrawnAmount
    };
    instructor.transactions = instructor.transactions || [];
    instructor.transactions.push(newTransaction);
    console.log(instructor, "instructor data pyout updated");
    yield instructor.save();
    return true;
});
