import CartModel from '../models/Cart';
import orderModel from '../models/Orders';

class CartRepository {
    async findEnrollment(userId: string, courseId: string) {
        return await orderModel.findOne({ courseId, studentId: userId });
    }

    async findCartItem(userId: string, courseId: string) {
        return await CartModel.findOne({ user: userId, course: courseId });
    }

    async addCartItem(userId: string, courseId: string) {
        const newCartItem = new CartModel({ user: userId, course: courseId });
        return await newCartItem.save();
    }

    async getCartItems(userId: string) {
        return await CartModel.find({ user: userId }).populate('course').lean();
    }

    async removeCartItem(cartItemId: string) {
        return await CartModel.findByIdAndDelete({ _id: cartItemId });
    }
}

export default new CartRepository();

