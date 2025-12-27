import Lesson from "../models/Lesson";

export class LessonRepository {
  async deleteLesson(lessonId: string) {
    return await Lesson.findByIdAndDelete(lessonId);
  }

  async getLessonsByCourseId(courseId: string) {
    return await Lesson.find({ courseId });
  }

  async getLessonById(lessonId: string) {
    return await Lesson.findById(lessonId);
  }

  async updateLesson(lessonId: string, updateData: any) {
    return await Lesson.findByIdAndUpdate(lessonId, updateData, { new: true });
  }
}
