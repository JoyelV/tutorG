import { otpRepository } from '../repositories/forgotOtpRepository';
import { sendOTPEmail } from '../utils/emailService';
import {generateToken} from '../utils/jwtHelper';

export const otpService = {
  async generateAndSendOtp(email: string): Promise<void> {
    const otp = Math.floor(100000 + Math.random() * 900000); 
    otpRepository.saveOtp(email, otp); 
    await sendOTPEmail(email, otp.toString());
  },
  verifyOtpAndGenerateToken(email: string, otp: string): string {
    const storedOtp = otpRepository.getOtp(email);
    console.log("resend storedOtp email",storedOtp)

    if (!storedOtp || storedOtp !== parseInt(otp, 10)) {
      throw new Error('Invalid OTP');
    }
    otpRepository.deleteOtp(email);
    const token = generateToken({ email }, '15m');
    return token;
  },
};
