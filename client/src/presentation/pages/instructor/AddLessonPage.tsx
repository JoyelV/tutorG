import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import api from '../../../infrastructure/api/api';
import { toast } from 'react-toastify';

const AddLessonPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [videoUrl, setVideoUrl] =  useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const navigate = useNavigate();

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdf(file);
    } else {
      toast.error('Invalid file type. Please upload a PDF file.');
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ["video/mp4"].includes(file.type)) {
        setVideoUrl(file);
    } else {
      toast.error("Please select a trailer Video file (MP4).");
    }
  };

  const uploadPdfToCloudinary = async () => {
    if (!pdf) return '';
    const formData = new FormData();
    formData.append('file', pdf);
    formData.append('upload_preset', 'pdf_preset');
    formData.append('cloud_name', 'dazdngh4i');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dazdngh4i/raw/upload',
        formData
      );
      return response.data.url;
    } catch (error: any) {
      toast.error(`Error uploading PDF: ${error.response?.data?.message || error.message}`);
      return '';
    }
  };

  const submitvideoUrl = async () => {
    if (!videoUrl) return "";
    const formData = new FormData();
    formData.append("file", videoUrl);
    formData.append("upload_preset", "videos_preset");
    formData.append("cloud_name", "dazdngh4i");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dazdngh4i/video/upload",
        formData
      );
      return res.data.url;
    } catch (error) {
      console.error("Error uploading trailer:", error);
      toast.error("Error uploading trailer");
      return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !videoUrl || !courseId) {
      toast.error('All fields are required!');
      return;
    }

    try {
      toast.info('Uploading PDF...');
      const pdfUrl = await uploadPdfToCloudinary();
      const videoUrl = await submitvideoUrl();

      const newLesson = {
        lessonTitle: title,
        lessonDescription: description,
        lessonVideo: videoUrl,
        lessonPdf: pdfUrl, 
        courseId,
      };

      const response = await api.post('/instructor/addLesson', newLesson);
      toast.success('Lesson added successfully!');
      navigate('/instructor/my-courses');
    } catch (error: any) {
      toast.error(`Failed to add lesson: ${error.message}`);
      console.error('Error adding lesson:', error);
    }
  };

  return (
    <div className="p-6">
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Add New Lesson</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block font-medium">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full border p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block font-medium">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full border p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="videoUrl" className="block font-medium">Video URL:</label>
        {/* Trailer Upload */}
        <div className="mb-4">
          <input
            type="file"
            accept="video/mp4"
            onChange={handleVideoUpload}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        </div>
        <div className="mb-4">
          <label htmlFor="pdf" className="block font-medium">PDF:</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfChange}
            className="block w-full border p-2 rounded"
          />
        </div>
        <div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
            Add Lesson
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default AddLessonPage;
