import mongoose, { Schema, Document, Model, model } from 'mongoose';

// Define the CartItem interface extending Document
interface CartItem extends Document {
    user: mongoose.Schema.Types.ObjectId;
    course: mongoose.Schema.Types.ObjectId[];  // Array of ObjectIds for courses
}

// Define the schema for the CartItem
const cartItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,  // Corrected the typo from requied to required
    },
    course: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,  // Corrected the typo from requied to required
        },
    ],
});

// Define the Cart model based on CartItem schema
const CartModel: Model<CartItem> = mongoose.model<CartItem>('Cart', cartItemSchema);

export default CartModel;
