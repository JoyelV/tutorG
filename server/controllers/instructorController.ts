import { Request, Response, NextFunction } from 'express';
import { sendOTPEmail } from '../utils/emailService';
import { generateOTP } from '../utils/otpGenerator';
import { loginService, resetPasswordService, toggleTutorStatusService } from '../services/instructorService';
import { otpService } from '../services/otpService';
import { otpRepository } from '../repositories/otpRepository';
import { updateUserProfile, updatePassword, uploadUserImage, getUserProfileService, logoutService, addTutorService, getTopTutorsService, getInstructorByIdService, getUserByEmail } from '../services/instructorService';
import { AuthenticatedRequest } from '../utils/VerifyToken';
import { OrderService } from '../services/orderService';
import { RateInstructorService } from '../services/rateInstructorService';
import { FeedbackService } from '../services/feedbackService';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../utils/ApiResponse';
import { logger } from '../utils/logger';
import Stripe from 'stripe';

/**
 * Resend OTP to the student email for registration.
 */
export const resendOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  if (!email) {
    throw new AppError(400, 'Email is required');
  }

  const emailLowerCase = email.toLowerCase();
  const otp = generateOTP();
  otpRepository.saveOtp(emailLowerCase, { otp, username, password, createdAt: new Date() });
  await sendOTPEmail(emailLowerCase, otp);

  res.status(200).json(
    new ApiResponse(200, null, 'OTP resend to your email. Please verify.')
  );
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError(400, 'Email and password are required');
  }

  const emailLowerCase = email.toLowerCase();
  const { token, refreshToken, user } = await loginService(emailLowerCase, password);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json(
    new ApiResponse(200, {
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      }
    }, 'Login successful')
  );
});

export const logout = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  if (!userId) {
    throw new AppError(400, 'User ID missing');
  }
  await logoutService(userId);
  res.status(200).json(new ApiResponse(200, null, 'Logout successful'));
});

export const sendOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    throw new AppError(400, 'Email is required');
  }
  const emailLowerCase = email.toLowerCase();
  const user = await getUserByEmail(emailLowerCase);
  if (!user) {
    throw new AppError(404, 'Email address not found in the system');
  }
  await otpService.generateAndSendOtp(emailLowerCase);
  res.status(200).json(new ApiResponse(200, null, 'OTP sent to email'));
});

export const verifyPasswordOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    throw new AppError(400, 'Email and OTP are required');
  }
  const emailLowerCase = email.toLowerCase();
  const token = otpService.verifyOtpAndGenerateToken(emailLowerCase, otp);
  res.status(200).json(new ApiResponse(200, { token }, 'OTP verified successfully'));
});

export const resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    throw new AppError(400, 'Token and new password are required');
  }
  const message = await resetPasswordService(token, newPassword);
  res.status(200).json(new ApiResponse(200, null, message));
});

export const fetchUserProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    throw new AppError(400, 'User ID is missing in the request');
  }

  const user = await getUserProfileService(userId);
  res.status(200).json(new ApiResponse(200, user, 'User profile fetched successfully'));
});

export const editUserProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  const updates = req.body;

  if (!userId) {
    throw new AppError(400, 'User ID is missing in the request');
  }

  const updatedUser = await updateUserProfile(userId, updates);
  res.status(200).json(new ApiResponse(200, updatedUser, 'User profile updated successfully'));
});

export const editPassword = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  const { currentPassword, newPassword } = req.body;

  if (!userId) {
    throw new AppError(400, 'User ID is missing');
  }

  await updatePassword(userId, currentPassword, newPassword);
  res.status(200).json(new ApiResponse(200, null, 'Password updated successfully'));
});

export const uploadImage = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  if (!req.file) {
    throw new AppError(400, 'No file uploaded');
  }
  const imageUrl = (req.file as any).path;

  if (!userId) {
    throw new AppError(400, 'User ID is missing');
  }

  const updatedUser = await uploadUserImage(userId, imageUrl);
  res.status(200).json(new ApiResponse(200, { imageUrl, user: updatedUser }, 'Image uploaded successfully'));
});

export const toggleTutorStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { tutorId } = req.params;
  const { isBlocked } = req.body;

  if (!tutorId) {
    throw new AppError(400, 'Tutor ID is required');
  }

  const updatedUser = await toggleTutorStatusService(tutorId, isBlocked);
  res.status(200).json(new ApiResponse(200, updatedUser, 'Tutor status updated successfully'));
});

export const addTutors = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const tutor = await addTutorService(req.body, req.file);
  res.status(201).json(new ApiResponse(201, tutor, 'Tutor added successfully!'));
});

const orderService = new OrderService();

export const getMyTutors = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const studentId = req.userId;
  if (!studentId) {
    throw new AppError(400, 'User ID is missing');
  }
  const tutors = await orderService.getMyTutorsService(studentId);
  res.status(200).json(new ApiResponse(200, tutors, 'Tutors fetched successfully'));
});

export const getTopTutors = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const instructors = await getTopTutorsService();
  res.status(200).json(new ApiResponse(200, instructors, 'Top tutors fetched successfully'));
});

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-11-20.acacia',
});

export const getStripePayment = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { amount } = req.body;
  const userId = req.userId;

  if (!userId) {
    throw new AppError(400, 'User ID is missing');
  }
  if (!amount) {
    throw new AppError(400, 'Amount is required');
  }

  const instructor = await getUserProfileService(userId);

  if (!instructor) {
    throw new AppError(404, 'Instructor not found');
  }

  const { username, email, image } = instructor;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Withdrawal',
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/instructor/my-earnings?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/instructor/my-earnings`,
    metadata: {
      type: 'instructor_payout',
      username: username || '',
      email: email || '',
      image: image || '',
      amount: amount.toString()
    },
  });

  res.json(new ApiResponse(200, { sessionId: session.id, instructorDetails: { username, email, image } }, 'Stripe session created successfully'));
});

const rateInstructorService = new RateInstructorService();

export const addInstructorRating = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { rating, comment } = req.body;
  const { instructorId } = req.params;
  const userId = req.userId;

  if (!userId) {
    throw new AppError(400, 'User ID is missing');
  }
  if (!instructorId) {
    throw new AppError(400, 'Instructor ID is missing');
  }
  if (!rating) {
    throw new AppError(400, 'Rating is required');
  }

  const response = await rateInstructorService.addInstructorRatingService(userId, instructorId, rating, comment);
  res.status(201).json(new ApiResponse(201, null, response.message));
});

export const getInstructorById = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { instructorId } = req.params;
  if (!instructorId) {
    throw new AppError(400, 'Instructor ID is missing');
  }
  const instructorData = await getInstructorByIdService(instructorId);
  res.status(200).json(new ApiResponse(200, instructorData, 'Instructor data fetched successfully'));
});

const feedbackService = new FeedbackService();

export const getInstructorFeedback = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { instructorId } = req.params;
  if (!instructorId) {
    throw new AppError(400, 'Instructor ID is missing');
  }
  const feedback = await feedbackService.getInstructorFeedback(instructorId);
  res.status(200).json(new ApiResponse(200, feedback, 'Instructor feedback fetched successfully'));
});