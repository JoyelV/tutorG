import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import api from "../../../infrastructure/api/api";

interface Props {
  setTab: (tab: "basic" | "advance" | "publish") => void;
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
  const [description, setDescription] = useState<string>("");

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(basicInfo).forEach(([key, value]) => formData.append(key, value.toString()));
    formData.append("description", description);
    if (thumbnail) formData.append("thumbnail", thumbnail);
    if (trailer) formData.append("trailer", trailer);

    try {
      const response = await api.post("/instructor/advanced-info", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTab("publish");
    } catch (error) {
      console.error("Error saving advanced info:", error);
    }
  };

  return (
    <div>
      <div>
        <input type="file" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} />
        <Typography>Upload Thumbnail</Typography>
        <input type="file" onChange={(e) => setTrailer(e.target.files?.[0] || null)} />
        <Typography>Upload Trailer</Typography>
      </div>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Course Description"></textarea>
      <Button onClick={handleSubmit}>Save & Next</Button>
    </div>
  );
};

export default AdvanceInformation;
