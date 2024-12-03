import mongoose ,{Document,Model} from "mongoose";

interface WishListItem extends Document {
    course:mongoose.Schema.Types.ObjectId
    user:mongoose.Schema.Types.ObjectId
}

const wishListItemSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        requied:true
    },
    course:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        requied:true

    }
],
})

const WishListModel :Model<WishListItem>=mongoose.model<WishListItem>("wishList",wishListItemSchema)

export default WishListModel