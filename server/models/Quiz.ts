import mongoose, { Schema, Document } from 'mongoose';

interface IQuiz extends Document {
  question: string;
  answer: string;
  options: string[];
  courseId: string; 
}

const quizSchema: Schema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
});

const Quiz = mongoose.model<IQuiz>('Quiz', quizSchema);
export default Quiz;
