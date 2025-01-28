import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Course from '../models/Course';
import Category from "../models/Category";
import Lesson from "../models/Lesson";
import orderModel from "../models/Orders";
import { AuthenticatedRequest } from '../utils/VerifyToken';
import { instructorRepository } from "../repositories/instructorRepository";
import Instructor from "../models/Instructor";
import User from "../models/User";
import Notification from "../models/Notification";
import Progress from "../models/Progress";

/**
 * Create a course with basic information.
 */
export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, subtitle, category, language, level, duration, courseFee, description, requirements, learningPoints, targetAudience, instructorId, thumbnail, trailer } = req.body;
    const categoryData = await Category.findById(category);
    const categoryName = categoryData?.categoryName;
    const subCategory = categoryData?.subCategories[0].name;

    const courseData = new Course({
      title: title,
      subtitle: subtitle,
      category: categoryName,
      subCategory: subCategory,
      language: language,
      level: level,
      duration: duration,
      courseFee,
      description: description,
      requirements: requirements,
      learningPoints: learningPoints,
      targetAudience: targetAudience,
      thumbnail: thumbnail || " ",
      trailer: trailer || " ",
      instructorId: instructorId,
    });
    await courseData.save();
    res.status(201).json({
      message: "Course created successfully",
      courseId: courseData._id,
      course: courseData,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Failed to create course" });
  }
};

export const getCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      searchTerm = '',
      filter = '',
      sortOption = '',
    } = req.query;

    const currentPage = Number(page);
    const pageSize = Number(limit);
    const search = typeof searchTerm === 'string' ? searchTerm : '';
    const categoryFilter = typeof filter === 'string' ? filter : '';

    const query: any = {
      status: 'published',
      isApproved: true,
    };

    if (search) query.title = new RegExp(search, 'i');
    if (categoryFilter && categoryFilter !== 'All Courses') query.category = categoryFilter;

    const sort: any = {};
    if (sortOption === 'Low to High') sort.courseFee = 1;
    if (sortOption === 'High to Low') sort.courseFee = -1;
    if (sortOption === 'Latest') sort.createdAt = -1;
    if (sortOption === 'Popular') sort.averageRating = -1;

    const total = await Course.countDocuments(query);

    const courses = await Course.find(query)
      .sort(sort)
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      courses,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage,
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    next({ status: 500, message: 'Error fetching courses', error });
  }
};

export const getRelatedCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    const relatedCourses = await Course.find({
      category: course.category,
      _id: { $ne: courseId },
      status: 'published',
    }).limit(5);

    res.status(200).json(relatedCourses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch related courses", error });
  }
}

export const getRecentlyAddedCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const courses = await Course.find({
      status: 'published',
      isApproved: true,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title category courseFee thumbnail averageRating students');

    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching recently added courses:', error);
    res.status(500).json({ message: 'Server error. Could not fetch courses.' });
  }
};

export const getInstructorCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { instructorId } = req.params;

  if (!instructorId) {
    res.status(400).json({ message: "Instructor ID is required." });
    return;
  }

  try {
    const courses = await Course.find({ instructorId,status:"published" }).select('title category courseFee thumbnail averageRating students');
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching recently added courses:', error);
    res.status(500).json({ message: 'Server error. Could not fetch courses.' });
  }
};

export const getCourseDatas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  try {
    const courses = await Course.find().skip((page - 1) * limit).limit(limit);
    const totalCourses = await Course.countDocuments();
    const total = await Course.find();
    res.json({
      courses,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

export const updateCourseRating = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { courseId } = req.params;
    const { userId, rating, feedback } = req.body;
    const user_id = req.userId;

    const orders = await orderModel.find({ studentId: user_id });
    if (orders.length === 0) {
      res.status(404).json({ message: 'No purchase history found' });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      res.status(400).json({ message: "Invalid course ID format" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid user ID format" });
      return;
    }

    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    const existingFeedback = course.ratingsAndFeedback.find(
      (entry) => entry.userId.toString() === userId
    );

    if (existingFeedback) {
      existingFeedback.rating = rating;
      existingFeedback.feedback = feedback;
      existingFeedback.updatedAt = new Date(); 
    } else {
      course.ratingsAndFeedback.push({ userId, rating, feedback,createdAt: new Date(), updatedAt: new Date(), });
    }
    await course.calculateAverageRating();

    res.status(200).json({
      message: "Course rating updated successfully",
      course,
    });
  } catch (error) {
    console.error("Error updating course rating:", error);
    next({ status: 500, message: "Error updating course rating", error });
  }
};

export const getCourseWithFeedbacks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate('ratingsAndFeedback.userId', 'username email image')
      .exec();

    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    const courseData = {
      courseId: course._id,
      courseTitle: course.title,
      feedbacks: course.ratingsAndFeedback.map((feedback) => ({
        username: feedback.userId.username,
        email: feedback.userId.email,
        image:feedback.userId.image,
        rating: feedback.rating,
        feedback: feedback.feedback,
        updatedAt:feedback.updatedAt,
      })),
    };

    res.json(courseData);
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({ message: "Failed to fetch course details" });
  }
};

export const getInstructorData = async (req: Request, res: Response): Promise<void> => {
  const { instructorId } = req.params;

  if (!instructorId) {
    res.status(400).json({ message: 'User ID is missing in the request' });
    return;
  }

  try {
    const user = await instructorRepository.findUserById(instructorId);
    res.status(200).json(user);
  } catch (error: unknown) {
    res.status(404).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
}

export const getIndividualCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { courseId } = req.params;
    const courses = await Course.findById(courseId).exec();

    if (!courses) {
      res.status(400).json({ message: "Not valid request" })
    }
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching categories:', error);
    next({ status: 500, message: 'Error fetching categories', error });
  }
};

