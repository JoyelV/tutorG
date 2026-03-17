import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loader: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#ffffff',
            }}
        >
            <CircularProgress size={60} thickness={4} sx={{ color: '#0163FD' }} />
            <Typography
                variant="h6"
                sx={{
                    marginTop: 2,
                    color: '#343a40',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                }}
            >
                Loading TutorG...
            </Typography>
        </Box>
    );
};

export default Loader;
