import { Request, Response, NextFunction } from "express";
import { LessonService } from "../services/lessonService";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { ApiResponse } from "../utils/ApiResponse";

const lessonService = new LessonService();

export const deleteLesson = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { lessonId } = req.body;
  if (!lessonId) {
    throw new AppError(400, "Lesson ID is required");
  }
  const result = await lessonService.deleteLesson(lessonId);
  res.status(200).json(new ApiResponse(200, result, "Lesson deleted successfully"));
});

export const getViewChapters = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.params;
  if (!courseId) {
    throw new AppError(400, "Course ID is required");
  }
  const lessons = await lessonService.getLessonsByCourseId(courseId);
  res.status(200).json(new ApiResponse(200, lessons));
});

export const getViewChapter = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { lessonId } = req.params;
  if (!lessonId) {
    throw new AppError(400, "Lesson ID is required");
  }
  const lesson = await lessonService.getLessonById(lessonId);
  res.status(200).json(new ApiResponse(200, lesson));
});
