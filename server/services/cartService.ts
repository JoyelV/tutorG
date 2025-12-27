import CartRepository from '../repositories/cartRepository';

class CartService {
    async addToCart(userId: string, courseId: string) {
        const alreadyEnrolled = await CartRepository.findEnrollment(userId, courseId);
        if (alreadyEnrolled) {
            return { status: 200, message: "Student is already enrolled in this course" };
        }

        const cartItemExisted = await CartRepository.findCartItem(userId, courseId);
        if (cartItemExisted) {
            return { status: 200, message: "Course already exists in the cart" };
        }

        await CartRepository.addCartItem(userId, courseId);
        return { status: 201, message: "Course added to cart successfully" };
    }

    async getCartItems(userId: string) {
        return await CartRepository.getCartItems(userId);
    }

    async removeCartItem(cartItemId: string) {
        const removedItem = await CartRepository.removeCartItem(cartItemId);
        if (!removedItem) {
            return { status: 404, message: "Cart item not found" };
        }
        return { status: 200, message: "Course removed from the cart" };
    }
}

export default new CartService();