export const getCompletionCertificate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { courseId } = req.params;
  const studentId = req.userId;

  try {
    const course = await Course.findById(courseId).lean();
    if (!course) {
      res.status(404).json({ error: "Course not found" });
      return;
    }

    const studentProgress = await Progress.findOne({
      courseId,
      studentId,
    });

    if (!studentProgress) {
      res.status(404).json({ error: "Student progress not found" });
      return;
    }

    if (!studentProgress.completionDate) {
      studentProgress.completionDate = new Date();
      await studentProgress.save();
    }

    const formattedCompletionDate = studentProgress.completionDate
      ? new Date(studentProgress.completionDate).toLocaleDateString("en-GB")
      : "Not completed yet";

    const student = await User.findById(studentId);

    res.status(200).json({
      courseName: course.title,
      studentName: student?.username || "Anonymous",
      completionDate: formattedCompletionDate || "Not completed yet",
    });
  } catch (error) {
    console.error("Error fetching course data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getStudentCourseSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const studentId = req.userId;

  try {
    const enrolledCourses = await orderModel
      .find({ studentId })
      .populate('courseId', 'title thumbnail courseFee level')
      .lean();

    const completedCourses = await Progress.find({
      studentId,
      isCompleted: true,
    })
      .populate('courseId', 'title thumbnail courseFee level')
      .lean()
      .exec();

      const ongoingCourses = await Progress.find({ studentId, isCompleted: false })
      .populate('courseId', 'title thumbnail courseFee level progressPercentage')
      .lean();

    const uniqueTutors = [
      ...new Set(enrolledCourses.map((order) => order.tutorId.toString())),
    ];

    res.status(200).json({
      enrolledCourses,
      totalEnrolled: enrolledCourses.length,
      completedCourses,
      totalCompleted: completedCourses.length,
      ongoingCourses,
      totalOngoing: ongoingCourses.length,
      uniqueTutors: uniqueTutors.length,
    });
  } catch (error) {
    console.error('Error fetching student summary:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getIndividualCourseData = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { courseId } = req.params;
    const studentId = req.userId;

    const course = await Course.findById(courseId).lean();
    if (!course) {
      res.status(400).json({ message: "Course not found" });
      return;
    }

    const order = await orderModel.findOne({ studentId, courseId });
    if (!order) {
      res.status(403).json({ message: "You have not purchased this course" });
      return;
    }

    const studentProgress = await Progress.findOne({
      courseId,
      studentId,
    }).lean();

    const completedLessonsCount = studentProgress
      ? studentProgress.completedLessons.length
      : 0;

    const totalLessons = await Lesson.countDocuments({ courseId });
    const responseData = {
      course,
      completedLessons: completedLessonsCount,
      totalLessons,
    };
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching individual course data:", error);
    next({ status: 500, message: "Error fetching course data", error });
  }
};

export const courseStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }
    course.isApproved = !course.isApproved;
    const updatedCourse = await course.save();

    res.status(200).json(course);
  } catch (error) {
    console.error('Error toggling course approval status:', error);
    next({ status: 500, message: 'Error toggling course approval status', error });
  }
};

