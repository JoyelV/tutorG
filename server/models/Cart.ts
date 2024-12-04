import mongoose, { Schema, Document, Model, model } from 'mongoose';

interface CartItem extends Document {
    user: mongoose.Schema.Types.ObjectId;
    course: mongoose.Schema.Types.ObjectId[];  
}

const cartItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,  
    },
    course: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,  
        },
    ],
});

const CartModel: Model<CartItem> = mongoose.model<CartItem>('Cart', cartItemSchema);

export default CartModel;
