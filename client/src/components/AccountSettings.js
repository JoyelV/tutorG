import React, { useState, useEffect,useCallback } from 'react';
import { Avatar, Button, Grid, TextField, Box, Typography, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { assets } from '../assets/assets_user/assets';

const AccountSettings = () => {
    const [image, setImage] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Function to toggle password visibility
    const togglePasswordVisibility = (type) => {
        switch (type) {
            case 'current':
                setShowCurrentPassword(!showCurrentPassword);
                break;
            case 'new':
                setShowNewPassword(!showNewPassword);
                break;
            case 'confirm':
                setShowConfirmPassword(!showConfirmPassword);
                break;
            default:
                break;
        }
    };

    const validateProfile = () => {
        // Check if any required field is empty
        if (!username || !email || !phone || !addressLine1 || !addressLine2 || !gender || !dob) {
            toast.error('All fields are required.');
            return false;
        }
    
        // Validate email format
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) {
            toast.error('Invalid email format.');
            return false;
        }
    
        // Validate phone number (10 digits)
        if (!/^\d{10}$/.test(phone)) {
            toast.error('Phone number should be exactly 10 digits.');
            return false;
        }
    
        // Gender validation (only male, female, transgender allowed)
        const validGenders = ['male', 'female', 'transgender'];
        if (!validGenders.includes(gender)) {
            toast.error('Please select a valid gender');
            return false;
        }
    
        // Date of birth validation (check if it's a valid date)
        const dobDate = new Date(dob);
        if (isNaN(dobDate.getTime())) {
            toast.error('Invalid date of birth.');
            return false;
        }
    
        // Validate that address fields do not contain special characters or numbers (if required)
        const addressRegex = /^[A-Za-z0-9\s]+$/;
        if (!addressRegex.test(addressLine1) || !addressRegex.test(addressLine2)) {
            toast.error('Address should contain only letters,numbers and spaces.');
            return false;
        }
    
        // Validate that username contains only letters and spaces (if required)
        const usernameRegex = /^[A-Za-z\s]+$/;
        if (!usernameRegex.test(username)) {
            toast.error('Username should contain only letters and spaces.');
            return false;
        }
    
        return true;
    };
    

    const validatePassword = () => {
        // Check if any password fields are empty
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('All password fields are required.');
            return false;
        }
    
        // Validate new password strength (at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character)
        const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordStrengthRegex.test(newPassword)) {
            toast.error('New password must be at least 8 characters long, include uppercase, lowercase, number, and special character.');
            return false;
        }
    
        // Check if new password matches confirm password
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match.');
            return false;
        }
    
        return true;
    };
    

    const fetchUserData = useCallback(async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.get(`http://localhost:5000/api/user/profile/${userId}`);
            const data = response.data;
            
            // Update states with fetched data
            setUsername(data.username || '');
            setEmail(data.email || '');
            setPhone(data.phone || '');
            setAddressLine1(data.address?.line1 || '');
            setAddressLine2(data.address?.line2 || '');
            setGender(data.gender || '');
            const formattedDob = data.dob ? new Date(data.dob).toISOString().split('T')[0] : '';
            setDob(formattedDob);
            setImage(data.image ? `http://localhost:5000${data.image}` : '');

        } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error('Error fetching user data');
        }
    }, []); // Empty dependency array to ensure function is only created once
    

    const handleImageChange = (e) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file && file.size <= 1 * 1024 * 1024) {  // Validate size < 1MB
          setImage(URL.createObjectURL(file));  // Preview the selected image
          uploadImage(file);  
        } else {
          toast.error('Image size should be under 1MB');
        }
      };
    
const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);  
  
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('User not logged in');
        return;
      }
  
      const response = await axios.put(
        `http://localhost:5000/api/user/upload-image/${userId}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', 
          },
        }
      );
  
      console.log(response.data, "image uploaded details");
      if (response.data.success) {
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      toast.error('Error uploading image');
      console.error(error);
    }
  };
  
    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        if (!validateProfile()) return;
        
        const profileData = {
            username,
            email,
            phone,
            address: {
                line1: addressLine1,
                line2: addressLine2,
            },
            gender,
            dob,
            image, 
        };
        
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.put(`http://localhost:5000/api/user/update/${userId}`, profileData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };
    
    
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (!validatePassword()) return;
    
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
    
        const passwordData = {
            currentPassword,
            newPassword,
        };
    
        try {
            const userId = localStorage.getItem('userId');
            console.log("userId password",userId)
            await axios.put(`http://localhost:5000/api/user/update-password/${userId}`, passwordData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            toast.success('Password updated successfully!');
        } catch (error) {
            console.error('Error updating password:', error);
            toast.error('Failed to update password');
        }
    };
    

useEffect(() => {
    fetchUserData();
}, [fetchUserData]);

    return (
        <Box p={4}>
            <ToastContainer />
            <Grid container spacing={4}>
                {/* Profile Image Section */}
                <Grid item xs={12} sm={4} container direction="column" alignItems="center">
                    <Typography variant="h6" gutterBottom>Click Photo To Change</Typography>
                    <div style={{ position: 'relative', textAlign: 'center' }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            id="profile-image-upload"
                        />
                        <label htmlFor="profile-image-upload">
                            <Avatar
                                src={image || assets.Instructor3}
                                sx={{ width: 250, height: 250, cursor: 'pointer', borderRadius: 2 }}
                            />
                        </label>
                    </div>
                    <Typography variant="body2" color="textSecondary" mt={2}>
                        Image size should be under 1MB and image ratio needs to be 1:1
                    </Typography>
                    {image && (
                        <Typography variant="body2" color="textSecondary" mt={2}>
                            Click to change photo
                        </Typography>
                    )}
                </Grid>

                {/* Account Information Form */}
                <Grid item xs={12} sm={8}>
                    <form onSubmit={handleProfileSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    variant="outlined"
                                    placeholder="Enter your full name"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    variant="outlined"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    variant="outlined"
                                    placeholder="Enter your phone number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Address Line 1"
                                    variant="outlined"
                                    placeholder="Enter your address line 1"
                                    value={addressLine1}
                                    onChange={(e) => setAddressLine1(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Address Line 2"
                                    variant="outlined"
                                    placeholder="Enter your address line 2"
                                    value={addressLine2}
                                    onChange={(e) => setAddressLine2(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Gender"
                                    variant="outlined"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    placeholder="Enter your gender"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Date of Birth"
                                    variant="outlined"
                                    type="date"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Box mt={4}>
                            <Button type="submit" variant="contained" color="warning">
                                Save Changes
                            </Button>
                        </Box>
                    </form>
                </Grid>
            </Grid>

            {/* Change Password Section */}
            <Box mt={6}>
                <Typography variant="h5" gutterBottom>Change Password</Typography>
                <form onSubmit={handlePasswordSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Current Password"
                                variant="outlined"
                                type={showCurrentPassword ? 'text' : 'password'}
                                placeholder="Enter your current password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => togglePasswordVisibility('current')}>
                                                {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="New Password"
                                variant="outlined"
                                type={showNewPassword ? 'text' : 'password'}
                                placeholder="Enter your new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => togglePasswordVisibility('new')}>
                                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Confirm New Password"
                                variant="outlined"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => togglePasswordVisibility('confirm')}>
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Box mt={4}>
                        <Button type="submit" variant="contained" color="warning">
                            Change Password
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
};


export default AccountSettings;