import RateInstructor from '../models/RateInstructor';

export class FeedbackRepository {
  async getInstructorFeedback(instructorId: string) {
    return await RateInstructor.find({ instructorId }).populate({
      path: 'userId',
      select: 'username image',
    });
  }
}
