import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Box, Avatar, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import firebaseApp from '../../config/firebaseConfig';

const AdminLogin: React.FC = () => {
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

            if (userRole !== 'admin') {
                setError('Access denied. Only administrators can log in.');
                return;
            }

            localStorage.setItem('token', token);
            localStorage.setItem('role', userRole);
            navigate('/admin/dashboard');
        } catch (error) {
            setError('Admin login failed. Please check your credentials.');
            console.error('Admin login error:', error);
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
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default AdminLogin;
