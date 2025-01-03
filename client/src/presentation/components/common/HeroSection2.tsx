import React from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import { grey, orange } from '@mui/material/colors';

const HeroSection2: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: '#1D2026', color: grey[300], p: 6 }}>
      <Grid container alignItems="center" justifyContent="center" spacing={4}>
        <Grid item xs={12} md={6} justifyContent="center" textAlign="center">
          <Typography variant="h4" fontWeight="semibold" gutterBottom>
            Start learning with 67.1k<br className="hidden sm:block" />  students around the world.
          </Typography>
          <Box display="flex" gap={2} mt={2} justifyContent="center">
            <Button
              variant="contained"
              sx={{
                backgroundColor: orange[600],
                color: '#fff',
                '&:hover': { backgroundColor: orange[700] },
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              Join The Family
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: grey[800],
                color: grey[100],
                textTransform: 'none',
              }}
            >
              Browse All Courses
            </Button>
          </Box>
        </Grid>

        {/* Statistics */}
        <Grid item xs={12} md={6} textAlign="center">
          <Box display="flex" justifyContent="space-around" mt={{ xs: 4, md: 0 }}>
            <Box textAlign="center">
              <Typography variant="h5" fontWeight="bold">
                6.3k
              </Typography>
              <Typography variant="body2" color={grey[500]}>
                Online courses
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h5" fontWeight="bold">
                26k
              </Typography>
              <Typography variant="body2" color={grey[500]}>
                Certified Instructor
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h5" fontWeight="bold">
                99.9%
              </Typography>
              <Typography variant="body2" color={grey[500]}>
                Success Rate
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HeroSection2;
