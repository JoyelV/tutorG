import React, { useState } from 'react';
import { Avatar, Button, Grid, TextField, Box, Typography } from '@mui/material';
import axios from 'axios';
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

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file && file.size <= 1 * 1024 * 1024) {
            setImage(URL.createObjectURL(file));
        } else {
            alert('Image size should be under 1MB');
        }
    };

    // Handle password visibility toggle
    const togglePasswordVisibility = (setter) => {
        setter((prev) => !prev);
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        // Collect all form data
        const formData = {
            username,
            email,
            phone,
            address: {
                line1: addressLine1,
                line2: addressLine2,
            },
            gender,
            dob,
            currentPassword,
            newPassword,
            image, 
        };

        try {
            // Send data to your backend (Make sure to implement API route on your backend)
            const response = await axios.put('/api/user/update', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(response.data);
            alert('Account updated successfully!');
        } catch (error) {
            console.error(error);
            alert('An error occurred while updating the account.');
        }
    };

    return (
        <Box p={4}>
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
                                src={image ||assets.Instructor3}
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
                    <form onSubmit={handleSubmit}>
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
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/* Current Password */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Current Password"
                                variant="outlined"
                                type={showCurrentPassword ? 'text' : 'password'}
                                placeholder="Enter your current password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility(setShowCurrentPassword)}
                                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                            </button>
                        </Grid>

                        {/* New Password */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="New Password"
                                variant="outlined"
                                type={showNewPassword ? 'text' : 'password'}
                                placeholder="Enter your new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility(setShowNewPassword)}
                                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                            </button>
                        </Grid>

                        {/* Confirm New Password */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Confirm New Password"
                                variant="outlined"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility(setShowConfirmPassword)}
                                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                            </button>
                        </Grid>
                    </Grid>

                    <Box mt={4}>
                        <Button type="submit" variant="contained" color="warning">
                            Save Password Changes
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

export default AccountSettings;
