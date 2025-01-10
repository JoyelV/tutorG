import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react';
import { Avatar, Button, Grid, TextField, Box, Typography, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import api from '../../../infrastructure/api/api'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { assets } from '../../../assets/assets_user/assets';

interface UserProfileData {
  username: string;
  email: string;
  phone: string;
  address: {
    line1: string;
    line2: string;
  };
  gender: string;
  dob: string;
  image: string;
}

const AccountSettings: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [addressLine1, setAddressLine1] = useState<string>('');
  const [addressLine2, setAddressLine2] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const togglePasswordVisibility = (type: 'current' | 'new' | 'confirm') => {
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

  const validateProfile = (): boolean => {
    if (!username || !email || !phone || !addressLine1 || !addressLine2 || !gender || !dob) {
      toast.error('All fields are required.');
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email format.');
      return false;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error('Phone number should be exactly 10 digits.');
      return false;
    }

    const validGenders = ['male', 'female', 'transgender'];
    if (!validGenders.includes(gender)) {
      toast.error('Please select a valid gender');
      return false;
    }

    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime())) {
      toast.error('Invalid date of birth.');
      return false;
    }

    const addressRegex = /^[A-Za-z0-9\s]+$/;
    if (!addressRegex.test(addressLine1) || !addressRegex.test(addressLine2)) {
      toast.error('Address should contain only letters, numbers, and spaces.');
      return false;
    }

    const usernameRegex = /^[A-Za-z\s]+$/;
    if (!usernameRegex.test(username)) {
      toast.error('Username should contain only letters and spaces.');
      return false;
    }

    return true;
  };

  const validatePassword = (): boolean => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required.');
      return false;
    }

    const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordStrengthRegex.test(newPassword)) {
      toast.error('New password must be at least 8 characters long, include uppercase, lowercase, number, and special character.');
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return false;
    }

    return true;
  };

  const fetchUserData = useCallback(async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('User not logged in');
        return;
      }
      const response = await api.get<UserProfileData>(`/user/profile`);
      const data = response.data;

      setUsername(data.username || '');
      setEmail(data.email || '');
      setPhone(data.phone || '');
      setAddressLine1(data.address?.line1 || '');
      setAddressLine2(data.address?.line2 || '');
      setGender(data.gender || '');
      const formattedDob = data.dob ? new Date(data.dob).toISOString().split('T')[0] : '';
      setDob(formattedDob);
      setImage(data.image || '');
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Error fetching user data');
    }
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.size <= 1 * 1024 * 1024) {
      setImage(URL.createObjectURL(file));
      uploadImage(file);
    } else {
      toast.error('Image size should be under 1MB');
    }
  };

  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('User not logged in');
        return;
      }

      const response = await api.put(`/user/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Image uploaded successfully!');
        setImage(response.data.imageUrl);
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      toast.error('Error uploading image');
      console.error(error);
    }
  };

  const handleProfileSubmit = async (e: FormEvent) => {
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
    };

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('User not logged in');
        return;
      }
      const response = await api.put(`/user/update`, profileData, {
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

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) return;

    const passwordData = {
      currentPassword,
      newPassword,
    };

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('User not logged in');
        return;
      }

      await api.put(`/user/update-password`, passwordData, {
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
                sx={{ width: 250, height: 250, cursor: 'pointer' }}
              />
            </label>
          </div>
        </Grid>

        {/* Profile Form */}
        <Grid item xs={12} sm={8}>
          <form onSubmit={handleProfileSubmit}>
            <TextField
              label="Username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              label="Phone"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              required
              margin="normal"
            />
            <TextField
              label="Address Line 1"
              fullWidth
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              label="Address Line 2"
              fullWidth
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              label="Gender"
              fullWidth
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              label="Date of Birth"
              fullWidth
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              type="date"
              required
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Update Profile
            </Button>
          </form>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom mt={4}>
        Change Password
      </Typography>
      <form onSubmit={handlePasswordSubmit}>
        <TextField
          label="Current Password"
          type={showCurrentPassword ? 'text' : 'password'}
          fullWidth
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          margin="normal"
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => togglePasswordVisibility('current')}
                edge="end"
              >
                {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
        <TextField
          label="New Password"
          type={showNewPassword ? 'text' : 'password'}
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          margin="normal"
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => togglePasswordVisibility('new')}
                edge="end"
              >
                {showNewPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
        <TextField
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          margin="normal"
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => togglePasswordVisibility('confirm')}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Update Password
        </Button>
      </form>
    </Box>
  );
};

export default AccountSettings;
