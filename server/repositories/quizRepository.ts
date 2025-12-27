import Quiz from '../models/Quiz';

export class QuizRepository {
  async addQuiz(courseId: string, questions: any[]): Promise<any> {
    const newQuiz = new Quiz({ questions, courseId });
    const savedQuiz = await newQuiz.save();
    return { status: 201, message: savedQuiz };
  }

  async getQuizzesByCourse(courseId: string): Promise<any> {
    const quizzes = await Quiz.find({ courseId }).populate('courseId', 'title description').exec();
    if (!quizzes || quizzes.length === 0) {
      return { status: 204, message: 'No quizzes found for this course.' };
    }
    return { status: 200, message: quizzes };
  }

  async getQuizById(courseId: string, quizId: string): Promise<any> {
    const quiz = await Quiz.findOne({ _id: quizId, courseId });
    if (!quiz) {
      return { status: 404, message: 'Quiz not found.' };
    }
    return { status: 200, message: quiz };
  }

  async updateQuiz(courseId: string, quizId: string, questions: any[]): Promise<any> {
    const quiz = await Quiz.findOne({ _id: quizId, courseId });
    if (!quiz) {
      return { status: 404, message: 'Quiz not found.' };
    }

    quiz.questions = questions;
    await quiz.save();
    return { status: 200, message: { message: 'Quiz updated successfully.', quiz } };
  }

  async deleteQuiz(courseId: string, quizId: string): Promise<any> {
    const quiz = await Quiz.findOneAndDelete({ _id: quizId, courseId });
    if (!quiz) {
      return { status: 404, message: 'Quiz not found.' };
    }
    return { status: 200, message: { message: 'Quiz deleted successfully.' } };
  }
}
