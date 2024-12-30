import { Schema, model } from 'mongoose';

const ratingSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    instructorId: { type: Schema.Types.ObjectId, ref: 'Instructor', required: true }, 
    rating: { type: Number, required: true, min: 1, max: 5 }, 
    comment: { type: String }, 
    createdAt: { type: Date, default: Date.now },
});

export default model('Rating', ratingSchema);
