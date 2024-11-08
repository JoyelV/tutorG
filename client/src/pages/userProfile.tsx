import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Avatar,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface Address {
  line1?: string;
  line2?: string;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  image?: string;
  address?: Address;
  gender: string;
  dob: string;
}

const MyProfile: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        if (userId) {
          const response = await axios.get<UserData>(`http://localhost:5000/api/users/profile/${userId}`);
          setUserData(response.data);
        } else {
          setError("No userId found in local storage");
        }
      } catch (error) {
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (field: keyof UserData, value: string) => {
    if (userData) {
      setUserData({ ...userData, [field]: value });
    }
  };

  const handleAddressChange = (line: keyof Address, value: string) => {
    if (userData) {
      setUserData({
        ...userData,
        address: { ...userData.address, [line]: value },
      });
    }
  };

  const saveProfile = async () => {
    try {
      if (userData) {
        await axios.put(`http://localhost:5000/api/users/profile/${userData._id}`, userData);
        setIsEdit(false);
      }
    } catch (error) {
      console.error("Error saving user data:", error);
      setError("Failed to save user data.");
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const handleSaveClick = () => {
    if (isEdit) {
      setConfirmDialogOpen(true);
    } else {
      setIsEdit(true);
    }
  };

  const handleConfirmSave = () => {
    saveProfile();
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="sm" sx={{ my: 4, p: 3, borderRadius: 2, boxShadow: 3, bgcolor: 'background.paper' }}>
      <Box textAlign="center" mb={3}>
        <Avatar src={userData?.image || 'default_image_path'} alt={userData?.name} sx={{ width: 80, height: 80, mb: 2 }} />
        {isEdit ? (
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            value={userData?.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            sx={{ mb: 2 }}
          />
        ) : (
          <Typography variant="h5" component="div" fontWeight="medium">
            {userData?.name}
          </Typography>
        )}
      </Box>

      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Contact Information
      </Typography>
      <Box display="grid" gridTemplateColumns="1fr 3fr" gap={2} mb={2}>
        <Typography fontWeight="bold">Email:</Typography>
        <Typography color="primary">{userData?.email}</Typography>

        <Typography fontWeight="bold">Phone:</Typography>
        {isEdit ? (
          <TextField
            fullWidth
            variant="outlined"
            value={userData?.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        ) : (
          <Typography>{userData?.phone}</Typography>
        )}

        <Typography fontWeight="bold">Address:</Typography>
        {isEdit ? (
          <Box>
            <TextField
              fullWidth
              placeholder="Line 1"
              variant="outlined"
              value={userData?.address?.line1 || ''}
              onChange={(e) => handleAddressChange('line1', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              placeholder="Line 2"
              variant="outlined"
              value={userData?.address?.line2 || ''}
              onChange={(e) => handleAddressChange('line2', e.target.value)}
            />
          </Box>
        ) : (
          <Typography color="textSecondary">
            {userData?.address?.line1} <br />
            {userData?.address?.line2}
          </Typography>
        )}
      </Box>

      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Basic Information
      </Typography>
      <Box display="grid" gridTemplateColumns="1fr 3fr" gap={2} mb={3}>
        <Typography fontWeight="bold">Gender:</Typography>
        {isEdit ? (
          <Select
            value={userData?.gender || ''}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            fullWidth
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
        ) : (
          <Typography>{userData?.gender}</Typography>
        )}

        <Typography fontWeight="bold">Birthday:</Typography>
        {isEdit ? (
          <TextField
            type="date"
            fullWidth
            value={userData?.dob || ''}
            onChange={(e) => handleInputChange('dob', e.target.value)}
          />
        ) : (
          <Typography>{userData?.dob}</Typography>
        )}
      </Box>

      <Button variant="contained" color="primary" onClick={handleSaveClick}>
        {isEdit ? "Save" : "Edit Profile"}
      </Button>

      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Save Changes</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to save the changes?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleConfirmSave} color="primary" autoFocus>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyProfile;
