import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Box, Alert, Link } from '@mui/material';
import api from '../../../infrastructure/api/api';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import firebaseApp from '../../../infrastructure/config/firebaseConfig';

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const auth = getAuth(firebaseApp);

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/admin/login', { email, password }, { withCredentials: true });

            const userId = response.data.user.id;
            const token = response.data.token;
            const userRole = response.data.user.role;
            const username = response.data.user.username;
            
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            localStorage.setItem('role', userRole);
            localStorage.setItem('username',username);

            if (userRole !== 'admin') {
                setError('Access denied. Only administrators can log in.');
                return;
            }
            
            navigate('/admin/dashboard');
        } catch (error) {
            setError('Admin login failed. Please check your credentials.');
            console.error('Admin login error:', error);
        }
    };

    const handleForgotPassword = () => {
        navigate('/admin/forgot-password');
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
            <Paper elevation={6} sx={{ padding: 4, borderRadius: 3 }}>
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
                                    Welcome to Admin Platform!
                                </Typography>
                            </Box>
                    <Typography component="h1" variant="h5" gutterBottom>
                        Admin Sign In
                    </Typography>
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
                                fontWeight: 'bold'
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
            </Paper>
        </Container>
    );
};

export default AdminLogin;
