import React, { useState } from "react";
import { Typography, Button } from "@mui/material";
import api from "../../../infrastructure/api/api";

interface Props {
  setTab: (tab: string) => void;
  basicInfo: {
    title: string;
    subtitle: string;
    category: string;
    subCategory: string;
    language: string;
    level: string;
    duration: number;
  };
}

const AdvanceInformation: React.FC<Props> = ({ setTab, basicInfo }) => {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [trailer, setTrailer] = useState<File | null>(null);
  const [description, setDescription] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", basicInfo.title);
      formData.append("subtitle", basicInfo.subtitle);
      formData.append("category", basicInfo.category);
      formData.append("subCategory", basicInfo.subCategory);
      formData.append("language", basicInfo.language);
      formData.append("level", basicInfo.level);
      formData.append("duration", basicInfo.duration.toString());
      formData.append("description", description);

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      if (trailer) {
        formData.append("trailer", trailer);
      }

      // Send data to the backend
      const response = await api.post("/instructor/courses/advanced-info", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Course saved successfully:", response.data);
      setTab("publish");
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center border p-4 rounded-lg">
          <input type="file" onChange={(e) => handleFileChange(e, setThumbnail)} />
          <Typography variant="caption" className="mt-2 text-center">
            Upload your course thumbnail here.
          </Typography>
        </div>
        <div className="flex flex-col items-center border p-4 rounded-lg">
          <input type="file" onChange={(e) => handleFileChange(e, setTrailer)} />
          <Typography variant="caption" className="mt-2 text-center">
            Upload your course trailer here.
          </Typography>
        </div>
      </div>
      <textarea
        className="w-full border rounded-lg p-4 h-32 resize-none mt-6"
        placeholder="Enter course description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <div className="flex justify-between mt-6">
        <Button variant="outlined" onClick={() => setTab("basic")}>
          Previous
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save & Next
        </Button>
      </div>
    </div>
  );
};

export default AdvanceInformation;
