import { Request, Response } from 'express';
import Review from '../models/Review';
import Course from '../models/Course';

export const addReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, material, comment } = req.body;
    console.log(req.body,"req.body");

    const { courseId } = req.params;
    console.log(courseId,"hii");

     const existingReview = await Review.findOne({ courseId });

     if (existingReview) {
       res.status(200).json({ 
         message: 'A review already exists for this course.' 
       });
       return ;
     }
    
    const newReview = new Review({
      title,
      material,
      comment,
      courseId,
    });

    await newReview.save();
    console.log(newReview,"newReview");

     const course = await Course.findById(courseId);
     if (course) {
       course.status = 'reviewed';
       await course.save();
     } else {
       res.status(404).json({ message: 'Course not found' });
       return;
     }

    res.status(201).json({ message: 'Review submitted successfully!' });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error while submitting review' });
  }
};


