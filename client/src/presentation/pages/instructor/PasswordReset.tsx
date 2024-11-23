import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../../infrastructure/api/api';

interface LocationState {
  token: string;
}

export const PasswordReset: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { state } = useLocation() as { state: LocationState };
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await api.post('/instructor/reset-password', {
        token: state.token,
        newPassword,
      });
       
      if(!response){
         setError('Password cannot be reset right now');
      }
      const userRole = response.data.role; 
      console.log(userRole, "userRole");
      navigate('/instructor/');

    } catch (error) {
      setError('Password reset failed');
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Reset Your Password</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              required
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              required
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 mt-4 font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
          >
            Reset Password
          </button>
          
          {error && (
            <div className="mt-4 text-center">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
