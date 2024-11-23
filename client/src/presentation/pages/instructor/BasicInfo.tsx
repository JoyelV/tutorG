import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Select,
  Button,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import api from "../../../infrastructure/api/api";

// Define the interface for BasicInfo state
interface BasicInfoState {
    title: string;
    subtitle: string;
    category: string;
    subCategory: string;
    language: string;
    level: string;
    duration: number;
  }
  
  // Update the Props interface
  interface Props {
    setTab: (tab: string) => void;
    setBasicInfo: React.Dispatch<React.SetStateAction<BasicInfoState | null>>;
  }
  
  const BasicInformation: React.FC<Props> = ({ setTab, setBasicInfo }) => {
    const [title, setTitle] = useState<string>("");
    const [subtitle, setSubtitle] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [subCategory, setSubCategory] = useState<string>("");
    const [language, setLanguage] = useState<string>("");
    const [level, setLevel] = useState<string>("");
    const [duration, setDuration] = useState<number | string>("");
  
    const [snackOpen, setSnackOpen] = useState<boolean>(false);
    const [snackMessage, setSnackMessage] = useState<string>("");
  
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
      
        const courseData: BasicInfoState = {
          title,
          subtitle,
          category,
          subCategory,
          language,
          level,
          duration: Number(duration), 
        };
      
        try {
          const response = await api.post('/instructor/courses/create', courseData);
      
          if (response.status === 201) {
            setSnackMessage("Course created successfully! Proceeding to the next step.");
            setBasicInfo(courseData); // Update the parent component's state
            setTab("advance");
          } else if (response.status === 400) {
            setSnackMessage(response.data.message || "Validation failed. Please check all fields.");
          } else {
            setSnackMessage("Unexpected response from the server. Please try again.");
          }
        } catch (error: any) {
          if (error.response) {
            // Handle known server errors
            setSnackMessage(
              error.response.data.message || "An error occurred while saving the course."
            );
          } else {
            // Handle network or unknown errors
            setSnackMessage("Network error: Unable to reach the server. Please try again.");
          }
        } finally {
          setSnackOpen(true);
        }
      };
      
  
    return (
      <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
        {/* Form fields */}
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Subtitle"
          variant="outlined"
          fullWidth
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-6">
          <FormControl fullWidth>
            <InputLabel>Course Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              defaultValue=""
            >
              <MenuItem value="development">Development</MenuItem>
              <MenuItem value="design">Design</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Course Sub-category</InputLabel>
            <Select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              defaultValue=""
            >
              <MenuItem value="web-dev">Web Development</MenuItem>
              <MenuItem value="graphic-design">Graphic Design</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <FormControl fullWidth>
            <InputLabel>Course Language</InputLabel>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              defaultValue=""
            >
              <MenuItem value="english">English</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Course Level</InputLabel>
            <Select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              defaultValue=""
            >
              <MenuItem value="beginner">Beginner</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Duration (Days)"
            variant="outlined"
            fullWidth
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button variant="contained" color="warning" type="submit">
            Save & Next
          </Button>
        </div>
  
        {/* Snackbar */}
        <Snackbar
          open={snackOpen}
          autoHideDuration={6000}
          onClose={() => setSnackOpen(false)}
        >
          <Alert
            onClose={() => setSnackOpen(false)}
            severity={snackMessage.includes("successfully") ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {snackMessage}
          </Alert>
        </Snackbar>
      </form>
    );
  };
  
  export default BasicInformation;
  