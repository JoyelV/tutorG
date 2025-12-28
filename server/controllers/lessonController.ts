import { Request, Response, NextFunction } from "express";
import { LessonService } from "../services/lessonService";

const lessonService = new LessonService();

export const deleteLesson = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lessonId } = req.body;
    const result = await lessonService.deleteLesson(lessonId);
    res.status(200).json(result);
  } catch (error: unknown) {
  if (error instanceof Error) {
    res.status(500).json({ message: error.message });
  } else {
    res.status(500).json({ message: "An unknown error occurred" });
  }
}

};

export const getViewChapters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const lessons = await lessonService.getLessonsByCourseId(courseId);
    res.status(200).json(lessons);
  } catch (error: unknown) {
  if (error instanceof Error) {
    res.status(500).json({ message: error.message });
  } else {
    res.status(500).json({ message: "An unknown error occurred" });
  }
}

};

export const getViewChapter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lessonId } = req.params;
    const lesson = await lessonService.getLessonById(lessonId);
    res.status(200).json(lesson);
  } catch (error: unknown) {
  if (error instanceof Error) {
    res.status(500).json({ message: error.message });
  } else {
    res.status(500).json({ message: "An unknown error occurred" });
  }
}

};
