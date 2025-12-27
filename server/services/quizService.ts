import { QuizRepository } from '../repositories/QuizRepository';
import { UserQuizResponseRepository } from '../repositories/quizResponseRepository';

export class QuizService {
  private quizRepository: QuizRepository;
  private userQuizResponseRepository: UserQuizResponseRepository;

  constructor() {
    this.quizRepository = new QuizRepository();
    this.userQuizResponseRepository = new UserQuizResponseRepository();
  }

  async addQuiz(courseId: string, questions: any[]): Promise<any> {
    if (!Array.isArray(questions) || questions.length === 0) {
      return { status: 400, message: 'Quiz must contain at least one question.' };
    }

    for (const question of questions) {
      const { question: text, options, answer } = question;

      if (!text || !Array.isArray(options) || options.length !== 4 || !answer) {
        return { status: 400, message: 'Each question must have a text, 4 options, and an answer.' };
      }

      if (!options.includes(answer)) {
        return { status: 400, message: 'The answer must match one of the options.' };
      }
    }

    return this.quizRepository.addQuiz(courseId, questions);
  }

  async getQuizzesByCourse(courseId: string): Promise<any> {
    return this.quizRepository.getQuizzesByCourse(courseId);
  }

  async getQuizById(courseId: string, quizId: string): Promise<any> {
    return this.quizRepository.getQuizById(courseId, quizId);
  }

  async updateQuiz(courseId: string, quizId: string, questions: any[]): Promise<any> {
    return this.quizRepository.updateQuiz(courseId, quizId, questions);
  }

  async deleteQuiz(courseId: string, quizId: string): Promise<any> {
    return this.quizRepository.deleteQuiz(courseId, quizId);
  }

  async submitQuiz(quizId: string, userId: string, answers: any[]): Promise<any> {
    return this.userQuizResponseRepository.submitQuiz(quizId, userId, answers);
  }
}
