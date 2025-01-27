"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotifications = exports.getWithdrawalHistory = exports.getEarningDetails = exports.getMyEarnings = exports.getMyStudents = exports.getMyCourses = exports.getEnrolledMyCourses = exports.updateProgress = exports.rejectCourse = exports.publishCourse = exports.deleteCourse = exports.editCourse = exports.updateChapter = exports.getViewChapter = exports.getViewChapters = exports.deleteLesson = exports.addLesson = exports.getViewCourses = exports.getMyTutorCourses = exports.getTutorCourses = exports.courseStatus = exports.getIndividualCourseData = exports.getStudentCourseSummary = exports.getCompletionCertificate = exports.getIndividualCourses = exports.getInstructorData = exports.getCourseWithFeedbacks = exports.updateCourseRating = exports.getCourseDatas = exports.getInstructorCourses = exports.getRecentlyAddedCourses = exports.getRelatedCourses = exports.getCourses = exports.createCourse = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Course_1 = __importDefault(require("../models/Course"));
const Category_1 = __importDefault(require("../models/Category"));
const Lesson_1 = __importDefault(require("../models/Lesson"));
const Orders_1 = __importDefault(require("../models/Orders"));
const instructorRepository_1 = require("../repositories/instructorRepository");
const Instructor_1 = __importDefault(require("../models/Instructor"));
const User_1 = __importDefault(require("../models/User"));
const Notification_1 = __importDefault(require("../models/Notification"));
const Progress_1 = __importDefault(require("../models/Progress"));
/**
 * Create a course with basic information.
 */
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, subtitle, category, language, level, duration, courseFee, description, requirements, learningPoints, targetAudience, instructorId, thumbnail, trailer } = req.body;
        const categoryData = yield Category_1.default.findById(category);
        const categoryName = categoryData === null || categoryData === void 0 ? void 0 : categoryData.categoryName;
        const subCategory = categoryData === null || categoryData === void 0 ? void 0 : categoryData.subCategories[0].name;
        const courseData = new Course_1.default({
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
        yield courseData.save();
        res.status(201).json({
            message: "Course created successfully",
            courseId: courseData._id,
            course: courseData,
        });
    }
    catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ message: "Failed to create course" });
    }
});
exports.createCourse = createCourse;
const getCourses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = '1', limit = '10', searchTerm = '', filter = '', sortOption = '', } = req.query;
        const currentPage = Number(page);
        const pageSize = Number(limit);
        const search = typeof searchTerm === 'string' ? searchTerm : '';
        const categoryFilter = typeof filter === 'string' ? filter : '';
        const query = {
            status: 'published',
            isApproved: true,
        };
        if (search)
            query.title = new RegExp(search, 'i');
        if (categoryFilter && categoryFilter !== 'All Courses')
            query.category = categoryFilter;
        const sort = {};
        if (sortOption === 'Low to High')
            sort.courseFee = 1;
        if (sortOption === 'High to Low')
            sort.courseFee = -1;
        if (sortOption === 'Latest')
            sort.createdAt = -1;
        if (sortOption === 'Popular')
            sort.averageRating = -1;
        const total = yield Course_1.default.countDocuments(query);
        const courses = yield Course_1.default.find(query)
            .sort(sort)
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize);
        res.status(200).json({
            courses,
            total,
            totalPages: Math.ceil(total / pageSize),
            currentPage,
        });
    }
    catch (error) {
        console.error('Error fetching courses:', error);
        next({ status: 500, message: 'Error fetching courses', error });
    }
});
exports.getCourses = getCourses;
const getRelatedCourses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    try {
        const course = yield Course_1.default.findById(courseId);
        if (!course) {
            res.status(404).json({ message: "Course not found" });
            return;
        }
        const relatedCourses = yield Course_1.default.find({
            category: course.category,
            _id: { $ne: courseId },
        }).limit(5);
        res.status(200).json(relatedCourses);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch related courses", error });
    }
});
exports.getRelatedCourses = getRelatedCourses;
const getRecentlyAddedCourses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield Course_1.default.find({
            status: 'published',
            isApproved: true,
        })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('title category courseFee thumbnail averageRating students');
        res.status(200).json(courses);
    }
    catch (error) {
        console.error('Error fetching recently added courses:', error);
        res.status(500).json({ message: 'Server error. Could not fetch courses.' });
    }
});
exports.getRecentlyAddedCourses = getRecentlyAddedCourses;
const getInstructorCourses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { instructorId } = req.params;
    if (!instructorId) {
        res.status(400).json({ message: "Instructor ID is required." });
        return;
    }
    try {
        const courses = yield Course_1.default.find({ instructorId }).select('title category courseFee thumbnail averageRating students');
        res.status(200).json(courses);
    }
    catch (error) {
        console.error('Error fetching recently added courses:', error);
        res.status(500).json({ message: 'Server error. Could not fetch courses.' });
    }
});
exports.getInstructorCourses = getInstructorCourses;
const getCourseDatas = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    try {
        const courses = yield Course_1.default.find().skip((page - 1) * limit).limit(limit);
        const totalCourses = yield Course_1.default.countDocuments();
        const total = yield Course_1.default.find();
        res.json({
            courses,
            totalPages: Math.ceil(totalCourses / limit),
            currentPage: Number(page),
            total
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});
exports.getCourseDatas = getCourseDatas;
const updateCourseRating = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const { userId, rating, feedback } = req.body;
        const user_id = req.userId;
        const orders = yield Orders_1.default.find({ studentId: user_id });
        if (orders.length === 0) {
            res.status(404).json({ message: 'No purchase history found' });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(courseId)) {
            res.status(400).json({ message: "Invalid course ID format" });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: "Invalid user ID format" });
            return;
        }
        const course = yield Course_1.default.findById(courseId);
        if (!course) {
            res.status(404).json({ message: "Course not found" });
            return;
        }
        const existingFeedback = course.ratingsAndFeedback.find((entry) => entry.userId.toString() === userId);
        if (existingFeedback) {
            existingFeedback.rating = rating;
            existingFeedback.feedback = feedback;
            existingFeedback.updatedAt = new Date();
        }
        else {
            course.ratingsAndFeedback.push({ userId, rating, feedback, createdAt: new Date(), updatedAt: new Date(), });
        }
        yield course.calculateAverageRating();
        res.status(200).json({
            message: "Course rating updated successfully",
            course,
        });
    }
    catch (error) {
        console.error("Error updating course rating:", error);
        next({ status: 500, message: "Error updating course rating", error });
    }
});
exports.updateCourseRating = updateCourseRating;
const getCourseWithFeedbacks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield Course_1.default.findById(req.params.courseId)
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
                image: feedback.userId.image,
                rating: feedback.rating,
                feedback: feedback.feedback,
                updatedAt: feedback.updatedAt,
            })),
        };
        res.json(courseData);
    }
    catch (error) {
        console.error("Error fetching course details:", error);
        res.status(500).json({ message: "Failed to fetch course details" });
    }
});
exports.getCourseWithFeedbacks = getCourseWithFeedbacks;
const getInstructorData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { instructorId } = req.params;
    if (!instructorId) {
        res.status(400).json({ message: 'User ID is missing in the request' });
        return;
    }
    try {
        const user = yield instructorRepository_1.instructorRepository.findUserById(instructorId);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(404).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
});
exports.getInstructorData = getInstructorData;
const getIndividualCourses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const courses = yield Course_1.default.findById(courseId).exec();
        if (!courses) {
            res.status(400).json({ message: "Not valid request" });
        }
        res.status(200).json(courses);
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        next({ status: 500, message: 'Error fetching categories', error });
    }
});
exports.getIndividualCourses = getIndividualCourses;
const getCompletionCertificate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const studentId = req.userId;
    try {
        const course = yield Course_1.default.findById(courseId).lean();
        if (!course) {
            res.status(404).json({ error: "Course not found" });
            return;
        }
        const studentProgress = yield Progress_1.default.findOne({
            courseId,
            studentId,
        });
        if (!studentProgress) {
            res.status(404).json({ error: "Student progress not found" });
            return;
        }
        if (!studentProgress.completionDate) {
            studentProgress.completionDate = new Date();
            yield studentProgress.save();
        }
        const formattedCompletionDate = studentProgress.completionDate
            ? new Date(studentProgress.completionDate).toLocaleDateString("en-GB")
            : "Not completed yet";
        const student = yield User_1.default.findById(studentId);
        res.status(200).json({
            courseName: course.title,
            studentName: (student === null || student === void 0 ? void 0 : student.username) || "Anonymous",
            completionDate: formattedCompletionDate || "Not completed yet",
        });
    }
    catch (error) {
        console.error("Error fetching course data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getCompletionCertificate = getCompletionCertificate;
const getStudentCourseSummary = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const studentId = req.userId;
    try {
        const enrolledCourses = yield Orders_1.default
            .find({ studentId })
            .populate('courseId', 'title thumbnail courseFee level')
            .lean();
        const completedCourses = yield Progress_1.default.find({
            studentId,
            isCompleted: true,
        })
            .populate('courseId', 'title thumbnail courseFee level')
            .lean()
            .exec();
        const ongoingCourses = yield Progress_1.default.find({ studentId, isCompleted: false })
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
    }
    catch (error) {
        console.error('Error fetching student summary:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.getStudentCourseSummary = getStudentCourseSummary;
const getIndividualCourseData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const studentId = req.userId;
        const course = yield Course_1.default.findById(courseId).lean();
        if (!course) {
            res.status(400).json({ message: "Course not found" });
            return;
        }
        const order = yield Orders_1.default.findOne({ studentId, courseId });
        if (!order) {
            res.status(403).json({ message: "You have not purchased this course" });
            return;
        }
        const studentProgress = yield Progress_1.default.findOne({
            courseId,
            studentId,
        }).lean();
        const completedLessonsCount = studentProgress
            ? studentProgress.completedLessons.length
            : 0;
        const totalLessons = yield Lesson_1.default.countDocuments({ courseId });
        const responseData = {
            course,
            completedLessons: completedLessonsCount,
            totalLessons,
        };
        res.status(200).json(responseData);
    }
    catch (error) {
        console.error("Error fetching individual course data:", error);
        next({ status: 500, message: "Error fetching course data", error });
    }
});
exports.getIndividualCourseData = getIndividualCourseData;
const courseStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const course = yield Course_1.default.findById(courseId);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        course.isApproved = !course.isApproved;
        const updatedCourse = yield course.save();
        res.status(200).json(course);
    }
    catch (error) {
        console.error('Error toggling course approval status:', error);
        next({ status: 500, message: 'Error toggling course approval status', error });
    }
});
exports.courseStatus = courseStatus;
const getTutorCourses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        if (isNaN(page) || isNaN(limit)) {
            res.status(400).json({ message: "Invalid page or limit value" });
            return;
        }
        const skip = (page - 1) * limit;
        const courses = yield Course_1.default.find()
            .skip(skip)
            .limit(limit);
        const totalCourses = yield Course_1.default.countDocuments();
        const totalPages = Math.ceil(totalCourses / limit);
        res.json({
            courses,
            totalCourses,
            totalPages,
            currentPage: page,
        });
        return;
    }
    catch (error) {
        console.error("Error fetching paginated courses:", error);
        res.status(500).json({ message: "Server error" });
        return;
    }
});
exports.getTutorCourses = getTutorCourses;
const getMyTutorCourses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const instructorId = req.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        if (isNaN(page) || isNaN(limit)) {
            res.status(400).json({ message: "Invalid page or limit value" });
            return;
        }
        const skip = (page - 1) * limit;
        const courses = yield Course_1.default.find({ instructorId })
            .skip(skip)
            .limit(limit);
        const totalCourses = yield Course_1.default.countDocuments({ instructorId });
        const totalPages = Math.ceil(totalCourses / limit);
        res.json({
            courses,
            totalCourses,
            totalPages,
            currentPage: page,
        });
        return;
    }
    catch (error) {
        console.error("Error fetching paginated courses:", error);
        res.status(500).json({ message: "Server error" });
        return;
    }
});
exports.getMyTutorCourses = getMyTutorCourses;
const getViewCourses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const courses = yield Course_1.default.findById(courseId);
        if (!courses) {
            res.status(400).json({ message: "Not valid request" });
        }
        res.status(200).json(courses);
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        next({ status: 500, message: 'Error fetching categories', error });
    }
});
exports.getViewCourses = getViewCourses;
const addLesson = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lessonTitle, lessonDescription, lessonVideo, lessonPdf, courseId } = req.body;
        if (!lessonTitle || !lessonDescription || !courseId) {
            res.status(400).json({ error: "All required fields must be filled." });
            return;
        }
        const newLesson = yield Lesson_1.default.create({
            lessonTitle: lessonTitle,
            lessonDescription: lessonDescription,
            lessonVideo: lessonVideo,
            lessonPdf: lessonPdf,
            courseId: courseId,
        });
        res.status(201).json({ message: "Lesson added successfully!", lesson: newLesson });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error adding lesson" });
    }
});
exports.addLesson = addLesson;
const deleteLesson = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lessonId } = req.body;
        if (!lessonId) {
            res.status(400).json({ message: 'Lesson ID is required.' });
            return;
        }
        const deletedLesson = yield Lesson_1.default.findByIdAndDelete(lessonId);
        if (!deletedLesson) {
            res.status(404).json({ message: 'Lesson not found.' });
            return;
        }
        res.status(200).json({ message: 'Lesson deleted successfully.' });
    }
    catch (error) {
        console.error('Error deleting lesson:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.deleteLesson = deleteLesson;
const getViewChapters = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const lessons = yield Lesson_1.default.find({ courseId: courseId });
        if (!lessons) {
            res.status(400).json({ message: "Not valid request" });
        }
        res.status(200).json(lessons);
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        next({ status: 500, message: 'Error fetching categories', error });
    }
});
exports.getViewChapters = getViewChapters;
const getViewChapter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lessonId } = req.params;
        const lesson = yield Lesson_1.default.findById(lessonId);
        if (!lesson) {
            res.status(404).json({ message: 'Lesson not found.' });
            return;
        }
        res.status(200).json(lesson);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch lesson details.' });
    }
});
exports.getViewChapter = getViewChapter;
const updateChapter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lessonId } = req.params;
        let { lessonTitle, lessonDescription, lessonVideo, lessonPdf } = req.body;
        if (lessonPdf === '') {
            const lesson = yield Lesson_1.default.findById(lessonId);
            lessonPdf = lesson === null || lesson === void 0 ? void 0 : lesson.lessonPdf;
        }
        const updatedLesson = yield Lesson_1.default.findByIdAndUpdate(lessonId, { lessonTitle, lessonDescription, lessonVideo, lessonPdf }, { new: true });
        if (!updatedLesson) {
            res.status(404).json({ message: 'Lesson not found.' });
            return;
        }
        res.status(200).json({ message: 'Lesson updated successfully.', updatedLesson });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update lesson.' });
    }
});
exports.updateChapter = updateChapter;
const editCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { courseId } = req.params;
        const { title, subtitle, category, language, level, duration, courseFee, description, requirements, learningPoints, targetAudience, thumbnail, trailer, } = req.body;
        const categoryData = yield Category_1.default.findOne({ categoryName: category });
        if (!categoryData) {
            res.status(404).json({ message: `Category '${category}' not found` });
            return;
        }
        let subCategory = (_a = categoryData.subCategories[0]) === null || _a === void 0 ? void 0 : _a.name;
        const updatedCourse = yield Course_1.default.findByIdAndUpdate(courseId, Object.assign(Object.assign({ title,
            subtitle, category: category, subCategory: subCategory, language,
            level,
            duration,
            courseFee,
            description,
            requirements,
            learningPoints,
            targetAudience }, (thumbnail && { thumbnail })), (trailer && { trailer })), { new: true });
        yield (updatedCourse === null || updatedCourse === void 0 ? void 0 : updatedCourse.save());
        if (!updatedCourse) {
            res.status(404).json({ message: "Course not found" });
            return;
        }
        res.status(200).json({
            message: "Course updated successfully",
            course: updatedCourse,
        });
    }
    catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ message: "Failed to update course" });
    }
});
exports.editCourse = editCourse;
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        if (!mongoose_1.default.isValidObjectId(courseId)) {
            res.status(400).json({ message: 'Invalid course ID' });
            return;
        }
        const deletedCourse = yield Course_1.default.findByIdAndDelete(courseId);
        const lessons = yield Lesson_1.default.find({ courseId });
        if (lessons.length > 0) {
            yield Lesson_1.default.deleteMany({ courseId });
        }
        if (!deletedCourse) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        res.status(200).json({
            message: 'Course deleted successfully',
            course: deletedCourse,
        });
    }
    catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Failed to delete course' });
    }
});
exports.deleteCourse = deleteCourse;
const publishCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const course = yield Course_1.default.findById(courseId);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        course.status = 'published';
        yield course.save();
        const notification = yield Notification_1.default.create({
            tutorId: course.instructorId,
            title: course.title,
            subtitle: course.subtitle,
            thumbnail: course.thumbnail,
            message: `Your course "${course.title}" has been successfully published.`,
            isRead: false,
        });
        yield notification.save();
        res.status(200).json({ message: 'Course published successfully', course });
    }
    catch (error) {
        console.error('Error publishing course:', error);
        res.status(500).json({ message: 'Failed to publish course', error });
    }
});
exports.publishCourse = publishCourse;
const rejectCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const course = yield Course_1.default.findById(courseId);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        course.status = 'rejected';
        yield course.save();
        res.status(200).json({ message: 'Course rejected successfully', course });
    }
    catch (error) {
        console.error('Error publishing course:', error);
        res.status(500).json({ message: 'Failed to publish course', error });
    }
});
exports.rejectCourse = rejectCourse;
const updateProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { completedLesson, videoSource } = req.body;
    const { id } = req.params;
    const studentId = req.userId;
    try {
        const course = yield Course_1.default.findById(id);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        if (videoSource === course.trailer) {
            res.status(200).json({ message: 'Trailer viewed successfully' });
            return;
        }
        const totalLessons = yield Lesson_1.default.countDocuments({ courseId: id });
        let progress = yield Progress_1.default.findOne({ courseId: id, studentId });
        if (!progress) {
            progress = yield Progress_1.default.create({
                courseId: id,
                studentId,
                completedLessons: [completedLesson],
                progressPercentage: (1 / totalLessons) * 100,
            });
        }
        else {
            if (!progress.completedLessons.includes(completedLesson)) {
                progress.completedLessons.push(completedLesson);
                progress.progressPercentage = (progress.completedLessons.length / totalLessons) * 100;
                yield progress.save();
            }
        }
        if (progress.completedLessons.length === totalLessons) {
            progress.isCompleted = true;
            progress.completionDate = new Date();
            yield progress.save();
            res.status(201).json({ message: 'Course completed successfully!' });
        }
        else {
            res.status(201).json({
                message: 'Progress updated successfully',
                progressPercentage: progress.progressPercentage
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating progress' });
    }
});
exports.updateProgress = updateProgress;
const getEnrolledMyCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const instructorId = req.userId;
        const count = yield Course_1.default.countDocuments({
            instructorId: instructorId,
            status: "published",
        });
        res.json({ count: count });
    }
    catch (error) {
        console.error("Error fetching total courses count:", error);
        res.status(500).json({ message: 'Failed to fetch courses count' });
    }
});
exports.getEnrolledMyCourses = getEnrolledMyCourses;
const getMyCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const instructorId = req.userId;
        const myCoursesCount = yield Course_1.default.countDocuments({ instructorId });
        res.json({ count: myCoursesCount });
    }
    catch (error) {
        console.error("Error fetching instructor's courses count:", error);
        res.status(500).json({ message: 'Failed to fetch my courses count' });
    }
});
exports.getMyCourses = getMyCourses;
const getMyStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const instructorId = req.userId;
        const courses = yield Course_1.default.find({ instructorId });
        const studentIds = new Set();
        courses.forEach(course => {
            course.students.forEach(studentId => {
                studentIds.add(studentId.toString());
            });
        });
        res.json({ count: studentIds.size });
    }
    catch (error) {
        console.error("Error fetching students count:", error);
        res.status(500).json({ message: 'Failed to fetch students count' });
    }
});
exports.getMyStudents = getMyStudents;
const getMyEarnings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const instructorId = req.userId;
        const instructor = yield Instructor_1.default.findById(instructorId);
        if (!instructor) {
            res.status(404).json({ message: 'Instructor not found' });
            return;
        }
        const earnings = instructor.earnings || 0;
        res.json({ totalEarnings: earnings });
    }
    catch (error) {
        console.error("Error fetching earnings:", error);
        res.status(500).json({ message: 'Failed to fetch earnings' });
    }
});
exports.getMyEarnings = getMyEarnings;
const getEarningDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const instructorId = req.userId;
        const instructor = yield Instructor_1.default.findById(instructorId);
        if (!instructor) {
            res.status(404).json({ message: 'Instructor not found' });
            return;
        }
        const currentBalance = instructor.currentBalance || 0;
        const totalWithdrawals = instructor.totalWithdrawals || 0;
        res.json({ currentBalance, totalWithdrawals });
    }
    catch (error) {
        console.error("Error fetching earnings:", error);
        res.status(500).json({ message: 'Failed to fetch earnings' });
    }
});
exports.getEarningDetails = getEarningDetails;
const getWithdrawalHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const instructorId = req.userId;
        const instructor = yield Instructor_1.default.findById(instructorId).populate('transactions');
        if (!instructor) {
            res.status(404).json({ message: 'Instructor not found' });
            return;
        }
        const withdrawalHistory = (_a = instructor.transactions) === null || _a === void 0 ? void 0 : _a.map(withdrawal => ({
            date: withdrawal.date,
            method: withdrawal.method,
            amount: withdrawal.amount,
            status: withdrawal.status,
        }));
        res.json({ withdrawalHistory });
    }
    catch (error) {
        console.error("Error fetching withdrawal history:", error);
        res.status(500).json({ message: 'Failed to fetch withdrawal history' });
    }
});
exports.getWithdrawalHistory = getWithdrawalHistory;
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifications = yield Notification_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({ message: 'Notifications retrieved successfully', notifications });
    }
    catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Failed to fetch notifications', error });
    }
});
exports.getNotifications = getNotifications;
