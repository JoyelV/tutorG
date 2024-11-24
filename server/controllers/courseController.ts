import { Request, Response } from "express";
import Course from "../models/Course";
import Category from "../models/Category";
import { uploadImage, uploadVideo } from "../utils/cloudinary";
/**
 * Create a course with basic information.
 */
export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, subtitle, category, language, level, duration, courseFee, description, instructorId, image, trailer } = req.body;
    console.log(req.body, "............hello course data...........");
    const imageUrl = image ? await uploadImage(image) : "";
    const trailerUrl = trailer ? await uploadVideo(trailer) : "";
    console.log(imageUrl, ".....imageUrl data");
    console.log(trailerUrl, ".......trailerUrl data");
    const categoryData = await Category.findById(category);
    const categoryName = categoryData?.categoryName;
    const subCategory = categoryData?.subCategories[0].name;
    console.log(categoryData?.subCategories[0].name,".......categoryData....");
    
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
      thumbnail: image || " ",
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
