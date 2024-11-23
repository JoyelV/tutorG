import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Input,
  Typography,
} from "@mui/material";

interface MaterialDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMaterial: (material: any) => void;
}

const MaterialDialog: React.FC<MaterialDialogProps> = ({
  isOpen,
  onClose,
  onAddMaterial,
}) => {
  const [newMaterial, setNewMaterial] = useState<any>({
    name: "",
    description: "",
    video: "",
    file: null,
    captions: "",
    lectureNotes: "",
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setNewMaterial((prev: any) => ({
        ...prev,
        file: event.target.files![0],
      }));
    }
  };

  const handleAddMaterial = () => {
    onAddMaterial(newMaterial);
    setNewMaterial({
      name: "",
      description: "",
      video: "",
      file: null,
      captions: "",
      lectureNotes: "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        Add Material
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
          <TextField
            label="Material Name"
            variant="outlined"
            fullWidth
            value={newMaterial.name}
            onChange={(e) =>
              setNewMaterial({ ...newMaterial, name: e.target.value })
            }
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={newMaterial.description}
            onChange={(e) =>
              setNewMaterial({ ...newMaterial, description: e.target.value })
            }
          />
          <TextField
            label="Video URL"
            variant="outlined"
            fullWidth
            value={newMaterial.video}
            onChange={(e) =>
              setNewMaterial((prev: any) => ({
                ...prev,
                video: e.target.value,
              }))
            }
          />
          <Box>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Attach File
            </Typography>
            <Input
              type="file"
              fullWidth
              onChange={handleFileUpload}
              inputProps={{ accept: ".pdf,.doc,.docx,.ppt,.pptx" }}
            />
          </Box>
          <TextField
            label="Captions"
            variant="outlined"
            fullWidth
            value={newMaterial.captions}
            onChange={(e) =>
              setNewMaterial((prev: any) => ({
                ...prev,
                captions: e.target.value,
              }))
            }
          />
          <TextField
            label="Lecture Notes"
            variant="outlined"
            fullWidth
            value={newMaterial.lectureNotes}
            onChange={(e) =>
              setNewMaterial((prev: any) => ({
                ...prev,
                lectureNotes: e.target.value,
              }))
            }
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 3, py: 2 }}>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleAddMaterial} color="primary" variant="contained">
          Add Material
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MaterialDialog;
