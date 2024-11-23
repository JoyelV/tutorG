import React, { useState } from 'react';
import { TextField, Button, Grid, FormControlLabel, Checkbox } from '@mui/material';
import 'tailwindcss/tailwind.css'; 
import Sidebar from '../../components/admin/Sidebar';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    headline: string;
    image: string;
    areasOfExpertise: string;
    bio: string;
    highestQualification: string;
    websiteLink: string;
    linkedInLink: string;
    youtubeLink: string;
    facebookLink: string;
    isBlocked: boolean;
    tutorRequest: string | null;
}

const AddForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        headline: '',
        image: '',
        areasOfExpertise: '',
        bio: '',
        highestQualification: '',
        websiteLink: '',
        linkedInLink: '',
        youtubeLink: '',
        facebookLink: '',
        isBlocked: false,
        tutorRequest: null,
    });

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col ml-64">
                <div className="container mx-auto p-8">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Add New Tutor</h2>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="First Name"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="mb-4"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Last Name"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="mb-4"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mb-4"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Phone"
                                    variant="outlined"
                                    fullWidth
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="mb-4"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Password"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="mb-4"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Headline"
                                    variant="outlined"
                                    fullWidth
                                    name="headline"
                                    value={formData.headline}
                                    onChange={handleChange}
                                    className="mb-4"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Image URL"
                                    variant="outlined"
                                    fullWidth
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="mb-4"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Areas of Expertise"
                                    variant="outlined"
                                    fullWidth
                                    name="areasOfExpertise"
                                    value={formData.areasOfExpertise}
                                    onChange={handleChange}
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
                                    className="mb-4"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="LinkedIn Link"
                                    variant="outlined"
                                    fullWidth
                                    name="linkedInLink"
                                    value={formData.linkedInLink}
                                    onChange={handleChange}
                                    className="mb-4"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="YouTube Link"
                                    variant="outlined"
                                    fullWidth
                                    name="youtubeLink"
                                    value={formData.youtubeLink}
                                    onChange={handleChange}
                                    className="mb-4"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Facebook Link"
                                    variant="outlined"
                                    fullWidth
                                    name="facebookLink"
                                    value={formData.facebookLink}
                                    onChange={handleChange}
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
        </div>
    );
};

export default AddForm;
