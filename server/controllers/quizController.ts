import { Request, Response } from 'express';
import Quiz from '../models/Quiz';
import UserQuizResponse from '../models/UserQuizResponse';
import { AuthenticatedRequest } from '../utils/VerifyToken';

export const addQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const { questions } = req.body; 
    const { courseId } = req.params;

    if (!Array.isArray(questions) || questions.length === 0) {
      res.status(400).json({ message: 'Quiz must contain at least one question.' });
      return;
    }

    for (const question of questions) {
      const { question: text, options, answer } = question;

      if (!text || !Array.isArray(options) || options.length !== 4 || !answer) {
        res.status(400).json({ message: 'Each question must have a text, 4 options, and an answer.' });
        return;
      }

      if (!options.includes(answer)) {
        res.status(400).json({ message: 'The answer must match one of the options.' });
        return;
      }
    }

    const newQuiz = new Quiz({
      questions,
      courseId,
    });

    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
  
export const getQuizzesByCourse = async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.params;

  if (!courseId) {
    res.status(400).json({ message: 'Course ID is required.' });
    return;
  }

  try {
    const quizzes = await Quiz.find({ courseId })
      .populate('courseId', 'title description')  
      .exec();

    if (!quizzes || quizzes.length === 0) {
      res.status(404).json({ message: 'No quizzes found for this course.' });
      return;
    }
    res.status(200).json(quizzes);
  } catch (error: any) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Failed to fetch quizzes.', error: error.message });
  }
};

export const getQuizById = async (req: Request, res: Response): Promise<void> => {
  const { courseId, quizId } = req.params;

  try {
    const quiz = await Quiz.findOne({ _id: quizId, courseId });

    if (!quiz) {
      res.status(404).json({ message: 'Quiz not found.' });
      return;
    }
    res.status(200).json(quiz); 
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Failed to fetch quiz.' });
  }
};

export const updateQuiz = async (req: Request, res: Response) : Promise<void> => {
  const { courseId, quizId } = req.params;
  const { question, answer, options } = req.body;

  try {
    const quiz = await Quiz.findOneAndUpdate(
      { _id: quizId, courseId },
      { question, answer, options },
      { new: true, runValidators: true }
    );

    if (!quiz) {
      res.status(404).json({ message: 'Quiz not found.' });
      return 
    }
    res.status(200).json({ message: 'Quiz updated successfully.', quiz });
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ message: 'Failed to update quiz.' });
  }
};

export const deleteQuiz = async (req: Request, res: Response): Promise<void> => {
  const { courseId, quizId } = req.params;

  try {
    const quiz = await Quiz.findOneAndDelete({ _id: quizId, courseId });
    if (!quiz) {
      res.status(404).json({ message: 'Quiz not found.' });
      return 
    }
    res.status(200).json({ message: 'Quiz deleted successfully.' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ message: 'Failed to delete quiz.' });
  }
};

export const submitQuiz = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { quizId, answers } = req.body;
  const userId = req.userId;

  try {
    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) {
      res.status(404).send('Quiz not found');
      return;
    }

    const existingResponse = await UserQuizResponse.findOne({ quizId, userId });

    if (existingResponse && existingResponse.attempts >= 5) {
      res.status(400).send({ message: 'Maximum attempts exceeded for this quiz' });
      return;
    }

    let score = 0;
    const totalQuestions = quiz.questions.length;
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

    res.status(200).send({
      score,
      totalQuestions,
      correctAnswers: correctAnswers.length,
      message: 'Quiz submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).send({ message: 'An error occurred while submitting the quiz' });
  }
};