export const getTutorCourses = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;

    if (isNaN(page) || isNaN(limit)) {
      res.status(400).json({ message: "Invalid page or limit value" });
      return;
    }

    const skip = (page - 1) * limit;
    const courses = await Course.find()
      .skip(skip)
      .limit(limit);

    const totalCourses = await Course.countDocuments();
    const totalPages = Math.ceil(totalCourses / limit);

    res.json({
      courses,
      totalCourses,
      totalPages,
      currentPage: page,
    });
    return;
  } catch (error) {
    console.error("Error fetching paginated courses:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const getMyTutorCourses = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const instructorId = req.userId;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;

    if (isNaN(page) || isNaN(limit)) {
      res.status(400).json({ message: "Invalid page or limit value" });
      return;
    }

    const skip = (page - 1) * limit;
    const courses = await Course.find({ instructorId })
      .skip(skip)
      .limit(limit);

    const totalCourses = await Course.countDocuments({ instructorId });
    const totalPages = Math.ceil(totalCourses / limit);

    res.json({
      courses,
      totalCourses,
      totalPages,
      currentPage: page,
    });
    return;
  } catch (error) {
    console.error("Error fetching paginated courses:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const getViewCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { courseId } = req.params;
    const courses = await Course.findById(courseId);
    if (!courses) {
      res.status(400).json({ message: "Not valid request" })
    }
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching categories:', error);
    next({ status: 500, message: 'Error fetching categories', error });
  }
};

export const addLesson = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { lessonTitle, lessonDescription, lessonVideo, lessonPdf, courseId } = req.body;

    if (!lessonTitle || !lessonDescription || !courseId) {
      res.status(400).json({ error: "All required fields must be filled." });
      return;
    }
    const newLesson = await Lesson.create({
      lessonTitle: lessonTitle,
      lessonDescription: lessonDescription,
      lessonVideo: lessonVideo,
      lessonPdf: lessonPdf,
      courseId: courseId,
    });
    res.status(201).json({ message: "Lesson added successfully!", lesson: newLesson });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error adding lesson" });
  }
}

export const deleteLesson = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { lessonId } = req.body;

    if (!lessonId) {
      res.status(400).json({ message: 'Lesson ID is required.' });
      return;
    }

    const deletedLesson = await Lesson.findByIdAndDelete(lessonId);

    if (!deletedLesson) {
      res.status(404).json({ message: 'Lesson not found.' });
      return;
    }

    res.status(200).json({ message: 'Lesson deleted successfully.' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

export const getViewChapters = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { courseId } = req.params;
    const lessons = await Lesson.find(
      { courseId: courseId });

    if (!lessons) {
      res.status(400).json({ message: "Not valid request" })
    }
    res.status(200).json(lessons);
  } catch (error) {
    console.error('Error fetching categories:', error);
    next({ status: 500, message: 'Error fetching categories', error });
  }
};

export const getViewChapter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      res.status(404).json({ message: 'Lesson not found.' });
      return;
    }

    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch lesson details.' });
  }
};

export const updateChapter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { lessonId } = req.params;
    let { lessonTitle, lessonDescription, lessonVideo, lessonPdf } = req.body;

    if(lessonPdf===''){
      const lesson = await Lesson.findById(lessonId);
      lessonPdf = lesson?.lessonPdf;
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      lessonId,
      { lessonTitle, lessonDescription, lessonVideo, lessonPdf },
      { new: true }
    );

    if (!updatedLesson) {
      res.status(404).json({ message: 'Lesson not found.' });
      return;
    }

    res.status(200).json({ message: 'Lesson updated successfully.', updatedLesson });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update lesson.' });
  }
};

export const editCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;

    const {
      title,
      subtitle,
      category,
      language,
      level,
      duration,
      courseFee,
      description,
      requirements,
      learningPoints,
      targetAudience,
      thumbnail,
      trailer,
    } = req.body;

    const categoryData = await Category.findOne({ categoryName: category });
    if (!categoryData) {
      res.status(404).json({ message: `Category '${category}' not found` });
      return;
    }
    let subCategory = categoryData.subCategories[0]?.name;

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        title,
        subtitle,
        category: category,
        subCategory: subCategory,
        language,
        level,
        duration,
        courseFee,
        description,
        requirements,
        learningPoints,
        targetAudience,
        ...(thumbnail && { thumbnail }),
        ...(trailer && { trailer }),
      },
      { new: true }
    );
    await updatedCourse?.save();

    if (!updatedCourse) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    res.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Failed to update course" });
  }
};

export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    if (!mongoose.isValidObjectId(courseId)) {
      res.status(400).json({ message: 'Invalid course ID' });
      return;
    }

    const deletedCourse = await Course.findByIdAndDelete(courseId);
    const lessons = await Lesson.find({ courseId });

    if (lessons.length > 0) {
      await Lesson.deleteMany({ courseId });
    }

    if (!deletedCourse) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    res.status(200).json({
      message: 'Course deleted successfully',
      course: deletedCourse,
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Failed to delete course' });
  }
};

