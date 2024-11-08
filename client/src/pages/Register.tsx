import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Box, Avatar, Grid, Alert, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', { username, email, password, role: 'user' });
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Please try again.');
            console.error('Registration failed:', err);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
            <Paper elevation={6} sx={{ padding: 4, borderRadius: 3 }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" gutterBottom>
                        Sign Up
                    </Typography>
                    {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                    <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
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
                            Register
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Already have an account?{' '}
                                    <Button color="secondary" onClick={() => navigate('/login')}>
                                        Sign in
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

export default Register;
