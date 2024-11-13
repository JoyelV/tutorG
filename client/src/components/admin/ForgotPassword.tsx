import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admin/send-otp', { email });
      console.log("request in forgotpassword", response);
      setMessage('OTP sent to your email.');
      navigate('/admin/verify-otp', { state: { email } });
    } catch {
      setMessage('Error sending OTP. Try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Send OTP</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ForgotPassword;
