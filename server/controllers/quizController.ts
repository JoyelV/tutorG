import { Request, Response } from 'express';
import { QuizService } from '../services/quizService';
import { AuthenticatedRequest } from '../utils/VerifyToken';

export class QuizController {
  private quizService: QuizService;

  constructor() {
    this.quizService = new QuizService();
  }

  addQuiz = async (req: Request, res: Response): Promise<void> => {
    try {
      const { questions } = req.body;
      const { courseId } = req.params;
      const response = await this.quizService.addQuiz(courseId, questions);
      res.status(response.status).json(response.message);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  getQuizzesByCourse = async (req: Request, res: Response): Promise<void> => {
    const { courseId } = req.params;
    try {
      const response = await this.quizService.getQuizzesByCourse(courseId);
      res.status(response.status).json(response.message);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch quizzes.' });
    }
  };

  getQuizById = async (req: Request, res: Response): Promise<void> => {
    const { courseId, quizId } = req.params;
    try {
      const response = await this.quizService.getQuizById(courseId, quizId);
      res.status(response.status).json(response.message);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch quiz.' });
    }
  };

  updateQuiz = async (req: Request, res: Response): Promise<void> => {
    const { courseId, quizId } = req.params;
    const { questions } = req.body;
    try {
      const response = await this.quizService.updateQuiz(courseId, quizId, questions);
      res.status(response.status).json(response.message);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update quiz.' });
    }
  };

  deleteQuiz = async (req: Request, res: Response): Promise<void> => {
    const { courseId, quizId } = req.params;
    try {
      const response = await this.quizService.deleteQuiz(courseId, quizId);
      res.status(response.status).json(response.message);
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete quiz.' });
    }
  };

  submitQuiz = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { quizId, answers } = req.body;
    const userId = req.userId;
    try {
      if(userId){
        const response = await this.quizService.submitQuiz(quizId, userId, answers);
        res.status(response.status).json(response.message);
      }
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while submitting the quiz.' });
    }
  };
}
