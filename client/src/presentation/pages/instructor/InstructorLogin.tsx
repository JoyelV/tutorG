import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Box, Avatar, Alert,Link,Grid } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import api from '../../../infrastructure/api/api';
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
            const response = await api.post('/instructor/login', { email, password });
            const userId = response.data.user.id;
            const token = response.data.token;
            const refreshToken = response.data.refreshToken;
            const userRole = response.data.user.role;
            const username = response.data.user.username;
            
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('userId', userId);
            localStorage.setItem('role', userRole);
            localStorage.setItem('username',username);

            if (userRole !== 'instructor') {
                setError('Access denied. Only Instructors can log in.');
                return;
            }
            console.log("userRole in instructor",userRole);
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
        <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
            <Paper elevation={6} sx={{ padding: 4, borderRadius: 3 }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" gutterBottom>
                    Instructor Sign In
                    </Typography>
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
                                fontWeight: 'bold'
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
                        {/* <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Don't have an account?{' '}
                                    <Button color="secondary" onClick={() => navigate('/instructor/tutor-register')}>
                                        Sign Up
                                    </Button>
                                </Typography>
                            </Grid>
                        </Grid> */}
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default InstructorLogin;
