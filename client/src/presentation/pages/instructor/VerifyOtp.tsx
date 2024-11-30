import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../../infrastructure/api/api';

interface LocationState {
  email: string;
}

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { state } = useLocation() as { state: LocationState };
  const navigate = useNavigate();

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
          <span>Didn't receive the OTP?</span> <a href='/instructor/resend-otp' className="text-blue-500 hover:underline">Resend OTP</a>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
