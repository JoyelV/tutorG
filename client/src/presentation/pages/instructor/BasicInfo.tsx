import React, { useState, ChangeEvent } from "react";
import { TextField, MenuItem, Select, Button, FormControl, InputLabel, Snackbar, Alert } from "@mui/material";
import api from "../../../infrastructure/api/api"; // Assuming this is a setup to make API requests
import { SelectChangeEvent } from "@mui/material";

interface BasicInfo {
  title: string;
  subtitle: string;
  category: string;
  subCategory: string;
  language: string;
  level: string;
  duration: number;
}

interface Props {
  setTab: (tab: "basic" | "advance" | "publish") => void;
  setBasicInfo: React.Dispatch<React.SetStateAction<BasicInfo | null>>;
}

const BasicInformation: React.FC<Props> = ({ setTab, setBasicInfo }) => {
  const [formValues, setFormValues] = useState<BasicInfo>({
    title: "",
    subtitle: "",
    category: "",
    subCategory: "",
    language: "",
    level: "",
    duration: 0,
  });

  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");

  // Handle input changes for text fields and select components
  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { value: unknown }> | SelectChangeEvent<string>,
    field: string
  ) => {
    const { value } = event.target as { value: string };
    setFormValues((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await api.post("/instructor/create", formValues);
      if (response.status === 201) {
        setSnackMessage("Course created successfully! Proceeding to the next step.");
        setBasicInfo(formValues);
        setTab("advance");
      } else {
        setSnackMessage("Failed to create course.");
      }
    } catch (error) {
      setSnackMessage("An error occurred while saving the course.");
    } finally {
      setSnackOpen(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField label="Title" fullWidth value={formValues.title} onChange={(e) => handleInputChange(e, "title")} />
      <TextField label="Subtitle" fullWidth value={formValues.subtitle} onChange={(e) => handleInputChange(e, "subtitle")} />
      
      <FormControl fullWidth>
        <InputLabel>Category</InputLabel>
        <Select
          value={formValues.category}
          onChange={(e) => handleInputChange(e, "category")}
        >
          <MenuItem value="development">Development</MenuItem>
          <MenuItem value="design">Design</MenuItem>
        </Select>
      </FormControl>
      
      <FormControl fullWidth>
        <InputLabel>Sub-category</InputLabel>
        <Select
          value={formValues.subCategory}
          onChange={(e) => handleInputChange(e, "subCategory")}
        >
          <MenuItem value="web-dev">Web Development</MenuItem>
          <MenuItem value="graphic-design">Graphic Design</MenuItem>
        </Select>
      </FormControl>
      
      <TextField
        label="Duration (Days)"
        fullWidth
        value={formValues.duration}
        onChange={(e) => handleInputChange(e, "duration")}
        type="number"
      />
      
      <Button type="submit">Save & Next</Button>

      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={() => setSnackOpen(false)}>
        <Alert severity="success" onClose={() => setSnackOpen(false)}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default BasicInformation;
