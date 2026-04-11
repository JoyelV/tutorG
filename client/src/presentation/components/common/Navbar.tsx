import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Button,
    Box,
    Badge,
    Menu,
    MenuItem,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { assets } from '../../../assets/assets_user/assets';
import { Link } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';
import { useAuth } from '../../../infrastructure/context/AuthContext';
import api from '../../../infrastructure/api/api';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = localStorage.getItem('role') === 'user';
    const username = localStorage.getItem('username') || 'Guest';
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { logout } = useAuth();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        const response = await api.post('/user/logout', { withCredentials: true });
        console.log('API Response:', response);
        if (response.status === 200) {
            logout();
            navigate('/login');
        }
    };

    return (
        <AppBar position="static" color="default" elevation={0} sx={{ backgroundColor: 'white' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                {/* Logo and Brand Name */}
                <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                >
                    <Box
                        component="img"
                        src={assets.logo}
                        alt="Logo"
                        sx={{ width: 36, height: 36, borderRadius: 1 }}
                    />
                    <Typography
                        variant="h5"
                        color="#F29D38"
                        sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
                    >
                        Tutor
                        <span style={{ color: '#0163FD', fontWeight: 'bold' }}>G</span>
                    </Typography>
                </Box>

                {/* Welcome Message */}
                <Typography
                    variant="h6"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        fontWeight: 'bold',
                        fontSize: '1.25rem',
                        background: 'linear-gradient(to right, #0163FD, #F29D38)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textTransform: 'capitalize',
                        letterSpacing: 1.2,
                        marginLeft: 2,
                    }}
                >
                    Welcome, {isLoggedIn ? username : 'Guest'}!
                </Typography>

                {/* Navigation Links (Desktop) */}
                <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 3 }}>
                    <Typography
                        variant="body1"
                        sx={{ 
                            cursor: 'pointer', 
                            fontWeight: 500, 
                            color: location.pathname === '/' ? '#0163FD' : 'inherit',
                            '&:hover': { color: '#0163FD' } 
                        }}
                        onClick={() => navigate('/')}
                    >
                        Home
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ 
                            cursor: 'pointer', 
                            fontWeight: 500, 
                            color: location.pathname === '/course-listing' ? '#0163FD' : 'inherit',
                            '&:hover': { color: '#0163FD' } 
                        }}
                        onClick={() => navigate('/course-listing')}
                    >
                        Courses
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ 
                            cursor: 'pointer', 
                            fontWeight: 500, 
                            color: location.pathname === '/about' ? '#0163FD' : 'inherit',
                            '&:hover': { color: '#0163FD' } 
                        }}
                        onClick={() => navigate('/about')}
                    >
                        About
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ 
                            cursor: 'pointer', 
                            fontWeight: 500, 
                            color: location.pathname === '/contact' ? '#0163FD' : 'inherit',
                            '&:hover': { color: '#0163FD' } 
                        }}
                        onClick={() => navigate('/contact')}
                    >
                        Contact
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ 
                            cursor: 'pointer', 
                            fontWeight: 500, 
                            color: location.pathname === '/become-an-instructor' ? '#0163FD' : 'inherit',
                            '&:hover': { color: '#0163FD' } 
                        }}
                        onClick={() => navigate('/become-an-instructor')}
                    >
                        Become Instructor
                    </Typography>
                    {isLoggedIn && (
                        <Typography
                            variant="body1"
                            sx={{ 
                                cursor: 'pointer', 
                                fontWeight: 500, 
                                color: location.pathname === '/user-profile' ? '#0163FD' : 'inherit',
                                '&:hover': { color: '#0163FD' } 
                            }}
                            onClick={() => navigate('/user-profile')}
                        >
                            Profile
                        </Typography>
                    )}
                </Box>

                {/* Icons and Auth Buttons */}
                {isMobile ? (
                    <>
                        <IconButton onClick={handleMenuOpen} color="default">
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <MenuItem selected={location.pathname === '/'} onClick={() => { navigate('/'); handleMenuClose(); }}>Home</MenuItem>
                            <MenuItem selected={location.pathname === '/course-listing'} onClick={() => { navigate('/course-listing'); handleMenuClose(); }}>Courses</MenuItem>
                            <MenuItem selected={location.pathname === '/about'} onClick={() => { navigate('/about'); handleMenuClose(); }}>About</MenuItem>
                            <MenuItem selected={location.pathname === '/contact'} onClick={() => { navigate('/contact'); handleMenuClose(); }}>Contact</MenuItem>
                            <MenuItem selected={location.pathname === '/become-an-instructor'} onClick={() => { navigate('/become-an-instructor'); handleMenuClose(); }}>Become Instructor</MenuItem>
                            {isLoggedIn && (
                                <MenuItem selected={location.pathname === '/user-profile'} onClick={() => { navigate('/user-profile'); handleMenuClose(); }}>Profile</MenuItem>
                            )}
                            <hr />
                            <MenuItem selected={location.pathname === '/notifications'} onClick={() => { navigate('/notifications'); handleMenuClose(); }}>Notifications</MenuItem>
                            <MenuItem selected={location.pathname === '/wishlist'} onClick={() => { navigate('/wishlist'); handleMenuClose(); }}>Wish List</MenuItem>
                            <MenuItem selected={location.pathname === '/cart'} onClick={() => { navigate('/cart'); handleMenuClose(); }}>Cart</MenuItem>
                            {isLoggedIn ? (
                                <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>Logout</MenuItem>
                            ) : (
                                <>
                                    <MenuItem onClick={() => { navigate('/register'); handleMenuClose(); }}>Create Account</MenuItem>
                                    <MenuItem onClick={() => { navigate('/login'); handleMenuClose(); }}>Sign In</MenuItem>
                                </>
                            )}
                        </Menu>
                    </>
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* Icons */}
                        <Link to="/notifications">
                            <IconButton color="default">
                                <Badge badgeContent={0} color="secondary">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                        </Link>
                        <Link to="/wishlist">
                            <IconButton color="default">
                                <FavoriteBorderIcon />
                            </IconButton>
                        </Link>
                        <Link to="/cart">
                            <IconButton color="default">
                                <Badge badgeContent={0} color="secondary">
                                    <ShoppingCartIcon />
                                </Badge>
                            </IconButton>
                        </Link>

                        {/* Auth Buttons */}
                        {isLoggedIn ? (
                            <Button
                                onClick={handleLogout}
                                variant="contained"
                                color="error"
                                sx={{ fontWeight: 'bold', textTransform: 'none' }}
                            >
                                Logout
                            </Button>
                        ) : (
                            <>
                                <Button
                                    onClick={() => navigate('/register')}
                                    variant="contained"
                                    color="warning"
                                    sx={{ fontWeight: 'bold', textTransform: 'none' }}
                                >
                                    Create Account
                                </Button>
                                <Button
                                    onClick={() => navigate('/login')}
                                    variant="outlined"
                                    color="warning"
                                    sx={{ fontWeight: 'bold', textTransform: 'none' }}
                                >
                                    Sign In
                                </Button>
                            </>
                        )}
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
