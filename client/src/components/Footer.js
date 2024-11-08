import { Box, Grid, Typography, IconButton, Button } from '@mui/material';
import { grey, orange } from '@mui/material/colors';
import { assets } from '../assets/assets_user/assets';
import { Facebook, Instagram, LinkedIn, Twitter, YouTube, Apple, Google } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#1D2026', color: grey[300], p: 4 }}>
      <Grid container spacing={4} justifyContent="center">
        {/* Logo and Description */}
        <Grid item xs={12} md={3}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            {/* Logo Image */}
            <img
              src={assets.logo} 
              alt="TutorG Logo"
              style={{ width: 36, height: 36, borderRadius: 4 }}
            />
            <Typography 
              variant="h5" 
              color="#F29D38" 
              sx={{ fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center' }} 
            >
              Tutor
              <span style={{ color: '#0163FD', fontWeight: 'bold' }}>G</span>
            </Typography>
          </Box>
          <Typography variant="body2" color={grey[500]} mb={2}>
            Aliquam rhoncus ligula est, non pulvinar elit convallis nec. Donec mattis odio at.
          </Typography>
          <Box display="flex" gap={1}>
            <IconButton sx={{ color: grey[300], '&:hover': { color: orange[500] } }}>
              <Facebook />
            </IconButton>
            <IconButton sx={{ color: grey[300], '&:hover': { color: orange[500] } }}>
              <Instagram />
            </IconButton>
            <IconButton sx={{ color: grey[300], '&:hover': { color: orange[500] } }}>
              <LinkedIn />
            </IconButton>
            <IconButton sx={{ color: grey[300], '&:hover': { color: orange[500] } }}>
              <Twitter />
            </IconButton>
            <IconButton sx={{ color: grey[300], '&:hover': { color: orange[500] } }}>
              <YouTube />
            </IconButton>
          </Box>
        </Grid>

        {/* Other Sections */}
        {/* Top Categories */}
        <Grid item xs={6} md={2}>
          <Typography variant="subtitle1" fontWeight="bold" color={grey[100]} gutterBottom>
            Top Category
          </Typography>
          <Typography variant="body2" color={grey[400]}>Development</Typography>
          <Typography variant="body2" color={grey[400]}>Finance & Accounting</Typography>
          <Typography variant="body2" color={grey[400]}>Design</Typography>
          <Typography variant="body2" color={grey[400]}>Business</Typography>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={6} md={2}>
          <Typography variant="subtitle1" fontWeight="bold" color={grey[100]} gutterBottom>
            Quick Links
          </Typography>
          <Typography variant="body2" color={grey[400]}>About</Typography>
          <Typography variant="body2" color={grey[400]}>Become Instructor</Typography>
          <Typography variant="body2" color={grey[400]}>Contact</Typography>
          <Typography variant="body2" color={grey[400]}>Career</Typography>
        </Grid>

        {/* Support */}
        <Grid item xs={6} md={2}>
          <Typography variant="subtitle1" fontWeight="bold" color={grey[100]} gutterBottom>
            Support
          </Typography>
          <Typography variant="body2" color={grey[400]}>Help Center</Typography>
          <Typography variant="body2" color={grey[400]}>FAQs</Typography>
          <Typography variant="body2" color={grey[400]}>Terms & Condition</Typography>
          <Typography variant="body2" color={grey[400]}>Privacy Policy</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
