import mongoose, { Schema, Document } from 'mongoose';

interface IUserQuizResponse extends Document {
  quizId: string; 
  userId: string; 
  answers: { questionId: string; answer: string }[]; 
  score: number; 
  attempts: number; 
}

const userQuizResponseSchema: Schema = new Schema({
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    answer: { type: String, required: true }
  }],
  score: { type: Number, default: 0 },
  attempts: { type: Number, default: 0 }, 
}, {
  timestamps: true, 
});

userQuizResponseSchema.index({ quizId: 1, userId: 1 }, { unique: true });

const UserQuizResponse = mongoose.model<IUserQuizResponse>('UserQuizResponse', userQuizResponseSchema);
export default UserQuizResponse;

