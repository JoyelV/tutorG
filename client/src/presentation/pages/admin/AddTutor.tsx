import React, { useState } from 'react';
import { TextField, Button, Grid, FormControlLabel, Checkbox, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import 'tailwindcss/tailwind.css';
import api from '../../../infrastructure/api/api';
import Sidebar from '../../components/admin/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormData {
    username: string;
    email: string;
    phone: string;
    password: string;
    headline: string;
    image: File | null;
    areasOfExpertise: string;
    bio: string;
    highestQualification: string;
    websiteLink: string;
    isBlocked: boolean;
    tutorRequest: string | null;
}

const AddForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        phone: '',
        password: '',
        headline: '',
        image: null,
        areasOfExpertise: '',
        bio: '',
        highestQualification: '',
        websiteLink: '',
        isBlocked: false,
        tutorRequest: null,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const validateFields = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        const nameRegex = /^[a-zA-Z]{1}[a-zA-Z0-9.', ]*$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*$/;
        const phoneRegex = /^\d{10}$/;

        if (!nameRegex.test(formData.username)) {
            newErrors.firstName = 'Username must contain only letters and spaces.';
        }

        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email address.';
        }
        if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Phone number must be exactly 10 digits.';
        }
        if (!passwordRegex.test(formData.password)) {
            newErrors.password =
                'Password must be at least 8 characters long, include at least one letter, one number, and one special character.';
        }
        if (!nameRegex.test(formData.headline)) {
            newErrors.headline = 'Headline must contain only letters and spaces.';
        }
        if (!nameRegex.test(formData.areasOfExpertise)) {
            newErrors.areasOfExpertise = 'Areas of expertise must contain only letters and spaces.';
        }
        if (!nameRegex.test(formData.bio)) {
            newErrors.bio = 'First name must contain only letters and spaces.';
        }
        if (!nameRegex.test(formData.highestQualification)) {
            newErrors.highestQualification = 'First name must contain only letters and spaces.';
        }
        if (formData.websiteLink && !urlRegex.test(formData.websiteLink)) {
            newErrors.websiteLink = "Invalid website URL.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<{ name?: string; value: unknown }>
    ) => {
        const { name, value } = e.target;
        const inputValue = name === 'isBlocked' ? (e.target as HTMLInputElement).checked : value;

        setFormData({
            ...formData,
            [name as string]: inputValue,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const validTypes = ['image/jpeg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                alert('Please upload a JPEG or PNG image.');
                return;
            }
            setFormData({
                ...formData,
                image: file,
            });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateFields()) {
            try {
                const formDataToSend = new FormData();
                formDataToSend.append('username', formData.username);
                formDataToSend.append('email', formData.email);
                formDataToSend.append('phone', formData.phone);
                formDataToSend.append('password', formData.password);
                formDataToSend.append('headline', formData.headline);
                if (formData.image) {
                    formDataToSend.append('image', formData.image);
                }
                formDataToSend.append('areasOfExpertise', formData.areasOfExpertise);
                formDataToSend.append('bio', formData.bio);
                formDataToSend.append('highestQualification', formData.highestQualification);
                formDataToSend.append('websiteLink', formData.websiteLink);
                formDataToSend.append('isBlocked', String(formData.isBlocked));
                formDataToSend.append('tutorRequest', formData.tutorRequest || '');

                // Send the data to the backend
                const response = await api.post('/admin/add-tutor', formDataToSend);

                if (response.status === 201) {
                    toast.success('Tutor added successfully!');
                    setFormData({
                        username: '',
                        email: '',
                        phone: '',
                        password: '',
                        headline: '',
                        image: null,
                        areasOfExpertise: '',
                        bio: '',
                        highestQualification: '',
                        websiteLink: '',
                        isBlocked: false,
                        tutorRequest: null,
                    });
                    setImagePreview(null);
                } else {
                    toast.error(`Failed to add tutor: ${response.data.message || 'Unknown error'}`);
                }
            } catch (error: any) {
                console.error('Error while submitting form:', error);
                const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
                toast.error(errorMessage);
            }
        } else {
            toast.error('Please fix the errors before submitting.');
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-1/4 bg-white shadow-md fixed md:static">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-2 md:ml-1/4">
                <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                    <form onSubmit={handleSubmit} className="bg-white p-1 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Add New Tutor</h2>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="User Name"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    error={!!errors.username}
                                    helperText={errors.username}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Phone"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    error={!!errors.phone}
                                    helperText={errors.phone}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Password"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    name="password"
                                    type={showPassword ? "text" : "password"} 
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            {/* Other fields */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Headline"
                                    variant="outlined"
                                    fullWidth
                                    name="headline"
                                    value={formData.headline}
                                    onChange={handleChange}
                                    error={!!errors.headline}
                                    helperText={errors.headline}
                                    className="mb-4"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <label className="block mb-2 text-gray-700">Upload Image</label>
                                <input
                                    type="file"
                                    accept="image/jpeg, image/png"
                                    onChange={handleImageChange}
                                    className="mb-4"
                                />
                                {imagePreview && (
                                    <div className="mb-4">
                                        <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-md" />
                                    </div>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Areas of Expertise"
                                    variant="outlined"
                                    fullWidth
                                    name="areasOfExpertise"
                                    value={formData.areasOfExpertise}
                                    onChange={handleChange}
                                    error={!!errors.areasOfExpertise}
                                    helperText={errors.areasOfExpertise}
                                    className="mb-4"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Bio"
                                    variant="outlined"
                                    fullWidth
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    error={!!errors.bio}
                                    helperText={errors.bio}
                                    className="mb-4"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Highest Qualification"
                                    variant="outlined"
                                    fullWidth
                                    name="highestQualification"
                                    value={formData.highestQualification}
                                    onChange={handleChange}
                                    error={!!errors.highestQualification}
                                    helperText={errors.highestQualification}
                                    className="mb-4"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Website Link"
                                    variant="outlined"
                                    fullWidth
                                    name="websiteLink"
                                    value={formData.websiteLink}
                                    onChange={handleChange}
                                    error={!!errors.websiteLink}
                                    helperText={errors.websiteLink}
                                    className="mb-4"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="isBlocked"
                                            checked={formData.isBlocked}
                                            onChange={handleChange}
                                        />
                                    }
                                    label="Is Blocked"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Add Tutor
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AddForm;
