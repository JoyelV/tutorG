import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import api from '../../../infrastructure/api/api';

const AddLessonPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const validateInput = (input: string): boolean => {
    const regex =/^[a-zA-Z0-9\s\-:!()&,.]+$/;

    return regex.test(input) && input.trim() !== '';
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdf(file);
    } else {
      Swal.fire('Error', 'Invalid file type. Please upload a PDF file.', 'error');
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ['video/mp4'].includes(file.type)) {
      setVideoUrl(file);
    } else {
      Swal.fire('Error', 'Please select a video file (MP4 format).', 'error');
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
      Swal.fire('Error', `Error uploading PDF: ${error.response?.data?.message || error.message}`, 'error');
      return '';
    }
  };

  const submitvideoUrl = async () => {
    if (!videoUrl) return '';
    const formData = new FormData();
    formData.append('file', videoUrl);
    formData.append('upload_preset', 'videos_preset');
    formData.append('cloud_name', 'dazdngh4i');

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dazdngh4i/video/upload',
        formData
      );
      return res.data.url;
    } catch (error) {
      Swal.fire('Error', 'Error uploading video.', 'error');
      return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !videoUrl || !courseId) {
      Swal.fire('Validation Error', 'All fields are required!', 'warning');
      return;
    }

    if (!validateInput(title)) {
      Swal.fire(
        'Validation Error',
        'Title contains invalid characters. Only letters, numbers, and spaces are allowed.',
        'warning'
      );
      return;
    }

    if (!validateInput(description)) {
      Swal.fire(
        'Validation Error',
        'Description contains invalid characters. Only letters, numbers, and spaces are allowed.',
        'warning'
      );
      return;
    }

    setLoading(true);

    try {
      Swal.fire('Uploading', 'Uploading files, please wait...', 'info');
      const pdfUrl = await uploadPdfToCloudinary();
      const videoFileUrl = await submitvideoUrl();

      const newLesson = {
        lessonTitle: title,
        lessonDescription: description,
        lessonVideo: videoFileUrl,
        lessonPdf: pdfUrl,
        courseId,
      };

      await api.post('/instructor/addLesson', newLesson);

      Swal.fire('Success', 'Lesson added successfully!', 'success');
      navigate('/instructor/my-courses');
    } catch (error: any) {
      Swal.fire('Error', `Failed to add lesson: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate(`/instructor/course-view/${courseId}`);
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
              onChange={(e) => setTitle(e.target.value.trimStart())}
              onBlur={(e) => setTitle(e.target.value.trim())}
              className="block w-full border p-2 rounded"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block font-medium">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value.trimStart())}
              onBlur={(e) => setDescription(e.target.value.trim())}
              className="block w-full border p-2 rounded"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="videoUrl" className="block font-medium">Video URL:</label>
            <input
              type="file"
              accept="video/mp4"
              onChange={handleVideoUpload}
              className="w-full p-3 border border-gray-300 rounded-lg"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="pdf" className="block font-medium">PDF:</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              className="block w-full border p-2 rounded"
              disabled={loading}
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className={`bg-blue-500 text-white py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Add Lesson'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddLessonPage;
