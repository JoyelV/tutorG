import { Request, Response,NextFunction } from "express";
import { validationResult } from 'express-validator'
import Course from "../models/Course"; // Replace with the path to your Course model
import {CustomRequest} from '../types/CustomRequest'

// Define interfaces for the course
interface BasicInfo {
  title: string;
  subtitle: string;
  category: string;
  subCategory: string;
  language: string;
  level: string;
  duration: number;
}

interface AdvanceInfo {
  thumbnail: string; // URL or path to thumbnail
  trailer: string;   // URL or path to trailer
  description: string;
}

/**
 * Create a course with basic information.
 */
// Controller function to handle course creation
export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, subtitle, category, subCategory, language, level, duration, description } = req.body;
    const { thumbnail, trailer } = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Create a new course in the database
    const newCourse = new Course({
      title,
      subtitle,
      category,
      subCategory,
      language,
      level,
      duration,
      description,
      thumbnail: thumbnail ? thumbnail[0].path : null,
      trailer: trailer ? trailer[0].path : null,
    });

    await newCourse.save();
     res.status(201).json({ message: "Course created successfully!" });
     return;
    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).json({ message: 'Failed to create course' });
      return ;
    }
  };
  

/**
 * Save advanced course information.
 */
export const saveAdvanceInfo = async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.body; // Course ID must be passed in the request body
  const { description }: AdvanceInfo = req.body;

  const customReq = req as CustomRequest;

  // Extract files
  const thumbnail = customReq.files?.thumbnail?.[0]?.path || "";
  const trailer = customReq.files?.trailer?.[0]?.path || "";
  

  if (!courseId) {
    res.status(400).json({ message: "Course ID is required." });
    return;
  }

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404).json({ message: "Course not found." });
      return;
    }

    course.thumbnail = thumbnail;
    course.trailer = trailer;
    course.description = description;

    const updatedCourse = await course.save();
    res.status(200).json({ message: "Course updated successfully.", course: updatedCourse });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
};

/**
 * Publish course (optional final step).
 */
export const publishCourse = async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.body;

  if (!courseId) {
    res.status(400).json({ message: "Course ID is required." });
    return;
  }

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404).json({ message: "Course not found." });
      return;
    }

    // Perform validations before publishing
    if (!course.thumbnail || !course.trailer || !course.description) {
      res.status(400).json({
        message: "All required fields must be filled before publishing the course.",
      });
      return;
    }

    course.status = "published";
    const publishedCourse = await course.save();

    res.status(200).json({ message: "Course published successfully.", course: publishedCourse });
  } catch (error) {
    console.error("Error publishing course:", error);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
};
