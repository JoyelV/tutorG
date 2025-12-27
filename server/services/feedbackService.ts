import { FeedbackRepository } from '../repositories/feedbackRepository';

export class FeedbackService {
  private feedbackRepository: FeedbackRepository;

  constructor() {
    this.feedbackRepository = new FeedbackRepository();
  }

  async getInstructorFeedback(instructorId: string) {
    if (!instructorId) {
      throw new Error("Instructor ID is required.");
    }
    return await this.feedbackRepository.getInstructorFeedback(instructorId);
  }
}
