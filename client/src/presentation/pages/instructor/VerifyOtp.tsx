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
      const response = await api.post('/instructor/verify-otp', { email: state.email, otp });
      navigate('/instructor/reset-password', { state: { token: response.data.token } });
    } catch (error) {
      setError('Invalid OTP');
      console.error('Error:', error);
    }
  };

  const handleResendOtp = async () => {
    try {
      setCanResend(false); 
      setResendTimer(30); 
      await api.post('/instructor/send-otp', { email: state.email });
      setError(''); 
    } catch (error:any) {
      if (error.response.status === 404) {
        setError('Email address not found in the system. Please check and try again.');
      } else {
        setError('Error sending OTP. Please try again later.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Verify OTP</h2>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 text-lg font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ease-in-out"
          >
            Verify OTP
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
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
  );
};

export default VerifyOtp;
