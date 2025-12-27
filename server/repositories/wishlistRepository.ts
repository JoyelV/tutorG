import WishListModel from '../models/wishlist';

class WishlistRepository {
    async findItem(userId: string, courseId: string) {
        return await WishListModel.findOne({ user: userId, course: courseId });
    }

    async addItem(userId: string, courseId: string) {
        const newItem = new WishListModel({ user: userId, course: courseId });
        return await newItem.save();
    }

    async getItemsByUser(userId: string) {
        return await WishListModel.find({ user: userId }).populate("course");
    }

    async removeItemById(wishlistItemId: string) {
        return await WishListModel.findByIdAndDelete(wishlistItemId);
    }
}

export default new WishlistRepository();