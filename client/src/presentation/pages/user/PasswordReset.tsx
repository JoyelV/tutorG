import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../../infrastructure/api/api'

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

    const isStrongPassword = (newPassword: string): boolean =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&#])[A-Za-z\d@$!%?&#]{8,20}$/.test(newPassword);

    if (!isStrongPassword(newPassword)) {
      setError('Password must have at least 8 characters, one lowercase letter, one uppercase letter, one number, and one special character.');
      return;
    }

    try {
      const response = await api.post('/user/reset-password', {
        token: state.token,
        newPassword,
      });

      if(response.status===400){
        setError('Registered Email required');
        return;
      }

      const userRole = response.data.role;
      console.log(userRole, "userRole");
      navigate('/login');

    } catch (error) {
      setError('Password reset failed,Check email entered');
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Reset Your Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 mt-4 font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Reset Password
            </button>
          </div>

          {error && <p className="text-center text-red-500 font-semibold">{error}</p>}
        </form>
      </div>
    </div>
  );
};
