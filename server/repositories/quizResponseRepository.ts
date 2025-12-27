import UserQuizResponse from '../models/UserQuizResponse';
import Quiz from '../models/Quiz';

export class UserQuizResponseRepository {
  async submitQuiz(quizId: string, userId: string, answers: any[]): Promise<any> {
    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) {
      return { status: 404, message: 'Quiz not found' };
    }

    const existingResponse = await UserQuizResponse.findOne({ quizId, userId });
    if (existingResponse && existingResponse.attempts >= 5) {
      return { status: 400, message: 'Maximum attempts exceeded for this quiz' };
    }

    let score = 0;
    const correctAnswers: string[] = [];

    answers.forEach((answer: { questionId: string; answer: string }) => {
      const question = quiz.questions.find(q => q._id.toString() === answer.questionId.toString());
      if (question && question.answer === answer.answer) {
        score += 1;
        correctAnswers.push(answer.questionId);
      }
    });

    if (existingResponse) {
      existingResponse.answers = answers;
      existingResponse.score = score;
      existingResponse.attempts += 1;
      await existingResponse.save();
    } else {
      const userQuizResponse = new UserQuizResponse({
        quizId,
        userId,
        answers,
        score,
        attempts: 1,
      });
      await userQuizResponse.save();
    }

    return {
      status: 200,
      message: {
        score,
        totalQuestions: quiz.questions.length,
        correctAnswers: correctAnswers.length,
        message: 'Quiz submitted successfully',
      },
    };
  }
}
