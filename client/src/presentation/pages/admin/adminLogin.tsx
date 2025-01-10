import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Box, Alert, Link, Grid } from '@mui/material';
import api from '../../../infrastructure/api/api';
import { assets } from '../../../assets/assets_user/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../infrastructure/context/AuthContext';

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/admin/login', { email, password }, { withCredentials: true });
            const { token, user } = response.data;
            if (user.role !== 'admin') {
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
            navigate('/admin/dashboard');
        } catch (error) {
            setError('Admin login failed. Please check your credentials.');
            toast.error('Login failed. Please check your credentials and try again.');
        }
    };

    const handleForgotPassword = () => {
        navigate('/admin/forgot-password');
    };

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 8 }}>
            <Paper elevation={6} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Grid container spacing={2}>
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
                                src={assets.appointment_img}
                                alt="Instructor Login"
                                style={{
                                    width: '100%',
                                    objectFit: 'cover',
                                    height: 'auto',
                                    maxHeight: '400px', // Limit height on smaller screens
                                }}
                            />
                        </Box>
                    </Grid>

                    {/* Right Side: Login Form Section */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ p: 4 }}>
                            {/* Brand Section */}
                            <Box textAlign="center" mb={3}>
                                <Typography
                                    variant="h4"
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
                                    Welcome to Admin Platform!
                                </Typography>
                                <Typography component="h1" variant="h5" gutterBottom>
                                    Admin Sign In
                                </Typography>
                            </Box>

                            {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                            <Box component="form" onSubmit={handleAdminLogin} sx={{ mt: 1 }}>
                                <TextField
                                    label="Admin Email"
                                    fullWidth
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    margin="normal"
                                    variant="outlined"
                                    sx={{
                                        fontSize: { xs: '0.875rem', sm: '1rem' }, // Responsive font size
                                    }}
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
                                    sx={{
                                        fontSize: { xs: '0.875rem', sm: '1rem' }, // Responsive font size
                                    }}
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
                                        fontSize: { xs: '1rem', sm: '1.125rem' }, // Responsive font size
                                    }}
                                >
                                    Admin Login
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

export default AdminLogin;
