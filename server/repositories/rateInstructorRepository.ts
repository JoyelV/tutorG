import RateInstructor from '../models/RateInstructor';
import Instructor from '../models/Instructor';

export class RateInstructorRepository {
  async findInstructorById(instructorId: string) {
    return await Instructor.findById(instructorId);
  }

  async findExistingRating(userId: string, instructorId: string) {
    return await RateInstructor.findOne({ userId, instructorId });
  }

  async saveRating(userId: string, instructorId: string, rating: number, comment?: string) {
    const newRating = new RateInstructor({
      userId,
      instructorId,
      rating,
      comment,
    });
    return await newRating.save();
  }

  async getTotalRatings(instructorId: string) {
    return await RateInstructor.find({ instructorId }).exec();
  }

  async updateInstructorRatings(instructorId: string, averageRating: number, numberOfRatings: number) {
    return await Instructor.findByIdAndUpdate(
      instructorId,
      { averageRating, numberOfRatings },
      { new: true }
    );
  }
}
