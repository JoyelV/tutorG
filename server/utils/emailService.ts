import nodemailer from 'nodemailer';

export const sendOTPEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER as string,
      pass: process.env.EMAIL_PASS as string,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER as string,
    to: email,
    subject: 'Welcome to TutorG - OTP VERIFICATION MAIL',
    text: `Hey ${email},

Welcome to TutorG! You must verify your email to Complete your registration.

Your verification code is: ${otp} (valid for 01 minutes)

If you didn't sign up for TutorG, you can ignore this message. 

Thanks,
The TutorG Team`,
  };

  await transporter.sendMail(mailOptions);
};

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASS as string,
  },
});
