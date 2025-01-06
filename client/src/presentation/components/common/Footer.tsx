import { Box, Grid, Typography, IconButton } from '@mui/material';
import { grey, orange } from '@mui/material/colors';
import { assets } from '../../../assets/assets_user/assets';
import { Facebook, Instagram, LinkedIn, Twitter, YouTube } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Become Instructor', path: '/become-an-instructor' },
    { name: 'Contact', path: '/contact' },
    { name: 'Courses', path: '/course-listing' },
  ];
  return (
    <Box
      sx={{
        backgroundColor: '#1D2026',
        color: grey[300],
        p: { xs: 2, sm: 4 },
        minHeight: '10vh',
      }}
    >
      <Grid
        container
        spacing={4}
        justifyContent={{ xs: 'center', sm: 'space-between' }}
        alignItems="flex-start"
      >
        {/* Logo and Description */}
        <Grid item xs={12} sm={6} md={3}>
          <Box display="flex" flexDirection="column" alignItems="start" gap={1} mb={2}>
            {/* Logo Image */}
            <Box display="flex" alignItems="center" gap={1}>
              <img
                src={assets.logo}
                alt="TutorG Logo"
                style={{ width: 36, height: 36, borderRadius: 4 }}
              />
              <Typography
                variant="h5"
                color="#F29D38"
                sx={{
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                Tutor<span style={{ color: '#0163FD', fontWeight: 'bold' }}>G</span>
              </Typography>
            </Box>
            <Typography variant="body2" color={grey[500]} mb={2}>
              Come and Learn at the Best Platform for Learning
            </Typography>
            <Box display="flex" gap={1}>
              {[Facebook, Instagram, LinkedIn, Twitter, YouTube].map((Icon, index) => (
                <IconButton
                  key={index}
                  sx={{ color: grey[300], '&:hover': { color: orange[500] } }}
                >
                  <Icon />
                </IconButton>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={6} sm={4} md={2}>
          <Typography variant="subtitle1" fontWeight="bold" color={grey[100]} gutterBottom>
            Quick Links
          </Typography>
          {quickLinks.map((link) => (
            <Typography
              key={link.name}
              variant="body2"
              component={Link}
              to={link.path}
              sx={{
                color: grey[400],
                textDecoration: 'none',
                display: 'block', 
               '&:hover': { color: orange[500] },
              }}
            >
              {link.name}
            </Typography>
          ))}
        </Grid>

        {/* Support */}
        <Grid item xs={6} sm={4} md={2}>
          <Typography variant="subtitle1" fontWeight="bold" color={grey[100]} gutterBottom>
            Support
          </Typography>
          {['Help Center', 'FAQs', 'Terms & Condition', 'Privacy Policy'].map((item) => (
            <Typography key={item} variant="body2" color={grey[400]}>
              {item}
            </Typography>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
