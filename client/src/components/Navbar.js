import { AppBar, Toolbar, Typography, IconButton, InputBase, Button, Select, MenuItem, Box, Badge } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import { assets } from '../assets/assets_user/assets';

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = Boolean(localStorage.getItem('token'));

    const handleLogout = async () => {
        localStorage.clear(); 
        navigate('/login');
    };

    return (
        <AppBar position="static" color="default" elevation={1} sx={{ backgroundColor: 'white' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                {/* Logo and Brand Name */}
                <Box display="flex" alignItems="center" gap={1} sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                    {/* Logo Icon */}
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

                {/* Search and Category Selector */}
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, maxWidth: 600, gap: 1 }}>
                    <Select
                        defaultValue="Browse"
                        variant="outlined"
                        size="small"
                        sx={{ bgcolor: 'white', borderRadius: 1, width: 120 }}
                    >
                        <MenuItem value="Browse">Browse</MenuItem>
                        <MenuItem value="Category 1">Category 1</MenuItem>
                        <MenuItem value="Category 2">Category 2</MenuItem>
                    </Select>
                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, bgcolor: 'white', borderRadius: 1, paddingX: 1 }}>
                        <SearchIcon color="action" />
                        <InputBase
                            placeholder="What do you want to learn..."
                            fullWidth
                            sx={{ ml: 1 }}
                        />
                    </Box>
                </Box>

                {/* Icons */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton color="default">
                        <Badge badgeContent={4} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <IconButton color="default">
                        <FavoriteBorderIcon />
                    </IconButton>
                    <IconButton color="default">
                        <Badge badgeContent={3} color="secondary">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>
                </Box>

                {/* Auth Buttons */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {isLoggedIn ? (
                        <Button
                            onClick={handleLogout}
                            variant="contained"
                            color="error"
                            sx={{
                                fontWeight: 'bold',
                                textTransform: 'none',
                            }}
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
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
