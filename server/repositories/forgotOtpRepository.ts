const otpStorage: Record<string, number> = {};

export const otpRepository = {
  saveOtp(email: string, otp: number): void {
    otpStorage[email] = otp;
  },

  getOtp(email: string): number | null {
    return otpStorage[email] || null;
  },

  deleteOtp(email: string): void {
    delete otpStorage[email];
  },
};