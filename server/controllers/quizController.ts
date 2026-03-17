import { Request, Response } from 'express';
import { QuizService } from '../services/quizService';
import { AuthenticatedRequest } from '../utils/VerifyToken';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../utils/ApiResponse';

export class QuizController {
  private quizService: QuizService;

  constructor() {
    this.quizService = new QuizService();
  }

  addQuiz = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { questions } = req.body;
    const { courseId } = req.params;
    if (!courseId) {
      throw new AppError(400, 'Course ID is required');
    }
    const response = await this.quizService.addQuiz(courseId, questions);
    res.status(response.status).json(new ApiResponse(response.status, null, response.message));
  });

  getQuizzesByCourse = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { courseId } = req.params;
    if (!courseId) {
      throw new AppError(400, 'Course ID is required');
    }
    const response = await this.quizService.getQuizzesByCourse(courseId);
    res.status(response.status).json(new ApiResponse(response.status, response.message));
  });

  getQuizById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { courseId, quizId } = req.params;
    if (!courseId || !quizId) {
      throw new AppError(400, 'Course ID and Quiz ID are required');
    }
    const response = await this.quizService.getQuizById(courseId, quizId);
    res.status(response.status).json(new ApiResponse(response.status, response.message));
  });

  updateQuiz = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { courseId, quizId } = req.params;
    const { questions } = req.body;
    if (!courseId || !quizId) {
      throw new AppError(400, 'Course ID and Quiz ID are required');
    }
    const response = await this.quizService.updateQuiz(courseId, quizId, questions);
    res.status(response.status).json(new ApiResponse(response.status, null, response.message));
  });

  deleteQuiz = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { courseId, quizId } = req.params;
    if (!courseId || !quizId) {
      throw new AppError(400, 'Course ID and Quiz ID are required');
    }
    const response = await this.quizService.deleteQuiz(courseId, quizId);
    res.status(response.status).json(new ApiResponse(response.status, null, response.message));
  });

  submitQuiz = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { quizId, answers } = req.body;
    const userId = req.userId;
    if (!userId) {
      throw new AppError(401, 'Unauthorized');
    }
    if (!quizId) {
      throw new AppError(400, 'Quiz ID is required');
    }
    const response = await this.quizService.submitQuiz(quizId, userId, answers);
    res.status(response.status).json(new ApiResponse(response.status, response.message));
  });
}
