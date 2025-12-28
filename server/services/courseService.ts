import { CourseRepository } from '../repositories/courseRepository';
import { ICourse, IPopulatedCourseFeedback, IPopulatedFeedback } from '../entities/ICourse';
import { IUser } from '../entities/IUser';
import mongoose, { Types } from 'mongoose'; 
import { instructorRepository } from '../repositories/instructorRepository';

export class CourseService {
  private courseRepository: CourseRepository;

  constructor() {
    this.courseRepository = new CourseRepository();
  }

  async createCourse(courseData: Partial<ICourse>): Promise<ICourse> {
    const { category } = courseData;
    if (!category) {
      throw new Error('Category is required');
    }

    const categoryData = await this.courseRepository.findCategoryById(
      category as string
    );
    if (!categoryData) {
      throw new Error('Category not found');
    }

    const coursePayload = {
      ...courseData,
      category: categoryData.categoryName,
      subCategory: categoryData.subCategories[0]?.name || '',
      thumbnail: courseData.thumbnail || ' ',
      trailer: courseData.trailer || ' ',
    };

    return await this.courseRepository.createCourse(coursePayload);
  }

  async getCourses(
    page: number,
    limit: number,
    searchTerm: string,
    categoryFilter: string,
    sortOption: string
  ): Promise<{
    courses: ICourse[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const query: any = {
      status: 'published',
      isApproved: true,
    };

    if (searchTerm) query.title = new RegExp(searchTerm, 'i');
    if (categoryFilter && categoryFilter !== 'All Courses')
      query.category = categoryFilter;

    const sort: any = {};
    if (sortOption === 'Low to High') sort.courseFee = 1;
    if (sortOption === 'High to Low') sort.courseFee = -1;
    if (sortOption === 'Latest') sort.createdAt = -1;
    if (sortOption === 'Popular') sort.averageRating = -1;

    const { courses, total } = await this.courseRepository.findCourses(
      query,
      sort,
      page,
      limit
    );

    return {
      courses,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async getRelatedCourses(courseId: string): Promise<ICourse[]> {
    const course = await this.courseRepository.findCourseById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    return await this.courseRepository.findRelatedCourses(
      course.category,
      courseId,
      5
    );
  }

  async getRecentlyAddedCourses(): Promise<ICourse[]> {
    return await this.courseRepository.findRecentlyAddedCourses();
  }

  async getInstructorCourses(instructorId: string): Promise<ICourse[]> {
    if (!instructorId) {
      throw new Error('Instructor ID is required');
    }
    return await this.courseRepository.findInstructorCourses(instructorId);
  }

  async getCourseDatas(page: number, limit: number): Promise<{
    courses: ICourse[];
    totalPages: number;
    currentPage: number;
    total: ICourse[];
  }> {
    const { courses, total, allCourses } = await this.courseRepository.findAllCourses(
      page,
      limit
    );
    return {
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total: allCourses,
    };
  }

  async updateCourseRating(
    courseId: string,
    userId: string,
    rating: number,
    feedback: string
  ): Promise<ICourse> {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error('Invalid course ID format');
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }

    const course = await this.courseRepository.updateCourseRating(
      courseId,
      userId,
      rating,
      feedback
    );
    if (!course) {
      throw new Error('Course not found');
    }
    return course;
  }

  async getCourseWithFeedbacks(courseId: string): Promise<IPopulatedCourseFeedback> {
    const course = await this.courseRepository.findCourseWithFeedbacks(courseId);
    if (!course) {
      throw new Error('Course not found');
    }
  
    const populated = (course.ratingsAndFeedback as unknown) as IPopulatedFeedback[];
    return {
      courseId: course._id as Types.ObjectId,
      courseTitle: course.title,
      feedbacks: populated.map((feedback) => ({
        userId: feedback.userId as unknown as IUser,
        username: (feedback.userId as unknown as IUser).username,
        email: (feedback.userId as unknown as IUser).email,
        image: (feedback.userId as unknown as IUser).image,
        rating: feedback.rating,
        feedback: feedback.feedback,
        createdAt: feedback.createdAt,
        updatedAt: feedback.updatedAt,
      })),
    };
  }

  async getInstructorData(instructorId: string): Promise<any> {
    if (!instructorId) {
      throw new Error('User ID is missing');
    }
    const user = await instructorRepository.findUserById(instructorId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getIndividualCourse(courseId: string): Promise<ICourse> {
    const course = await this.courseRepository.findIndividualCourse(courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    return course;
  }

  async getCompletionCertificate(
    courseId: string,
    studentId: string
  ): Promise<{
    courseName: string;
    studentName: string;
    completionDate: string;
  }> {
    const { course, studentProgress, student } =
      await this.courseRepository.findCompletionCertificate(courseId, studentId);

    if (!course) {
      throw new Error('Course not found');
    }
    if (!studentProgress) {
      throw new Error('Student progress not found');
    }

    if (!studentProgress.completionDate) {
      studentProgress.completionDate = new Date();
      await studentProgress.save();
    }

    const formattedCompletionDate = studentProgress.completionDate
      ? new Date(studentProgress.completionDate).toLocaleDateString('en-GB')
      : 'Not completed yet';

    return {
      courseName: course.title,
      studentName: student?.username || 'Anonymous',
      completionDate: formattedCompletionDate,
    };
  }

  async getStudentCourseSummary(studentId: string): Promise<{
    enrolledCourses: any[];
    totalEnrolled: number;
    completedCourses: any[];
    totalCompleted: number;
    ongoingCourses: any[];
    totalOngoing: number;
    uniqueTutors: number;
  }> {
    const { enrolledCourses, completedCourses, ongoingCourses, uniqueTutors } =
      await this.courseRepository.findStudentCourseSummary(studentId);

    return {
      enrolledCourses,
      totalEnrolled: enrolledCourses.length,
      completedCourses,
      totalCompleted: completedCourses.length,
      ongoingCourses,
      totalOngoing: ongoingCourses.length,
      uniqueTutors: uniqueTutors.length,
    };
  }

  async getIndividualCourseData(
    courseId: string,
    studentId: string
  ): Promise<{
    course: ICourse;
    completedLessons: number;
    totalLessons: number;
  }> {
    const { course, order, studentProgress, totalLessons } =
      await this.courseRepository.findIndividualCourseData(courseId, studentId);

    if (!course) {
      throw new Error('Course not found');
    }
    if (!order) {
      throw new Error('You have not purchased this course');
    }

    const completedLessonsCount = studentProgress
      ? studentProgress.completedLessons.length
      : 0;

    return {
      course,
      completedLessons: completedLessonsCount,
      totalLessons,
    };
  }

  async toggleCourseApproval(courseId: string): Promise<ICourse> {
    const course = await this.courseRepository.toggleCourseApproval(courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    return course;
  }

  async getTutorCourses(page: number, limit: number): Promise<{
    courses: ICourse[];
    totalCourses: number;
    totalPages: number;
    currentPage: number;
  }> {
    if (isNaN(page) || isNaN(limit)) {
      throw new Error('Invalid page or limit value');
    }

    const { courses, total } = await this.courseRepository.findTutorCourses(
      page,
      limit
    );

    return {
      courses,
      totalCourses: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async getMyTutorCourses(
    instructorId: string,
    page: number,
    limit: number
  ): Promise<{
    courses: ICourse[];
    totalCourses: number;
    totalPages: number;
    currentPage: number;
  }> {
    if (isNaN(page) || isNaN(limit)) {
      throw new Error('Invalid page or limit value');
    }

    const { courses, total } = await this.courseRepository.findMyTutorCourses(
      instructorId,
      page,
      limit
    );

    return {
      courses,
      totalCourses: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async getViewCourse(courseId: string): Promise<ICourse> {
    const course = await this.courseRepository.findViewCourse(courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    return course;
  }

  async addLesson(lessonData: {
    lessonTitle: string;
    lessonDescription: string;
    lessonVideo?: string;
    lessonPdf?: string;
    courseId: string;
  }): Promise<any> {
    if (
      !lessonData.lessonTitle ||
      !lessonData.lessonDescription ||
      !lessonData.courseId
    ) {
      throw new Error('All required fields must be filled');
    }
    return await this.courseRepository.createLesson(lessonData);
  }

  async deleteLesson(lessonId: string): Promise<void> {
    const lesson = await this.courseRepository.deleteLesson(lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }
  }

  async getLessonsByCourseId(courseId: string): Promise<any[]> {
    const lessons = await this.courseRepository.findLessonsByCourseId(courseId);
    if (!lessons || lessons.length === 0) {
      throw new Error('No lessons found for this course');
    }
    return lessons;
  }

  async getLessonById(lessonId: string): Promise<any> {
    const lesson = await this.courseRepository.findLessonById(lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }
    return lesson;
  }

  async updateLesson(
    lessonId: string,
    lessonData: {
      lessonTitle?: string;
      lessonDescription?: string;
      lessonVideo?: string;
      lessonPdf?: string;
    }
  ): Promise<any> {
    const existingLesson = await this.courseRepository.findLessonById(lessonId);
    if (!existingLesson) {
      throw new Error('Lesson not found');
    }

    if (!lessonData.lessonPdf && existingLesson.lessonPdf) {
      lessonData.lessonPdf = existingLesson.lessonPdf;
    }

    const updatedLesson = await this.courseRepository.updateLesson(
      lessonId,
      lessonData
    );
    if (!updatedLesson) {
      throw new Error('Failed to update lesson');
    }
    return updatedLesson;
  }

  async editCourse(courseId: string, courseData: Partial<ICourse>): Promise<ICourse> {
    const { category } = courseData;
    let subCategory = '';

    if (category) {
      const categoryData = await this.courseRepository.findCategoryById(category);
      if (!categoryData) {
        throw new Error(`Category '${category}' not found`);
      }
      subCategory = categoryData.subCategories[0]?.name || '';
      courseData = {
        ...courseData,
        category: categoryData.categoryName,
        subCategory,
      };
    }

    const updatedCourse = await this.courseRepository.updateCourse(courseId, courseData);

    if (!updatedCourse) {
      throw new Error('Course not found');
    }
    return updatedCourse;
  }

  async deleteCourse(courseId: string): Promise<ICourse> {
    if (!mongoose.isValidObjectId(courseId)) {
      throw new Error('Invalid course ID');
    }
    const course = await this.courseRepository.deleteCourse(courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    return course;
  }

  async publishCourse(courseId: string): Promise<ICourse> {
    const course = await this.courseRepository.publishCourse(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    await this.courseRepository.createNotification({
      tutorId: course.instructorId.toString(),
      title: course.title,
      subtitle: course.subtitle,
      thumbnail: course.thumbnail,
      message: `Your course "${course.title}" has been successfully published.`,
      isRead: false,
    });

    return course;
  }

  async rejectCourse(courseId: string): Promise<ICourse> {
    const course = await this.courseRepository.rejectCourse(courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    return course;
  }

  async updateProgress(
    courseId: string,
    studentId: string,
    completedLesson: string,
    videoSource: string
  ): Promise<{ message: string; progressPercentage?: number }> {
    const course = await this.courseRepository.findCourseById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    if (videoSource === course.trailer) {
      return { message: 'Trailer viewed successfully' };
    }

    const progress = await this.courseRepository.updateProgress(
      courseId,
      studentId,
      completedLesson
    );

    return {
      message: progress.isCompleted
        ? 'Course completed successfully!'
        : 'Progress updated successfully',
      progressPercentage: progress.progressPercentage,
    };
  }

  async getEnrolledCoursesCount(instructorId: string): Promise<number> {
    return await this.courseRepository.findEnrolledCoursesCount(instructorId);
  }

  async getMyCoursesCount(instructorId: string): Promise<number> {
    return await this.courseRepository.findInstructorCoursesCount(instructorId);
  }

  async getMyStudentsCount(instructorId: string): Promise<number> {
    return await this.courseRepository.findInstructorStudentsCount(instructorId);
  }

  async getMyEarnings(instructorId: string): Promise<number> {
    const earnings = await this.courseRepository.findInstructorEarnings(instructorId);
    if (earnings === null) {
      throw new Error('Instructor not found');
    }
    return earnings;
  }

  async getEarningDetails(instructorId: string): Promise<{
    currentBalance: number;
    totalWithdrawals: number;
  }> {
    const details = await this.courseRepository.findInstructorEarningDetails(instructorId);
    if (!details) {
      throw new Error('Instructor not found');
    }
    return details;
  }

  async getWithdrawalHistory(instructorId: string): Promise<any[]> {
    const history = await this.courseRepository.findWithdrawalHistory(instructorId);
    if (!history) {
      throw new Error('Instructor not found');
    }
    return history;
  }

  async getNotifications(): Promise<any[]> {
    return await this.courseRepository.findNotifications();
  }
}