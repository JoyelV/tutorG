import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
} from "@mui/material";
import api from "../../../infrastructure/api/api";
import Sidebar from "../../components/admin/Sidebar";
import { useNavigate } from "react-router-dom";

const AddQALeadForm: React.FC = () => {
  const [formData, setFormData] = useState({
    qaname: "",
    email_id: "",
    phone_number: "",
    password: "",
    qualification: "",
    experience: "",
    date_of_join: "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        alert("Please upload a JPEG or PNG image.");
        return;
      }
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("qaname", formData.qaname);
    formDataToSend.append("email_id", formData.email_id);
    formDataToSend.append("phone_number", formData.phone_number);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("qualification", formData.qualification);
    formDataToSend.append("experience", formData.experience);
    formDataToSend.append("date_of_join", formData.date_of_join);
    formDataToSend.append("role", "Lead");
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await api.post("/admin/add-qaHead", formDataToSend);
      if(response.status===201){
         navigate('/admin/qa');
      }else{
        alert("Error adding QA Lead.");
      }
    } catch (error) {
      alert("Error adding QA Lead.");
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      <div className="fixed inset-y-0 left-0 w-64">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col ml-64">
        <div className="container mx-auto p-8">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4">Add QA Lead</h2>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="QA Name"
                  variant="outlined"
                  fullWidth
                  required
                  name="qaname"
                  value={formData.qaname}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  required
                  name="email_id"
                  value={formData.email_id}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  required
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Qualification"
                  variant="outlined"
                  fullWidth
                  required
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Experience (in years)"
                  variant="outlined"
                  fullWidth
                  required
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="date"
                  label="Date of Joining"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                  name="date_of_join"
                  value={formData.date_of_join}
                  onChange={handleChange}
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
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Add QA Lead
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddQALeadForm;
