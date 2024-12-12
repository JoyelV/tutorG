import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Box, Alert, Link, Grid } from '@mui/material';
import api from '../../../infrastructure/api/api';
import { assets } from '../../../assets/assets_user/assets';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import firebaseApp from '../../../infrastructure/config/firebaseConfig';

const InstructorLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const auth = getAuth(firebaseApp);

    const handleInstructorLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/instructor/login', { email, password }, { withCredentials: true });

            const userId = response.data.user.id;
            const token = response.data.token;
            const userRole = response.data.user.role;
            const username = response.data.user.username;

            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            localStorage.setItem('role', userRole);
            localStorage.setItem('username', username);

            if (userRole !== 'instructor') {
                setError('Access denied. Only Instructors can log in.');
                return;
            }
            console.log("userRole in instructor", userRole);
            navigate('/instructor/instructor-dashboard');
        } catch (error) {
            setError('Instructor login failed. Please check your credentials.');
            console.error('Instructor login error:', error);
        }
    };

    const handleForgotPassword = () => {
        navigate('/instructor/forgot-password');
    };

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 8 }}>
            <Paper elevation={6} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Grid container>
                    {/* Left Side - Image */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#f5f5f5',
                            }}
                        >
                            <img
                                src={assets.InstuctorImage}
                                alt="Instructor Login"
                                style={{ width: '100%', objectFit: 'cover' }}
                            />
                        </Box>
                    </Grid>

                    {/* Right Side - Login Form */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ p: 4 }}>
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
                                    Welcome to Your Instructor's Platform!
                                </Typography>
                                <Typography component="h1" variant="h5" gutterBottom>
                                Instructor Sign In
                            </Typography>
                            </Box>
                            {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                            <Box component="form" onSubmit={handleInstructorLogin} sx={{ mt: 1 }}>
                                <TextField
                                    label="Instructor Email"
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
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        mt: 3, mb: 2,
                                        py: 1.5,
                                        background: 'linear-gradient(to right, #ff5e5e, #ff0077)',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Instructor Login
                                </Button>
                                <Box display="flex" justifyContent="flex-end">
                                    <Link
                                        component="button"
                                        variant="body2"
                                        onClick={handleForgotPassword}
                                        sx={{ cursor: 'pointer', color: 'primary.main' }}
                                    >
                                        Forgot Password?
                                    </Link>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default InstructorLogin;
