import mongoose, { Model, Types } from 'mongoose';
import { ICourse, ICourseProgress } from '../entities/ICourse';
import Category from '../models/Category';
import CourseProgress from '../models/Progress';
import Notifications from '../models/Notification';
import Lessons from '../models/Lesson';
import { CategoryDocument } from '../models/Category'; 
import { LessonDocument } from '../models/Lesson';
import { INotification } from '../models/Notification';
import { ORDER } from '../models/Orders'; 
import { IUser } from '../entities/IUser';

// Model imports
const Course: Model<ICourse> = mongoose.model<ICourse>('Course');
const Orders: Model<ORDER> = mongoose.model<ORDER>('Orders');
const Users: Model<IUser> = mongoose.model<IUser>('User');

export class CourseRepository {
  async findCourses(
    query: any,
    sort: any,
    page: number,
    limit: number
  ): Promise<{ courses: ICourse[]; total: number }> {
    const skip = (page - 1) * limit;
    const courses = await Course.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    const total = await Course.countDocuments(query);
    return { courses: courses as ICourse[], total };
  }

  async findCourseById(courseId: string): Promise<ICourse | null> {
    return await Course.findById(courseId).lean().exec() as ICourse | null;
  }

  async findRelatedCourses(
    category: string,
    courseId: string,
    limit: number
  ): Promise<ICourse[]> {
    return await Course.find({
      category,
      _id: { $ne: courseId },
      status: 'published',
      isApproved: true,
    })
      .limit(limit)
      .lean()
      .exec() as ICourse[];
  }

