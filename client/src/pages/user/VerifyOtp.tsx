import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

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
      const response = await axios.post('http://localhost:5000/api/user/verify-otp', { email: state.email, otp });
      navigate('/reset-password', { state: { token: response.data.token } });
    } catch (error) {
      setError('Invalid OTP');
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="w-full px-4 py-2 mt-4 font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        Verify OTP
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default VerifyOtp;
