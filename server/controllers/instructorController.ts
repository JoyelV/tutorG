import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { sendOTPEmail } from '../utils/emailService';
import { generateOTP } from '../utils/otpGenerator';
import { loginService, resetPasswordService, toggleTutorStatusService } from '../services/instructorService';
import { otpService } from '../services/otpService';
import { otpRepository } from '../repositories/otpRepository';
import { updateUserProfile, updatePassword, uploadUserImage, getUserProfileService,logoutService,addTutorService,getTopTutorsService,getInstructorByIdService,getUserByEmail } from '../services/instructorService';
import { AuthenticatedRequest } from '../utils/VerifyToken';
import { OrderService } from '../services/orderService';
import { RateInstructorService } from '../services/rateInstructorService';
import { FeedbackService } from '../services/feedbackService';

dotenv.config();

/**
 * Resend OTP to the student email for registration.
 */
export const resendOtp = async (req:Request, res:Response,next: NextFunction) => {
  const { username, email, password } = req.body;
  const emailLowerCase = email.toLowerCase();

  try {
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }
    const otp = generateOTP();
    otpRepository.saveOtp(emailLowerCase, { otp, username, password, createdAt: new Date() });
    await sendOTPEmail(emailLowerCase, otp);
    
    res.status(200).json({ message: 'OTP resend to your email. Please verify.' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;
  try {
    const emailLowerCase = email.toLowerCase();

    const { token, refreshToken ,user } = await loginService(emailLowerCase, password);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict', 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ message: 'An unknown error occurred' });
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.userId;
    if(userId){
      await logoutService(userId);
      res.status(200).json({ message: "Logout successfully" });
    }
  } catch (error) {
    res.status(400).json({ message: "An unknown error occurred" });
  }
};

export const sendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email } = req.body;
  const emailLowerCase = email.toLowerCase();
  const user = await getUserByEmail(emailLowerCase);
  if (!user) {
    res.status(404).json({ error: 'Email address not found in the system.' });
    return;
  }

  try {
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }
    await otpService.generateAndSendOtp(emailLowerCase);
    res.status(200).send('OTP sent to email');
  } catch (error) {
    console.error('Error sending OTP:', error);
    next(error);
  }
};

export const verifyPasswordOtp = (req: Request, res: Response, next: NextFunction): void => {
  const { email, otp } = req.body;
  try {
    const emailLowerCase = email.toLowerCase();

    if (!email || !otp) {
      res.status(400).json({ message: 'Email and OTP are required' });
      return;
    }

    const token = otpService.verifyOtpAndGenerateToken(emailLowerCase, otp);

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;

  try {
    const message = await resetPasswordService(token, newPassword);
    res.status(200).json({ message });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}

export const fetchUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(400).json({ message: 'User ID is missing in the request' });
    return;
  }

  try {
    const user = await getUserProfileService(userId);
    res.status(200).json(user);
  } catch (error: unknown) {
    res.status(404).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
}

export const editUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  const updates = req.body;

  if (!userId) {
    res.status(400).json({ message: 'User ID is missing in the request' });
    return;
  }

  try {
    const updatedUser = await updateUserProfile(userId, updates);
    res.status(200).json(updatedUser);
  } catch (error: unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
}

export const editPassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  const { currentPassword, newPassword } = req.body;

  if (!userId) {
    res.status(400).json({ message: 'User ID is missing in the request' });
    return;
  }

  try {
    await updatePassword(userId, currentPassword, newPassword);
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error: unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
}

export const uploadImage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file uploaded' });
    return;
  }
  const imageUrl = (req.file as any).path;

  if (!userId) {
    res.status(400).json({ message: 'User ID is missing in the request' });
    return;
  }

  try {
    const updatedUser = await uploadUserImage(userId, imageUrl);
    res.status(200).json({ success: true, imageUrl, user: updatedUser });
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
}

export const toggleTutorStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tutorId } = req.params;
    const { isBlocked } = req.body;

    if (tutorId) {
      const updatedUser = await toggleTutorStatusService(tutorId, isBlocked);
      res.status(200).json(updatedUser);
    }  
   
  } catch (error:any) {
    console.error('Error updating user status:', error);
    res.status(400).json({ message: error.message });
  }
};

export const addTutors = async (req: Request, res: Response): Promise<void> => {
  try {
    const tutor = await addTutorService(req.body, req.file);

    res.status(201).json({ message: 'Tutor added successfully!', tutor });
  } catch (error:any) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

const orderService = new OrderService();

export const getMyTutors = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.userId;
    if(studentId){
      const tutors = await orderService.getMyTutorsService(studentId);
      res.status(200).json(tutors);
    }
  } catch (error) {
    console.error('Error fetching tutors:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTopTutors = async (req: Request, res: Response): Promise<void> => {
  try {
    const instructors = await getTopTutorsService();

    res.status(200).json(instructors);
  } catch (error) {
    console.error('Error fetching top instructors:', error);
    res.status(500).json({ message: 'Failed to fetch instructors' });
  }
};

const stripe = require('stripe')(process.env.STRIPE_KEY); 

export const getStripePayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { amount } = req.body; 
  const userId = req.userId;  

  try {
    if(userId){
    const instructor = await getUserProfileService(userId);
    
    if (!instructor) {
      res.status(404).send('Instructor not found');
      return ;
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
      metadata:  {
        type: 'instructor_payout',
        username,
        email,
        image,
        amount
      },
    });

    res.json({ sessionId: session.id, instructorDetails: { username, email, image }});
  }
  } catch (error) {
    console.error('Error creating Stripe Checkout session:', error);
    res.status(500).send('Internal Server Error');
  }
};

const rateInstructorService = new RateInstructorService();

export const addInstructorRating = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
try {
    const { rating, comment } = req.body;
    const { instructorId } = req.params;
    const userId = req.userId;

    if(userId){
      const response = await rateInstructorService.addInstructorRatingService(userId, instructorId, rating, comment);
      res.status(201).json({message:response.message});
    }
  } catch (error:any) {
    console.error('Error updating instructor rating:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
}

export const getInstructorById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { instructorId } = req.params;
    const instructorData = await getInstructorByIdService(instructorId);
    
    res.status(200).json(instructorData);
  } catch (error:any) {
    console.error('Error fetching instructor data:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const feedbackService = new FeedbackService();

export const getInstructorFeedback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { instructorId } = req.params;
    const feedback = await feedbackService.getInstructorFeedback(instructorId);
    
    res.status(200).json(feedback);
  } catch (error:any) {
    console.error("Error fetching instructor feedback:", error);
    res.status(500).json({ message: error.message || "Server error. Could not fetch feedback." });
  }
};