import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Box, Avatar, Grid, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Google as GoogleIcon, Facebook as FacebookIcon } from '@mui/icons-material';
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import firebaseApp from '../config/firebaseConfig'; 

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth(firebaseApp);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Password validation
        if (password !== confirmPassword) {
            setPasswordMismatch(true);
            return;
        } else {
            setPasswordMismatch(false);
        }

        try {
            await axios.post('http://localhost:5000/api/auth/register', { username, email, password, role: 'user' });
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Please try again.');
            console.error('Registration failed:', err);
        }
    };

    // Social auth handlers
    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            navigate('/'); // Redirect to home or dashboard on success
        } catch (err) {
            setError('Google sign-in failed. Please try again.');
            console.error('Google sign-in failed:', err);
        }
    };

    const handleFacebookSignIn = async () => {
        try {
            const provider = new FacebookAuthProvider();
            await signInWithPopup(auth, provider);
            navigate('/');
        } catch (err) {
            setError('Facebook sign-in failed. Please try again.');
            console.error('Facebook sign-in failed:', err);
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
                    {passwordMismatch && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>Passwords do not match!</Alert>}
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
                        <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                            OR
                        </Typography>
                        <hr />
                        <Grid container spacing={4} justifyContent="center" sx={{ mt: 1 }}>
                            <Button
                                onClick={handleGoogleSignIn}
                                variant="outlined"
                                startIcon={<GoogleIcon />}
                            >
                                Google
                            </Button>
                            <Button
                                onClick={handleFacebookSignIn}
                                variant="outlined"
                                startIcon={<FacebookIcon />}
                            >
                                Facebook
                            </Button>
                        </Grid>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;
