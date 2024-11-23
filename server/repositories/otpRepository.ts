export interface OtpEntry {
  otp: string;
  username: string;
  password: string;
  createdAt: Date; 
}

const otpStorage: Record<string, OtpEntry> = {};

export const otpRepository = {
  saveOtp(email: string, entry: OtpEntry): void {
    otpStorage[email] = { ...entry }; 
  },

  getOtp(email: string): OtpEntry | null {
    return otpStorage[email] || null;
  },

  deleteOtp(email: string): void {
    delete otpStorage[email];
  }
};
