import { Request, Response } from 'express';
import Quiz from '../models/Quiz';

export const addQuiz = async (req: Request, res: Response): Promise<void> => {
    try {
      const { question, answer, option1, option2, option3, option4 } = req.body;
      const { courseId } = req.params;
  
      const newQuiz = new Quiz({
        question,
        answer,
        options: [option1, option2, option3, option4],
        courseId,
      });
  
      const savedQuiz = await newQuiz.save();
      res.status(201).json(savedQuiz);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
};
  
// Get all quizzes for a specific course
export const getQuizzesByCourse = async (req: Request, res: Response) : Promise<void> => {
  const { courseId } = req.params;
  console.log("courseId",courseId);
  
  try {
    const quizzes = await Quiz.find({ courseId });
    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Failed to fetch quizzes.' });
  }
};

// Get a specific quiz by ID
export const getQuizById = async (req: Request, res: Response): Promise<void> => {
  const { courseId, quizId } = req.params;

  try {
    const quiz = await Quiz.findOne({ _id: quizId, courseId });
    if (!quiz) {
      res.status(404).json({ message: 'Quiz not found.' });
      return 
    }
    res.status(200).json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Failed to fetch quiz.' });
  }
};

// Update a quiz
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

// Delete a quiz
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
