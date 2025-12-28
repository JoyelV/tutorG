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
exports.CourseService = void 0;
const courseRepository_1 = require("../repositories/courseRepository");
const mongoose_1 = __importDefault(require("mongoose"));
const instructorRepository_1 = require("../repositories/instructorRepository");
class CourseService {
    constructor() {
        this.courseRepository = new courseRepository_1.CourseRepository();
    }
    createCourse(courseData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { category } = courseData;
            if (!category) {
                throw new Error('Category is required');
            }
            const categoryData = yield this.courseRepository.findCategoryById(category);
            if (!categoryData) {
                throw new Error('Category not found');
            }
            const coursePayload = Object.assign(Object.assign({}, courseData), { category: categoryData.categoryName, subCategory: ((_a = categoryData.subCategories[0]) === null || _a === void 0 ? void 0 : _a.name) || '', thumbnail: courseData.thumbnail || ' ', trailer: courseData.trailer || ' ' });
            return yield this.courseRepository.createCourse(coursePayload);
        });
    }
    getCourses(page, limit, searchTerm, categoryFilter, sortOption) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                status: 'published',
                isApproved: true,
            };
            if (searchTerm)
                query.title = new RegExp(searchTerm, 'i');
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
            const { courses, total } = yield this.courseRepository.findCourses(query, sort, page, limit);
            return {
                courses,
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
            };
        });
    }
    getRelatedCourses(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.courseRepository.findCourseById(courseId);
            if (!course) {
                throw new Error('Course not found');
            }
            return yield this.courseRepository.findRelatedCourses(course.category, courseId, 5);
        });
    }
    getRecentlyAddedCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.courseRepository.findRecentlyAddedCourses();
        });
    }
    getInstructorCourses(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!instructorId) {
                throw new Error('Instructor ID is required');
            }
            return yield this.courseRepository.findInstructorCourses(instructorId);
        });
    }
    getCourseDatas(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const { courses, total, allCourses } = yield this.courseRepository.findAllCourses(page, limit);
            return {
                courses,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                total: allCourses,
            };
        });
    }
    updateCourseRating(courseId, userId, rating, feedback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(courseId)) {
                throw new Error('Invalid course ID format');
            }
            if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                throw new Error('Invalid user ID format');
            }
            const course = yield this.courseRepository.updateCourseRating(courseId, userId, rating, feedback);
            if (!course) {
                throw new Error('Course not found');
            }
            return course;
        });
    }
    getCourseWithFeedbacks(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.courseRepository.findCourseWithFeedbacks(courseId);
            if (!course) {
                throw new Error('Course not found');
            }
            const populated = course.ratingsAndFeedback;
            return {
                courseId: course._id,
                courseTitle: course.title,
                feedbacks: populated.map((feedback) => ({
                    userId: feedback.userId,
                    username: feedback.userId.username,
                    email: feedback.userId.email,
                    image: feedback.userId.image,
                    rating: feedback.rating,
                    feedback: feedback.feedback,
                    createdAt: feedback.createdAt,
                    updatedAt: feedback.updatedAt,
                })),
            };
        });
    }
    getInstructorData(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!instructorId) {
                throw new Error('User ID is missing');
            }
            const user = yield instructorRepository_1.instructorRepository.findUserById(instructorId);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        });
    }
    getIndividualCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.courseRepository.findIndividualCourse(courseId);
            if (!course) {
                throw new Error('Course not found');
            }
            return course;
        });
    }
    getCompletionCertificate(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { course, studentProgress, student } = yield this.courseRepository.findCompletionCertificate(courseId, studentId);
            if (!course) {
                throw new Error('Course not found');
            }
            if (!studentProgress) {
                throw new Error('Student progress not found');
            }
            if (!studentProgress.completionDate) {
                studentProgress.completionDate = new Date();
                yield studentProgress.save();
            }
            const formattedCompletionDate = studentProgress.completionDate
                ? new Date(studentProgress.completionDate).toLocaleDateString('en-GB')
                : 'Not completed yet';
            return {
                courseName: course.title,
                studentName: (student === null || student === void 0 ? void 0 : student.username) || 'Anonymous',
                completionDate: formattedCompletionDate,
            };
        });
    }
    getStudentCourseSummary(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { enrolledCourses, completedCourses, ongoingCourses, uniqueTutors } = yield this.courseRepository.findStudentCourseSummary(studentId);
            return {
                enrolledCourses,
                totalEnrolled: enrolledCourses.length,
                completedCourses,
                totalCompleted: completedCourses.length,
                ongoingCourses,
                totalOngoing: ongoingCourses.length,
                uniqueTutors: uniqueTutors.length,
            };
        });
    }
    getIndividualCourseData(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { course, order, studentProgress, totalLessons } = yield this.courseRepository.findIndividualCourseData(courseId, studentId);
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
        });
    }
    toggleCourseApproval(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.courseRepository.toggleCourseApproval(courseId);
            if (!course) {
                throw new Error('Course not found');
            }
            return course;
        });
    }
    getTutorCourses(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isNaN(page) || isNaN(limit)) {
                throw new Error('Invalid page or limit value');
            }
            const { courses, total } = yield this.courseRepository.findTutorCourses(page, limit);
            return {
                courses,
                totalCourses: total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
            };
        });
    }
    getMyTutorCourses(instructorId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isNaN(page) || isNaN(limit)) {
                throw new Error('Invalid page or limit value');
            }
            const { courses, total } = yield this.courseRepository.findMyTutorCourses(instructorId, page, limit);
            return {
                courses,
                totalCourses: total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
            };
        });
    }
    getViewCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.courseRepository.findViewCourse(courseId);
            if (!course) {
                throw new Error('Course not found');
            }
            return course;
        });
    }
    addLesson(lessonData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!lessonData.lessonTitle ||
                !lessonData.lessonDescription ||
                !lessonData.courseId) {
                throw new Error('All required fields must be filled');
            }
            return yield this.courseRepository.createLesson(lessonData);
        });
    }
    deleteLesson(lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lesson = yield this.courseRepository.deleteLesson(lessonId);
            if (!lesson) {
                throw new Error('Lesson not found');
            }
        });
    }
    getLessonsByCourseId(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lessons = yield this.courseRepository.findLessonsByCourseId(courseId);
            if (!lessons || lessons.length === 0) {
                throw new Error('No lessons found for this course');
            }
            return lessons;
        });
    }
    getLessonById(lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lesson = yield this.courseRepository.findLessonById(lessonId);
            if (!lesson) {
                throw new Error('Lesson not found');
            }
            return lesson;
        });
    }
    updateLesson(lessonId, lessonData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingLesson = yield this.courseRepository.findLessonById(lessonId);
            if (!existingLesson) {
                throw new Error('Lesson not found');
            }
            if (!lessonData.lessonPdf && existingLesson.lessonPdf) {
                lessonData.lessonPdf = existingLesson.lessonPdf;
            }
            const updatedLesson = yield this.courseRepository.updateLesson(lessonId, lessonData);
            if (!updatedLesson) {
                throw new Error('Failed to update lesson');
            }
            return updatedLesson;
        });
    }
    editCourse(courseId, courseData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { category } = courseData;
            let subCategory = '';
            if (category) {
                const categoryData = yield this.courseRepository.findCategoryById(category);
                if (!categoryData) {
                    throw new Error(`Category '${category}' not found`);
                }
                subCategory = ((_a = categoryData.subCategories[0]) === null || _a === void 0 ? void 0 : _a.name) || '';
                courseData = Object.assign(Object.assign({}, courseData), { category: categoryData.categoryName, subCategory });
            }
            const updatedCourse = yield this.courseRepository.updateCourse(courseId, courseData);
            if (!updatedCourse) {
                throw new Error('Course not found');
            }
            return updatedCourse;
        });
    }
    deleteCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.isValidObjectId(courseId)) {
                throw new Error('Invalid course ID');
            }
            const course = yield this.courseRepository.deleteCourse(courseId);
            if (!course) {
                throw new Error('Course not found');
            }
            return course;
        });
    }
    publishCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.courseRepository.publishCourse(courseId);
            if (!course) {
                throw new Error('Course not found');
            }
            yield this.courseRepository.createNotification({
                tutorId: course.instructorId.toString(),
                title: course.title,
                subtitle: course.subtitle,
                thumbnail: course.thumbnail,
                message: `Your course "${course.title}" has been successfully published.`,
                isRead: false,
            });
            return course;
        });
    }
    rejectCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.courseRepository.rejectCourse(courseId);
            if (!course) {
                throw new Error('Course not found');
            }
            return course;
        });
    }
    updateProgress(courseId, studentId, completedLesson, videoSource) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.courseRepository.findCourseById(courseId);
            if (!course) {
                throw new Error('Course not found');
            }
            if (videoSource === course.trailer) {
                return { message: 'Trailer viewed successfully' };
            }
            const progress = yield this.courseRepository.updateProgress(courseId, studentId, completedLesson);
            return {
                message: progress.isCompleted
                    ? 'Course completed successfully!'
                    : 'Progress updated successfully',
                progressPercentage: progress.progressPercentage,
            };
        });
    }
    getEnrolledCoursesCount(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.courseRepository.findEnrolledCoursesCount(instructorId);
        });
    }
    getMyCoursesCount(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.courseRepository.findInstructorCoursesCount(instructorId);
        });
    }
    getMyStudentsCount(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.courseRepository.findInstructorStudentsCount(instructorId);
        });
    }
    getMyEarnings(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const earnings = yield this.courseRepository.findInstructorEarnings(instructorId);
            if (earnings === null) {
                throw new Error('Instructor not found');
            }
            return earnings;
        });
    }
    getEarningDetails(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const details = yield this.courseRepository.findInstructorEarningDetails(instructorId);
            if (!details) {
                throw new Error('Instructor not found');
            }
            return details;
        });
    }
    getWithdrawalHistory(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const history = yield this.courseRepository.findWithdrawalHistory(instructorId);
            if (!history) {
                throw new Error('Instructor not found');
            }
            return history;
        });
    }
    getNotifications() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.courseRepository.findNotifications();
        });
    }
}
exports.CourseService = CourseService;
