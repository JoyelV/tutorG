import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const x = await axios.post('http://localhost:5000/api/auth/send-otp', { email });
      console.log("request in forgotpassword",x)
      setMessage('OTP sent to your email.');
      navigate('/verify-otp', { state: { email } });
    } catch {
      setMessage('Error sending OTP. Try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <button type="submit">Send OTP</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ForgotPassword;
