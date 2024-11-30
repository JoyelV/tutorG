import { Request, Response,NextFunction } from "express";
import mongoose from "mongoose";
import Course from "../models/Course";
import Category from "../models/Category";
import Lesson from "../models/Lesson";
/**
 * Create a course with basic information.
 */
export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, subtitle, category, language, level, duration, courseFee, description,requirements, learningPoints,targetAudience,instructorId, thumbnail, trailer } = req.body;
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
      requirements:requirements,
      learningPoints:learningPoints,
      targetAudience:targetAudience,
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
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching categories:', error);
    next({ status: 500, message: 'Error fetching categories', error });
  }
};

export const getIndividualCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { courseId } = req.params;
    const courses = await Course.findById(courseId);
    if(!courses){
      res.status(400).json({message:"Not valid request"})
    }
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching categories:', error);
    next({ status: 500, message: 'Error fetching categories', error });
  }
};

export const courseStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
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

export const getTutorCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { instructorId } = req.params;
    console.log(instructorId, "Instructor ID in getTutorCourses");
    
    // Find courses where the instructorId matches
    const courses = await Course.find({ instructorId });
    console.log(courses, "Courses fetched");

    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

export const getViewCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const courses = await Course.findById(id);
    if(!courses){
      res.status(400).json({message:"Not valid request"})
    }
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching categories:', error);
    next({ status: 500, message: 'Error fetching categories', error });
  }
};

export const addLesson = async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
  try{
    const { lessonTitle, lessonDescription, lessonVideo, lessonPdf, courseId } = req.body;
    console.log(req.body,"hello addlesson data.....");

  if (!lessonTitle || !lessonDescription || !courseId) {
    res.status(400).json({ error: "All required fields must be filled." });
    return ;
  }
    const newLesson = await Lesson.create({
      lessonTitle: lessonTitle,
      lessonDescription: lessonDescription,
      lessonVideo: lessonVideo,
      lessonPdf: lessonPdf,
      courseId:courseId,
    });
    res.status(201).json({ message: "Lesson added successfully!", lesson: newLesson });
  }catch (error) {
    console.error(error); 
    res.status(500).send({ message: "Error adding lesson" });
  }
}

export const deleteLesson = async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
  try {
    const { lessonId } = req.body;

    if (!lessonId) {
      res.status(400).json({ message: 'Lesson ID is required.' });
      return ;
    }

    // Find and delete the lesson by ID
    const deletedLesson = await Lesson.findByIdAndDelete(lessonId);

    if (!deletedLesson) {
      res.status(404).json({ message: 'Lesson not found.' });
      return ;
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
    console.log(courseId)

    const lessons = await Lesson.find(
      {courseId:courseId});
      console.log(lessons,"lessons........");

    if(!lessons){
      res.status(400).json({message:"Not valid request"})
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
    const { lessonTitle, lessonDescription, lessonVideo, lessonPdf } = req.body;

    const updatedLesson = await Lesson.findByIdAndUpdate(
      lessonId,
      { lessonTitle, lessonDescription, lessonVideo, lessonPdf },
      { new: true }
    );

    if (!updatedLesson) {
      res.status(404).json({ message: 'Lesson not found.' });
      return ;
    }

    res.status(200).json({ message: 'Lesson updated successfully.', updatedLesson });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update lesson.' });
  }
};

export const editCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    console.log(courseId,"id");
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

    // Update course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        title,
        subtitle,
        category: category, 
        subCategory:subCategory,
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
     console.log(updatedCourse,"updatecourse")
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
    console.log(lessons, "lessons");

    if (lessons.length > 0) {
      await Lesson.deleteMany({ courseId });
      console.log(`Deleted ${lessons.length} lessons associated with the course`);
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

