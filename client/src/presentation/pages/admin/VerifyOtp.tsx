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
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true); 
    }
  }, [resendTimer]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/verify-otp', { email: state.email, otp });
      navigate('/admin/reset-password', { state: { token: response.data.token } });
    } catch (error) {
      setError('Invalid OTP');
      console.error('Error:', error);
    }
  };

  const handleResendOtp = async () => {
    try {
      setCanResend(false); 
      setResendTimer(30); 
      await api.post('/admin/send-otp', { email: state.email });
      setError(''); 
    } catch (error) {
      setError('Failed to resend OTP. Please try again later.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
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
        <div className="text-center mt-4">
          <p className="text-sm text-gray-700">
            Didn't receive the OTP?{' '}
            {canResend ? (
              <button
                onClick={handleResendOtp}
                className="text-blue-500 hover:underline focus:outline-none"
              >
                Resend OTP
              </button>
            ) : (
              <span className="text-gray-500">Resend OTP in {resendTimer}s</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
