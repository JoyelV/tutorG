import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../../infrastructure/api/api';

interface LocationState {
  email: string;
}

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);

  const { state } = useLocation() as { state: LocationState };
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer); 
  }, [resendTimer]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/user/verify-otp', { email: state.email, otp });
      navigate('/reset-password', { state: { token: response.data.token } });
    } catch (error) {
      setError('Invalid OTP');
      console.error('Error:', error);
    }
  };

  const handleResendOtp = async () => {
    try {
      await api.post('/user/send-otp', { email: state.email });
      setResendTimer(30); 
      setCanResend(false);
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
      console.error('Resend OTP failed:', err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Verify OTP</h2>
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-gray-700 font-medium mb-2">Enter OTP</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP sent to your email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 mt-4 font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Verify OTP
            </button>
          </div>
          {error && <p className="text-center text-red-500 font-semibold">{error}</p>}
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={handleResendOtp}
            disabled={!canResend}
            className={`w-full px-4 py-3 font-semibold rounded-lg focus:outline-none focus:ring-2 ${
              canResend
                ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {canResend ? 'Resend OTP' : `Resend OTP in ${resendTimer}s`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
