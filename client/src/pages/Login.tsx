import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });

            const userId = response.data.user.id;
            const token = response.data.token;
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            console.log(userId,"userId");
            console.log(token,"token");

            navigate('/'); 
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4">Login</Typography>
            <form onSubmit={handleLogin}>
                <TextField
                    label="Email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary">Login</Button>
            </form>
        </Container>
    );
};

export default Login;
