import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    InputBase,
    Button,
    Box,
    Badge,
    Menu,
    MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { assets } from '../../../assets/assets_user/assets';
import { Link } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('role') === 'user';
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        localStorage.clear();
        navigate('/login');
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

                {/* Search Bar (Hidden on Mobile) */}
                {!isMobile && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flex: 1,
                            maxWidth: 600,
                            bgcolor: 'white',
                            borderRadius: 1,
                            paddingX: 1,
                        }}
                    >
                        <SearchIcon color="action" />
                        <InputBase
                            placeholder="What do you want to learn..."
                            fullWidth
                            sx={{ ml: 1 }}
                            onFocus={(e) => e.target.select()}
                        />
                    </Box>
                )}

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
                            <MenuItem onClick={() => navigate('/notifications')}>Notifications</MenuItem>
                            <MenuItem onClick={() => navigate('/user-profile')}>Wish List</MenuItem>
                            <MenuItem onClick={() => navigate('/cart')}>Add to Cart</MenuItem>
                            {isLoggedIn ? (
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            ) : (
                                <>
                                    <MenuItem onClick={() => navigate('/register')}>Create Account</MenuItem>
                                    <MenuItem onClick={() => navigate('/login')}>Sign In</MenuItem>
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
                        <Link to="/user-profile">
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
