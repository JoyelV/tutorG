import React, { useState } from 'react';
import {
    TextField,
    Button,
    Container,
    Typography,
    Paper,
    Box,
    Alert,
    Grid,
    Link,
} from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { assets } from '../../../assets/assets_user/assets';
import api from '../../../infrastructure/api/api';
import { useAuth } from '../../../infrastructure/context/AuthContext'

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/user/login', { email, password }, { withCredentials: true });

            const { token, user } = response.data;

            if (user.role !== 'user') {
                setError('Access denied. Enter valid credentials.');
                toast.error('Access denied. Enter valid credentials.');
                return;
            }
            login({
                token,
                userId: user.id,
                role: user.role,
                username: user.username,
            });
            navigate('/');
        } catch (error) {
            setError('Login failed. Please check your credentials and try again.');
            toast.error('Login failed. Please check your credentials and try again.');
        }
    };

    const handleGoogleSuccess = async (response: any) => {
        try {
            const res = await api.post('/user/google-login', { token: response.credential });
            const { token, user } = res.data;
            login({
                token,
                userId: user.id,
                role: user.role,
                username: user.username,
            });

            toast.success('Google Sign-In successful!');
            navigate('/');
        } catch (error) {
            setError('Google Sign-In failed. Please check your credentials and try again.');
            toast.error('Google Sign-In failed. Please check your credentials and try again.');
            console.error('Google Sign-In failed:', error);
        }
    };

    const handleGoogleFailure = () => {
        toast.error('Google Sign-In was unsuccessful. Try again later.');
    };

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 8 }}>
            <ToastContainer />
            <Paper elevation={6} sx={{ padding: 4, borderRadius: 3 }}>
                <Grid container spacing={2}>
                    {/* Left Column: Image */}
                    <Grid item xs={12} md={6}>
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="100%"
                        >
                            <img
                                src={assets.appointment_img} 
                                alt="Brand Illustration"
                                style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
                            />
                        </Box>
                    </Grid>
    
                    {/* Right Column: Brand Name and Login Form */}
                    <Grid item xs={12} md={6}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            {/* Brand Section */}
                            <Box textAlign="center" mb={3}>
                                <Typography
                                    variant="h3"
                                    color="#F29D38"
                                    sx={{
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    Tutor
                                    <span style={{ color: '#0163FD', fontWeight: 'bold' }}>G</span>
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Welcome to Your Ultimate E-Learning Platform!
                                </Typography>
                            </Box>
    
                            {/* Login Form */}
                            <Typography component="h1" variant="h5" gutterBottom>
                                Sign In
                            </Typography>
                            {error && (
                                <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                                    {error}
                                </Alert>
                            )}
                            <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                                <TextField
                                    label="Email(use small letters)"
                                    fullWidth
                                    required
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
                                <Grid container justifyContent="flex-end" sx={{ mt: 1 }}>
                                    <Grid item>
                                        <Link
                                            variant="body2"
                                            color="secondary"
                                            onClick={() => navigate('/forgot-password')}
                                            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                            Forgot password?
                                        </Link>
                                    </Grid>
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        mt: 3,
                                        mb: 2,
                                        py: 1.5,
                                        background: 'linear-gradient(to right, #6a11cb, #2575fc)',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Login
                                </Button>
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleFailure}
                                />
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            Don't have an account?{' '}
                                            <Button
                                                color="secondary"
                                                onClick={() => navigate('/register')}
                                            >
                                                Sign Up
                                            </Button>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
    
};

export default Login;
