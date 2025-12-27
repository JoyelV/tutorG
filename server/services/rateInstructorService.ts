import { RateInstructorRepository } from '../repositories/rateInstructorRepository';

export class RateInstructorService {
  private rateInstructorRepository: RateInstructorRepository;

  constructor() {
    this.rateInstructorRepository = new RateInstructorRepository();
  }

  async addInstructorRatingService(userId: string, instructorId: string, rating: number, comment?: string) {
    if (comment && comment.length < 4) {
      return { message: 'Comment must be at least 4 characters long.'};
    }

    const instructor = await this.rateInstructorRepository.findInstructorById(instructorId);
    if (!instructor) {
      return { message: 'Instructor not found'};
    }

    const existingRating = await this.rateInstructorRepository.findExistingRating(userId, instructorId);
    if (existingRating) {
      return { message: 'You have already rated this instructor'};
    }

    await this.rateInstructorRepository.saveRating(userId, instructorId, rating, comment);

    const totalRatings = await this.rateInstructorRepository.getTotalRatings(instructorId);
    const newAverageRating = totalRatings.reduce((acc, r) => acc + r.rating, 0) / totalRatings.length;

    await this.rateInstructorRepository.updateInstructorRatings(instructorId, newAverageRating, totalRatings.length);

    return { message: 'Rating submitted successfully!' };
  }
}
