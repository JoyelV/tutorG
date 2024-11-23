import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Paper, Box, Avatar, Grid, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../../infrastructure/api/api';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Google as GoogleIcon } from '@mui/icons-material';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import firebaseApp from '../../../infrastructure/config/firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InstructorRegister: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth(firebaseApp);

    // Timer for resend OTP
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
            setPasswordMismatch(true);
            return;
        } else {
            setPasswordMismatch(false);
        }

        try {
            await api.post('/instructor/register', { username, email, password, role: 'instructor' });
            setOtpSent(true);
            setResendTimer(30);
            setCanResend(false);
            toast.success("OTP sent to your email! Please verify.");
        } catch (err) {
            setError('Registration failed. Please try again.');
            console.error('Registration failed:', err);
        }
    };

    const handleResendOtp = async () => {
        try {
            await api.post('/instructor/resend-otp',{ username, email, password });
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
            await api.post('/instructor/verify-registerotp', { email, otp });
            toast.success("Registration successful! Redirecting to login.");
            navigate('/instructor/');
        } catch (err) {
            toast.error("Invalid OTP or OTP expired. Please try again.");
            console.error('OTP verification failed:', err);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            navigate('/instructor'); 
        } catch (err) {
            setError('Google sign-in failed. Please try again.');
            console.error('Google sign-in failed:', err);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
            <ToastContainer position="top-right" autoClose={3000} />
            <Paper elevation={6} sx={{ padding: 4, borderRadius: 3 }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" gutterBottom>
                        {otpSent ? 'Verify OTP' : 'Sign Up'}
                    </Typography>
                    {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                    {passwordMismatch && !otpSent && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            Passwords do not match!
                        </Alert>
                    )}
                    <Box
                        component="form"
                        onSubmit={otpSent ? handleOtpVerification : handleRegister}
                        sx={{ mt: 1 }}
                    >
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
                                    sx={{ mt: 3, mb: 2, py: 1.5, background: 'linear-gradient(to right, #6a11cb, #2575fc)', fontWeight: 'bold' }}
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
                                    sx={{ mt: 3, mb: 2, py: 1.5, background: 'linear-gradient(to right, #6a11cb, #2575fc)', fontWeight: 'bold' }}
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
                    {!otpSent && (
                        <>
                            <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                                OR
                            </Typography>
                            <hr />
                            <Button
                                onClick={handleGoogleSignIn}
                                variant="outlined"
                                startIcon={<GoogleIcon />}
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                Sign up with Google
                            </Button>
                        </>
                    )}
                    <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
                        <Grid item>
                            <Typography variant="body2">
                                Already have an account?{' '}
                                <Button color="secondary" onClick={() => navigate('/instructor/login')}>
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

export default InstructorRegister;
