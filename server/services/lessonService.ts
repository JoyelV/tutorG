import { LessonRepository } from "../repositories/lessonRepository";

export class LessonService {
  private lessonRepository: LessonRepository;

  constructor() {
    this.lessonRepository = new LessonRepository();
  }

  async deleteLesson(lessonId: string) {
    if (!lessonId) throw new Error("Lesson ID is required.");
    
    const deletedLesson = await this.lessonRepository.deleteLesson(lessonId);
    if (!deletedLesson) throw new Error("Lesson not found.");

    return { message: "Lesson deleted successfully." };
  }

  async getLessonsByCourseId(courseId: string) {
    return await this.lessonRepository.getLessonsByCourseId(courseId);
  }

  async getLessonById(lessonId: string) {
    const lesson = await this.lessonRepository.getLessonById(lessonId);
    if (!lesson) throw new Error("Lesson not found.");
    return lesson;
  }

  async updateLesson(lessonId: string, updateData: any) {
    const updatedLesson = await this.lessonRepository.updateLesson(lessonId, updateData);
    if (!updatedLesson) throw new Error("Lesson not found.");
    return updatedLesson;
  }
}
