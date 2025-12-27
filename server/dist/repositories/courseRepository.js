"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.CourseRepository = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Category_1 = __importDefault(require("../models/Category"));
const Progress_1 = __importDefault(require("../models/Progress"));
const Notification_1 = __importDefault(require("../models/Notification"));
const Lesson_1 = __importDefault(require("../models/Lesson"));
// Model imports
const Course = mongoose_1.default.model('Course');
const Orders = mongoose_1.default.model('Orders');
const Users = mongoose_1.default.model('User');
class CourseRepository {
    findCourses(query, sort, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const courses = yield Course.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean()
                .exec();
            const total = yield Course.countDocuments(query);
            return { courses: courses, total };
        });
    }
    findCourseById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Course.findById(courseId).lean().exec();
        });
    }
    findRelatedCourses(category, courseId, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Course.find({
                category,
                _id: { $ne: courseId },
                status: 'published',
                isApproved: true,
            })
                .limit(limit)
                .lean()
                .exec();
        });
    }
    findRecentlyAddedCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Course.find({ status: 'published', isApproved: true })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean()
                .exec();
        });
    }
    findInstructorCourses(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Course.find({ instructorId, status: 'published' })
                .lean()
                .exec();
        });
    }
    findAllCourses(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const courses = yield Course.find()
                .skip(skip)
                .limit(limit)
                .lean()
                .exec();
            const allCourses = yield Course.find().lean().exec();
            const total = yield Course.countDocuments();
            return {
                courses: courses,
                total,
                allCourses: allCourses,
            };
        });
    }
    updateCourseRating(courseId, userId, rating, feedback) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield Course.findById(courseId);
            if (!course) {
                throw new Error('Course not found');
            }
            course.ratingsAndFeedback.push({
                userId: new mongoose_1.Types.ObjectId(userId),
                rating,
                feedback,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            // Fallback if calculateAverageRating is missing
            if (typeof course.calculateAverageRating === 'function') {
                yield course.calculateAverageRating();
            }
            else {
                const totalRatings = course.ratingsAndFeedback.length;
                const sumRatings = course.ratingsAndFeedback.reduce((sum, r) => sum + r.rating, 0);
                course.averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
            }
            yield course.save();
            return course.toObject();
        });
    }
    findCourseWithFeedbacks(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Course.findById(courseId)
                .populate('ratingsAndFeedback.userId', 'username email image')
                .lean()
                .exec();
        });
    }
    findIndividualCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Course.findById(courseId).lean().exec();
        });
    }
    findCompletionCertificate(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield Course.findById(courseId).lean().exec();
            const studentProgress = yield Progress_1.default.findOne({
                courseId,
                studentId,
            })
                .lean()
                .exec();
            const student = yield Users.findById(studentId).lean().exec();
            return { course, studentProgress, student };
        });
    }
    findStudentCourseSummary(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const enrolledCourses = yield Course.find({ students: studentId })
                .lean()
                .exec();
            const progress = yield Progress_1.default.find({ studentId })
                .lean()
                .exec();
            const completedCourses = progress
                .filter((p) => p.completionDate)
                .map((p) => enrolledCourses.find((c) => c._id.toString() === p.courseId.toString()));
            const ongoingCourses = enrolledCourses.filter((c) => !progress.some((p) => p.courseId.toString() === c._id.toString() && p.completionDate));
            const uniqueTutors = [...new Set(enrolledCourses.map((c) => c.instructorId.toString()))];
            return {
                enrolledCourses: enrolledCourses,
                completedCourses: completedCourses.filter(Boolean),
                ongoingCourses: ongoingCourses,
                uniqueTutors,
            };
        });
    }
    findIndividualCourseData(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield Course.findById(courseId).lean().exec();
            const order = yield Orders.findOne({ courseId, studentId })
                .lean()
                .exec();
            const studentProgress = yield Progress_1.default.findOne({
                courseId,
                studentId,
            })
                .lean()
                .exec();
            const lessons = yield Lesson_1.default.find({ courseId }).lean().exec();
            const totalLessons = lessons.length;
            return { course, order, studentProgress, totalLessons };
        });
    }
    findTutorCourses(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const courses = yield Course.find({ status: 'published' })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec();
            const total = yield Course.countDocuments({ status: 'published' });
            return { courses: courses, total };
        });
    }
    findMyTutorCourses(instructorId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const courses = yield Course.find({ instructorId })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec();
            const total = yield Course.countDocuments({ instructorId });
            return { courses: courses, total };
        });
    }
    findViewCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Course.findById(courseId).lean().exec();
        });
    }
    createCourse(courseData) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = new Course(courseData);
            return (yield course.save()).toObject();
        });
    }
    findCategoryById(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Category_1.default.findById(categoryId).lean().exec();
        });
    }
    updateCourse(courseId, courseData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Course.findByIdAndUpdate(courseId, courseData, { new: true })
                .lean()
                .exec();
        });
    }
    deleteCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield Course.findByIdAndDelete(courseId).lean().exec();
            if (!course) {
                throw new Error('Course not found');
            }
            return course;
        });
    }
    toggleCourseApproval(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield Course.findById(courseId);
            if (!course) {
                throw new Error('Course not found');
            }
            course.isApproved = !course.isApproved;
            yield course.save();
            return course.toObject();
        });
    }
    publishCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield Course.findById(courseId);
            if (!course) {
                throw new Error('Course not found');
            }
            course.status = 'published';
            yield course.save();
            return course.toObject();
        });
    }
    rejectCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield Course.findById(courseId);
            if (!course) {
                throw new Error('Course not found');
            }
            course.status = 'rejected';
            yield course.save();
            return course.toObject();
        });
    }
    createNotification(notificationData) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = new Notification_1.default(Object.assign(Object.assign({}, notificationData), { tutorId: new mongoose_1.Types.ObjectId(notificationData.tutorId) }));
            return (yield notification.save()).toObject();
        });
    }
    createLesson(lessonData) {
        return __awaiter(this, void 0, void 0, function* () {
            const lesson = new Lesson_1.default(lessonData);
            return (yield lesson.save()).toObject();
        });
    }
    deleteLesson(lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Lesson_1.default.findByIdAndDelete(lessonId).lean().exec();
        });
    }
    findLessonsByCourseId(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Lesson_1.default.find({ courseId }).lean().exec();
        });
    }
    findLessonById(lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Lesson_1.default.findById(lessonId).lean().exec();
        });
    }
    updateLesson(lessonId, lessonData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Lesson_1.default.findByIdAndUpdate(lessonId, lessonData, { new: true })
                .lean()
                .exec();
        });
    }
    updateProgress(courseId, studentId, completedLesson) {
        return __awaiter(this, void 0, void 0, function* () {
            let progress = yield Progress_1.default.findOne({ courseId, studentId }).exec();
            if (!progress) {
                progress = new Progress_1.default({
                    courseId,
                    studentId,
                    completedLessons: [],
                });
            }
            const lessonId = new mongoose_1.Types.ObjectId(completedLesson);
            if (!progress.completedLessons.some((id) => id.toString() === lessonId.toString())) {
                progress.completedLessons.push(lessonId);
            }
            const lessons = yield Lesson_1.default.find({ courseId }).lean().exec();
            const totalLessons = lessons.length;
            const completedLessons = progress.completedLessons.length;
            const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
            if (completedLessons === totalLessons && !progress.completionDate) {
                progress.completionDate = new Date();
            }
            yield progress.save();
            return {
                isCompleted: !!progress.completionDate,
                progressPercentage,
            };
        });
    }
    findEnrolledCoursesCount(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield Course.find({ instructorId }).lean().exec();
            return courses.reduce((acc, course) => { var _a; return acc + (((_a = course.students) === null || _a === void 0 ? void 0 : _a.length) || 0); }, 0);
        });
    }
    findInstructorCoursesCount(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Course.countDocuments({ instructorId });
        });
    }
    findInstructorStudentsCount(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield Course.find({ instructorId }).lean().exec();
            const studentIds = new Set(courses.flatMap((course) => { var _a; return ((_a = course.students) === null || _a === void 0 ? void 0 : _a.map((s) => s.toString())) || []; }));
            return studentIds.size;
        });
    }
    findInstructorEarnings(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield Course.find({ instructorId }).lean().exec();
            return courses.reduce((acc, course) => { var _a; return acc + (((_a = course.students) === null || _a === void 0 ? void 0 : _a.length) || 0) * course.courseFee; }, 0);
        });
    }
    findInstructorEarningDetails(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const earnings = yield this.findInstructorEarnings(instructorId);
            return { currentBalance: earnings, totalWithdrawals: 0 };
        });
    }
    findWithdrawalHistory(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    findNotifications() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Notification_1.default.find().lean().exec();
        });
    }
}
exports.CourseRepository = CourseRepository;
