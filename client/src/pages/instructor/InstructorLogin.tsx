import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Box, Avatar, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import firebaseApp from '../../config/firebaseConfig';

const InstructorLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const auth = getAuth(firebaseApp);

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            const token = response.data.token;
            const userRole = response.data.user.role;

            if (userRole !== 'instructor') {
                setError('Access denied. Only Instructors can log in.');
                return;
            }

            localStorage.setItem('token', token);
            localStorage.setItem('role', userRole);
            navigate('/instructor/dashboard');
        } catch (error) {
            setError('Instructor login failed. Please check your credentials.');
            console.error('Instructor login error:', error);
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
                    Instructor Sign In
                    </Typography>
                    {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
                    <Box component="form" onSubmit={handleAdminLogin} sx={{ mt: 1 }}>
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
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default InstructorLogin;
