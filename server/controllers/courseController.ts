import { Request, Response,NextFunction } from "express";
import Course from "../models/Course";
import Category from "../models/Category";
/**
 * Create a course with basic information.
 */
export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, subtitle, category, language, level, duration, courseFee, description,requirements, learningPoints,targetAudience,instructorId, thumbnail, trailer } = req.body;
    console.log(req.body, "............hello course data...........");
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
    console.log("courseData...........", courseData);    
    await courseData.save();
    res.status(201).json({ message: "Course created successfully!" });
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