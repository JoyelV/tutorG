import React, { useState } from "react";
import { TextField, Button, IconButton, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";

const CurriculumPublish: React.FC = () => {
  const [curriculum, setCurriculum] = useState<any[]>([]);
  const [newChapterName, setNewChapterName] = useState<string>("");

  const handleAddChapter = () => {
    if (newChapterName.trim() === "") return;
    setCurriculum([...curriculum, { chapterName: newChapterName, materials: [] }]);
    setNewChapterName("");
  };

  return (
    <div>
      <TextField
        label="Add Chapter"
        variant="outlined"
        value={newChapterName}
        onChange={(e) => setNewChapterName(e.target.value)}
        fullWidth
      />
      <Button variant="contained" onClick={handleAddChapter}>
        Add Chapter
      </Button>
      {curriculum.map((chapter, index) => (
        <div key={index} className="mt-4 border rounded-lg p-4">
          <div className="flex justify-between items-center">
            <Typography>{chapter.chapterName}</Typography>
            <IconButton onClick={() => setCurriculum(curriculum.filter((_, i) => i !== index))}>
              <Delete />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CurriculumPublish;