  async findRecentlyAddedCourses(): Promise<ICourse[]> {
    return await Course.find({ status: 'published', isApproved: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()
      .exec() as ICourse[];
  }

  async findInstructorCourses(instructorId: string): Promise<ICourse[]> {
    return await Course.find({ instructorId, status: 'published' })
      .lean()
      .exec() as ICourse[];
  }

  async findAllCourses(
    page: number,
    limit: number
  ): Promise<{ courses: ICourse[]; total: number; allCourses: ICourse[] }> {
    const skip = (page - 1) * limit;
    const courses = await Course.find()
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    const allCourses = await Course.find().lean().exec();
    const total = await Course.countDocuments();
    return {
      courses: courses as ICourse[],
      total,
      allCourses: allCourses as ICourse[],
    };
  }

  async updateCourseRating(
    courseId: string,
    userId: string,
    rating: number,
    feedback: string
  ): Promise<ICourse> {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    course.ratingsAndFeedback.push({
      userId: new Types.ObjectId(userId),
      rating,
      feedback,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Fallback if calculateAverageRating is missing
    if (typeof course.calculateAverageRating === 'function') {
      await course.calculateAverageRating();
    } else {
      const totalRatings = course.ratingsAndFeedback.length;
      const sumRatings = course.ratingsAndFeedback.reduce((sum, r) => sum + r.rating, 0);
      course.averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
    }

    await course.save();
    return course.toObject() as ICourse;
  }

  async findCourseWithFeedbacks(courseId: string): Promise<ICourse | null> {
    return await Course.findById(courseId)
      .populate('ratingsAndFeedback.userId', 'username email image')
      .lean()
      .exec() as ICourse | null;
  }

  async findIndividualCourse(courseId: string): Promise<ICourse | null> {
    return await Course.findById(courseId).lean().exec() as ICourse | null;
  }

  async findCompletionCertificate(
    courseId: string,
    studentId: string
  ): Promise<{
    course?: ICourse | null;
    studentProgress?: ICourseProgress | null;
    student?: IUser | null;
  }> {
    const course = await Course.findById(courseId).lean().exec() as ICourse | null;
    const studentProgress = await CourseProgress.findOne({
      courseId,
      studentId,
    })
      .lean()
      .exec() as ICourseProgress | null;
    const student = await Users.findById(studentId).lean().exec() as IUser | null;
    return { course, studentProgress, student };
  }

  async findStudentCourseSummary(studentId: string): Promise<{
    enrolledCourses: ICourse[];
    completedCourses: any[];
    ongoingCourses: any[];
    uniqueTutors: string[];
  }> {
    const enrolledCourses = await Course.find({ students: studentId })
      .lean()
      .exec();
    const progress = await CourseProgress.find({ studentId })
      .lean()
      .exec();
    const completedCourses = progress
      .filter((p) => p.completionDate)
      .map((p) => enrolledCourses.find((c) => c._id.toString() === p.courseId.toString()));
    const ongoingCourses = enrolledCourses.filter(
      (c) => !progress.some((p) => p.courseId.toString() === c._id.toString() && p.completionDate)
    );
    const uniqueTutors = [...new Set(enrolledCourses.map((c) => c.instructorId.toString()))];
    return {
      enrolledCourses: enrolledCourses as ICourse[],
      completedCourses: completedCourses.filter(Boolean) as any[],
      ongoingCourses: ongoingCourses as any[],
      uniqueTutors,
    };
  }

  async findIndividualCourseData(
    courseId: string,
    studentId: string
  ): Promise<{
    course: ICourse | null;
    order: ORDER | null;
    studentProgress: ICourseProgress | null;
    totalLessons: number;
  }> {
    const course = await Course.findById(courseId).lean().exec() as ICourse | null;
    const order = await Orders.findOne({ courseId, studentId })
      .lean()
      .exec() as ORDER | null;
    const studentProgress = await CourseProgress.findOne({
      courseId,
      studentId,
    })
      .lean()
      .exec() as ICourseProgress | null;
    const lessons = await Lessons.find({ courseId }).lean().exec();
    const totalLessons = lessons.length;
    return { course, order, studentProgress, totalLessons };
  }

  async findTutorCourses(
    page: number,
    limit: number
  ): Promise<{ courses: ICourse[]; total: number }> {
    const skip = (page - 1) * limit;
    const courses = await Course.find({ status: 'published' })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    const total = await Course.countDocuments({ status: 'published' });
    return { courses: courses as ICourse[], total };
  }

  async findMyTutorCourses(
    instructorId: string,
    page: number,
    limit: number
  ): Promise<{ courses: ICourse[]; total: number }> {
    const skip = (page - 1) * limit;
    const courses = await Course.find({ instructorId })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    const total = await Course.countDocuments({ instructorId });
    return { courses: courses as ICourse[], total };
  }

  async findViewCourse(courseId: string): Promise<ICourse | null> {
    return await Course.findById(courseId).lean().exec() as ICourse | null;
  }

  async createCourse(courseData: Partial<ICourse>): Promise<ICourse> {
    const course = new Course(courseData);
    return (await course.save()).toObject() as ICourse;
  }

  async findCategoryById(categoryId: string): Promise<CategoryDocument | null> {
    return await Category.findById(categoryId).lean().exec() as CategoryDocument | null;
  }

  async updateCourse(courseId: string, courseData: Partial<ICourse>): Promise<ICourse | null> {
    return await Course.findByIdAndUpdate(courseId, courseData, { new: true })
      .lean()
      .exec() as ICourse | null;
  }

  async deleteCourse(courseId: string): Promise<ICourse> {
    const course = await Course.findByIdAndDelete(courseId).lean().exec();
    if (!course) {
      throw new Error('Course not found');
    }
    return course as ICourse;
  }

  async toggleCourseApproval(courseId: string): Promise<ICourse> {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    course.isApproved = !course.isApproved;
    await course.save();
    return course.toObject() as ICourse;
  }

  async publishCourse(courseId: string): Promise<ICourse> {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    course.status = 'published';
    await course.save();
    return course.toObject() as ICourse;
  }

  async rejectCourse(courseId: string): Promise<ICourse> {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    course.status = 'rejected';
    await course.save();
    return course.toObject() as ICourse;
  }

  async createNotification(notificationData: {
    tutorId: string;
    title: string;
    subtitle: string;
    thumbnail: string;
    message: string;
    isRead: boolean;
  }): Promise<INotification> {
    const notification = new Notifications({
      ...notificationData,
      tutorId: new Types.ObjectId(notificationData.tutorId),
    });
    return (await notification.save()).toObject() as INotification;
  }

  async createLesson(lessonData: {
    lessonTitle: string;
    lessonDescription: string;
    lessonVideo?: string;
    lessonPdf?: string;
    courseId: string;
  }): Promise<LessonDocument> {
    const lesson = new Lessons(lessonData);
    return (await lesson.save()).toObject() as LessonDocument;
  }

  async deleteLesson(lessonId: string): Promise<LessonDocument | null> {
    return await Lessons.findByIdAndDelete(lessonId).lean().exec() as LessonDocument | null;
  }

  async findLessonsByCourseId(courseId: string): Promise<LessonDocument[]> {
    return await Lessons.find({ courseId }).lean().exec() as LessonDocument[];
  }

  async findLessonById(lessonId: string): Promise<LessonDocument | null> {
    return await Lessons.findById(lessonId).lean().exec() as LessonDocument | null;
  }

  async updateLesson(
    lessonId: string,
    lessonData: {
      lessonTitle?: string;
      lessonDescription?: string;
      lessonVideo?: string;
      lessonPdf?: string;
    }
  ): Promise<LessonDocument | null> {
    return await Lessons.findByIdAndUpdate(lessonId, lessonData, { new: true })
      .lean()
      .exec() as LessonDocument | null;
  }

  async updateProgress(
    courseId: string,
    studentId: string,
    completedLesson: string
  ): Promise<{ isCompleted: boolean; progressPercentage: number }> {
    let progress = await CourseProgress.findOne({ courseId, studentId }).exec();
    if (!progress) {
      progress = new CourseProgress({
        courseId,
        studentId,
        completedLessons: [],
      });
    }

    const lessonId = new Types.ObjectId(completedLesson);
    if (!progress.completedLessons.some((id) => id.toString() === lessonId.toString())) {
      progress.completedLessons.push(lessonId);
    }

    const lessons = await Lessons.find({ courseId }).lean().exec();
    const totalLessons = lessons.length;
    const completedLessons = progress.completedLessons.length;
    const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    if (completedLessons === totalLessons && !progress.completionDate) {
      progress.completionDate = new Date();
    }

    await progress.save();
    return {
      isCompleted: !!progress.completionDate,
      progressPercentage,
    };
  }

  async findEnrolledCoursesCount(instructorId: string): Promise<number> {
    const courses = await Course.find({ instructorId }).lean().exec();
    return courses.reduce((acc, course) => acc + (course.students?.length || 0), 0);
  }

  async findInstructorCoursesCount(instructorId: string): Promise<number> {
    return await Course.countDocuments({ instructorId });
  }

  async findInstructorStudentsCount(instructorId: string): Promise<number> {
    const courses = await Course.find({ instructorId }).lean().exec();
    const studentIds = new Set(courses.flatMap((course) => course.students?.map((s) => s.toString()) || []));
    return studentIds.size;
  }

  async findInstructorEarnings(instructorId: string): Promise<number> {
    const courses = await Course.find({ instructorId }).lean().exec();
    return courses.reduce((acc, course) => acc + (course.students?.length || 0) * course.courseFee, 0);
  }

  async findInstructorEarningDetails(instructorId: string): Promise<{
    currentBalance: number;
    totalWithdrawals: number;
  }> {
    const earnings = await this.findInstructorEarnings(instructorId);
    return { currentBalance: earnings, totalWithdrawals: 0 };
  }

  async findWithdrawalHistory(instructorId: string): Promise<any[]> {
    return [];
  }

  async findNotifications(): Promise<INotification[]> {
    return await Notifications.find().lean().exec() as INotification[];
  }
}