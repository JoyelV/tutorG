import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Paper, Box, Avatar,Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../infrastructure/api/api'

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [resendTimer, setResendTimer] = useState(30); // Timer in seconds
    const [canResend, setCanResend] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (otpSent && resendTimer > 0) {
            timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
        } else if (resendTimer === 0) {
            setCanResend(true);
        }
        return () => clearTimeout(timer);
    }, [otpSent, resendTimer]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            await api.post('/user/register', { username, email, password });
            setOtpSent(true);
            setResendTimer(30); 
            setCanResend(false);
            toast.success("OTP sent to your email! Please verify.");
        } catch (err) {
            toast.error("Registration failed. Please try again.");
            console.error('Registration failed:', err);
        }
    };

    const handleResendOtp = async () => {
        try {
            await api.post('/user/resend-otp', { username, email, password });
            setResendTimer(30); 
            setCanResend(false);
            toast.success("OTP resent to your email!");
        } catch (err) {
            toast.error("Failed to resend OTP. Please try again.");
            console.error('Resend OTP failed:', err);
        }
    };

    const handleOtpVerification = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await api.post('/user/verify-registerotp', { email, otp });
            console.log("email and otp from resendotp handling",email,otp)
            toast.success("Registration successful! Redirecting to login.");
            navigate('/login');
        } catch (err) {
            toast.error("Invalid OTP or OTP expired. Please try again.");
            console.error('OTP verification failed:', err);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <Paper elevation={6} sx={{ padding: 4, borderRadius: 3 }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    </Avatar>
                    <Typography component="h1" variant="h5" gutterBottom>
                        {otpSent ? 'Verify OTP' : 'Sign Up'}
                    </Typography>
                    <Box component="form" onSubmit={otpSent ? handleOtpVerification : handleRegister} sx={{ mt: 1 }}>
                        {!otpSent ? (
                            <>
                                <TextField
                                    label="Username"
                                    fullWidth
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    margin="normal"
                                    variant="outlined"
                                />
                                <TextField
                                    label="Email"
                                    fullWidth
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    margin="normal"
                                    variant="outlined"
                                />
                                <TextField
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    margin="normal"
                                    variant="outlined"
                                />
                                <TextField
                                    label="Confirm Password"
                                    type="password"
                                    fullWidth
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    margin="normal"
                                    variant="outlined"
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        mt: 3, mb: 2,
                                        py: 1.5,
                                        background: 'linear-gradient(to right, #6a11cb, #2575fc)',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Register
                                </Button>
                            </>
                        ) : (
                            <>
                                <TextField
                                    label="Enter OTP"
                                    fullWidth
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    margin="normal"
                                    variant="outlined"
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        mt: 3, mb: 2,
                                        py: 1.5,
                                        background: 'linear-gradient(to right, #6a11cb, #2575fc)',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Verify OTP
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="secondary"
                                    disabled={!canResend}
                                    onClick={handleResendOtp}
                                    sx={{ mt: 2 }}
                                >
                                    {canResend ? "Resend OTP" : `Resend OTP in ${resendTimer}s`}
                                </Button>
                            </>
                        )}
                    </Box>
                    <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
                            <Grid item>
                                <Typography variant="body2">
                                    Already have an account?{' '}
                                    <Button color="secondary" onClick={() => navigate('/login')}>
                                        Sign in
                                    </Button>
                                </Typography>
                            </Grid>
                        </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;
