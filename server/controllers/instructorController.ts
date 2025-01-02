import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { sendOTPEmail } from '../utils/emailService';
import { generateOTP } from '../utils/otpGenerator';
import { verifyOTP, loginService, resetPasswordService } from '../services/instructorService';
import { otpService } from '../services/otpService';
import { otpRepository } from '../repositories/otpRepository';
import bcrypt from 'bcrypt';
import { updateUserProfile, updatePassword, uploadUserImage, getUserProfileService } from '../services/instructorService';
import Instructor from '../models/Instructor';
import orderModel from '../models/Orders';
import { AuthenticatedRequest } from '../utils/VerifyToken';
import RateInstructor from '../models/RateInstructor';

dotenv.config();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const otp = generateOTP();
    otpRepository.saveOtp(email, { otp, username, password, createdAt: new Date() });
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'OTP sent to your email. Please verify.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Resend OTP to the student email for registration.
 */
export const resendOtp = async (req:Request, res:Response,next: NextFunction) => {
  const { username, email, password } = req.body;
  try {
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }
    const otp = generateOTP();
    otpRepository.saveOtp(email, { otp, username, password, createdAt: new Date() });
    await sendOTPEmail(email, otp);
    
    res.status(200).json({ message: 'OTP resend to your email. Please verify.' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    next(error);
  }
};

export const verifyRegisterOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(400).json({ message: 'Email and OTP are required' });
      return;
    }

    const message = await verifyOTP(email, otp);
    res.status(201).json({ message });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
      res.status(500).json({ message: error.message });
    } else {
      console.error('Unknown error:', error);
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;
  try {
    const { token, refreshToken ,user } = await loginService(email, password);

    // Send the refresh token as an HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'development', // Use HTTPS in production
      sameSite: 'strict', // Prevent CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An unknown error occurred' });
  }
};

export const sendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email } = req.body;
  try {
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }
    await otpService.generateAndSendOtp(email);
    res.status(200).send('OTP sent to email');
  } catch (error) {
    console.error('Error sending OTP:', error);
    next(error);
  }
};

export const verifyPasswordOtp = (req: Request, res: Response, next: NextFunction): void => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      res.status(400).json({ message: 'Email and OTP are required' });
      return;
    }

    const token = otpService.verifyOtpAndGenerateToken(email, otp);

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
  const imageUrl = req.file ? req.file.path : "";

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

    if (!tutorId) {
      res.status(400).json({ message: 'Missing userId in request parameters' });
      return;
    }

    if (typeof isBlocked !== 'boolean') {
      res.status(400).json({ message: 'Invalid or missing isBlocked value' });
      return;
    }

    const updatedUser = await Instructor.findByIdAndUpdate(
      tutorId,
      { isBlocked },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Failed to update user status', error: error });
  }
};


export const addTutors = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
        username,
        email,
        phone,
        password,
        headline,
        areasOfExpertise,
        bio,
        highestQualification,
        websiteLink,
        isBlocked,
        tutorRequest,
    } = req.body;

    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const image = req.file ? req.file.path : "";

    if (!username || !email || !phone || !password) {
        res.status(400).json({ message: 'Required fields are missing.' });
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newTutor = new Instructor({
        username,
        email,
        phone,
        password:hashedPassword, 
        headline,
        image,
        areasOfExpertise,
        bio,
        highestQualification,
        websiteLink,
        isBlocked,
        tutorRequest,
    });

    await newTutor.save();

    res.status(201).json({ message: 'Tutor added successfully!', tutor: newTutor });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
}
};

export const getMyTutors = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const studentId = req.userId;

  try {
    const orders = await orderModel.find({ studentId })
    .populate('tutorId', 'username image') 
    .exec();
  const uniqueOrders = orders.filter((order, index, self) =>
    index === self.findIndex((o) => o.tutorId.toString() === order.tutorId.toString())
  ); 
  res.status(200).json(uniqueOrders); 
  } catch (error) {
    console.error('Error fetching tutors:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

const stripe = require('stripe')(process.env.STRIPE_KEY); 

export const getStripePayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { amount } = req.body; 
  const userId = req.userId;  

  try {
    const instructor = await Instructor.findById(userId);
    
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
  } catch (error) {
    console.error('Error creating Stripe Checkout session:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const addInstructorRating = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { rating, comment } = req.body; 
  const { instructorId } = req.params;   
  const userId = req.userId; 
  try {
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      res.status(404).json({ message: 'Instructor not found' });
      return ;
    }

    const existingRating = await RateInstructor.findOne({ userId, instructorId });
    if (existingRating) {
      res.status(200).json({ message: 'You have already rated this instructor' });
      return ;
    }

    const newRating = new RateInstructor({
      userId,
      instructorId,
      rating,
      comment,
    });

    await newRating.save();
    const totalRatings = await RateInstructor.find({ instructorId }).exec(); 
    const newAverageRating = totalRatings.reduce((acc, r) => acc + r.rating, 0) / totalRatings.length;

    instructor.averageRating = newAverageRating;
    instructor.numberOfRatings = totalRatings.length;
    await instructor.save();
    res.status(201).json({ message: 'Rating submitted successfully!' });
  } catch (error) {
    console.error('Error updating instructor rating:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};