export const publishCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }
    course.status = 'published';
    await course.save();

    const notification = await Notification.create({
      tutorId: course.instructorId,
      title: course.title,
      subtitle: course.subtitle,
      thumbnail: course.thumbnail,
      message: `Your course "${course.title}" has been successfully published.`,
      isRead: false,
    });

    await notification.save();

    res.status(200).json({ message: 'Course published successfully', course });
  } catch (error) {
    console.error('Error publishing course:', error);
    res.status(500).json({ message: 'Failed to publish course', error });
  }
};

export const rejectCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }
    course.status = 'rejected';
    await course.save();

    res.status(200).json({ message: 'Course rejected successfully', course });
  } catch (error) {
    console.error('Error publishing course:', error);
    res.status(500).json({ message: 'Failed to publish course', error });
  }
};

export const updateProgress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { completedLesson, videoSource } = req.body;
  const { id } = req.params; 
  const studentId = req.userId;

  try {
    const course = await Course.findById(id);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    if (videoSource === course.trailer) {
      res.status(200).json({ message: 'Trailer viewed successfully' });
      return;
    }

    const totalLessons = await Lesson.countDocuments({ courseId: id });

    let progress = await Progress.findOne({ courseId: id, studentId });
    if (!progress) {
      progress = await Progress.create({
        courseId: id,
        studentId,
        completedLessons: [completedLesson],
        progressPercentage: (1 / totalLessons) * 100,
      });
    } else {
      if (!progress.completedLessons.includes(completedLesson)) {
        progress.completedLessons.push(completedLesson);
        progress.progressPercentage = (progress.completedLessons.length / totalLessons) * 100;
        await progress.save();
      }
    }

    if (progress.completedLessons.length === totalLessons) {
      progress.isCompleted = true;
      progress.completionDate = new Date();
      await progress.save();
      res.status(201).json({ message: 'Course completed successfully!' });
    } else {
      res.status(201).json({ 
        message: 'Progress updated successfully', 
        progressPercentage: progress.progressPercentage 
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating progress' });
  }
};

export const getEnrolledMyCourses = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const instructorId = req.userId;
    const count = await Course.countDocuments({
      instructorId: instructorId,
      status: "published",
    });
    res.json({ count: count });
  } catch (error) {
    console.error("Error fetching total courses count:", error);
    res.status(500).json({ message: 'Failed to fetch courses count' });
  }
};

export const getMyCourses = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const instructorId = req.userId;
    const myCoursesCount = await Course.countDocuments({ instructorId });
    res.json({ count: myCoursesCount });
  } catch (error) {
    console.error("Error fetching instructor's courses count:", error);
    res.status(500).json({ message: 'Failed to fetch my courses count' });
  }
};

export const getMyStudents = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const instructorId = req.userId;
    const courses = await Course.find({ instructorId });
    const studentIds = new Set<string>();
    courses.forEach(course => {
      course.students.forEach(studentId => {
        studentIds.add(studentId.toString());
      });
    });

    res.json({ count: studentIds.size });
  } catch (error) {
    console.error("Error fetching students count:", error);
    res.status(500).json({ message: 'Failed to fetch students count' });
  }
};

export const getMyEarnings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const instructorId = req.userId;
    const instructor = await Instructor.findById(instructorId);

    if (!instructor) {
      res.status(404).json({ message: 'Instructor not found' });
      return;
    }
    const earnings = instructor.earnings || 0;
    res.json({ totalEarnings: earnings });
  } catch (error) {
    console.error("Error fetching earnings:", error);
    res.status(500).json({ message: 'Failed to fetch earnings' });
  }
};

export const getEarningDetails = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const instructorId = req.userId;
    const instructor = await Instructor.findById(instructorId);

    if (!instructor) {
      res.status(404).json({ message: 'Instructor not found' });
      return;
    }
    const currentBalance = instructor.currentBalance || 0;
    const totalWithdrawals = instructor.totalWithdrawals || 0;

    res.json({ currentBalance, totalWithdrawals });
  } catch (error) {
    console.error("Error fetching earnings:", error);
    res.status(500).json({ message: 'Failed to fetch earnings' });
  }
};

export const getWithdrawalHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const instructorId = req.userId;
    const instructor = await Instructor.findById(instructorId).populate('transactions');

    if (!instructor) {
      res.status(404).json({ message: 'Instructor not found' });
      return;
    }

    const withdrawalHistory = instructor.transactions?.map(withdrawal => ({
      date: withdrawal.date,
      method: withdrawal.method,
      amount: withdrawal.amount,
      status: withdrawal.status,
    }));

    res.json({ withdrawalHistory });
  } catch (error) {
    console.error("Error fetching withdrawal history:", error);
    res.status(500).json({ message: 'Failed to fetch withdrawal history' });
  }
};

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json({ message: 'Notifications retrieved successfully', notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications', error });
  }
};

