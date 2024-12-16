import mongoose, { Schema, Document } from 'mongoose';

interface IQuestion {
  _id: mongoose.Types.ObjectId; 
  question: string;
  answer: string;
  options: string[];
}

interface IQuiz extends Document {
  questions: IQuestion[];
  courseId: string;
}

const questionSchema: Schema = new Schema({
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
    validate: {
      validator: function (options: string[]) {
        return options.length === 4; 
      },
      message: 'Each question must have exactly 4 options.',
    },
  },
});

const quizSchema: Schema = new Schema({
  questions: {
    type: [questionSchema], 
    required: true,
    validate: {
      validator: function (questions: IQuestion[]) {
        return questions.length > 0; 
      },
      message: 'A quiz must have at least one question.',
    },
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
});

const Quiz = mongoose.model<IQuiz>('Quiz', quizSchema);
export default Quiz;
