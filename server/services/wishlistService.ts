import WishlistRepository from '../repositories/wishlistRepository';

class WishlistService {
    async addToWishlist(userId: string, courseId: string) {
        const itemExisted = await WishlistRepository.findItem(userId, courseId);
        if (itemExisted) {
            return { status: 200, message: "Course already existed in Wishlist" };
        }

        await WishlistRepository.addItem(userId, courseId);
        return { status: 201, message: "Course added to wishlist successfully" };
    }

    async getWishlistItems(userId: string) {
        return await WishlistRepository.getItemsByUser(userId);
    }

    async removeWishlistItem(wishlistItemId: string) {
        const removedItem = await WishlistRepository.removeItemById(wishlistItemId);
        if (!removedItem) {
            return { status: 404, message: "Wishlist item not found" };
        }
        return { status: 200, message: "Course removed from the wishlist" };
    }
}

export default new WishlistService();
