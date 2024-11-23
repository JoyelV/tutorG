import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Box, Avatar, Alert, Grid, Link } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../infrastructure/api/api'

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/user/login', { email, password });
            const { token, refreshToken, user } = response.data;

            if (user.role !== 'user') {
                setError('Access denied. Enter valid credentials.');
                toast.error('Access denied. Enter valid credentials.');
                return;
            }

            // Save tokens and user data securely
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('userId', user.id);
            localStorage.setItem('role', user.role);
            localStorage.setItem('username', user.username);

            toast.success('Login successful!');
            navigate('/');
        } catch (error) {
            setError('Login failed. Please check your credentials and try again.');
            toast.error('Login failed. Please check your credentials and try again.');
            console.error('Login failed:', error);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
            <ToastContainer />
            <Paper elevation={6} sx={{ padding: 4, borderRadius: 3 }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" gutterBottom>
                        Sign In
                    </Typography>
                    {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                    <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                        <TextField
                            label="Email"
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
                                mt: 3, mb: 2,
                                py: 1.5,
                                background: 'linear-gradient(to right, #6a11cb, #2575fc)',
                                fontWeight: 'bold'
                            }}
                        >
                            Login
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Don't have an account?{' '}
                                    <Button color="secondary" onClick={() => navigate('/register')}>
                                        Sign Up
                                    </Button>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
