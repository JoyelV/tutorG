import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import api from '../../../infrastructure/api/api';

const EditLessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [courseId, setCourseId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [existingVideoUrl, setExistingVideoUrl] = useState<string | null>(null);
  const [existingPdfUrl, setExistingPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch existing lesson data
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await api.get(`/instructor/view-lesson/${lessonId}`);
        const {
          lessonTitle,
          lessonDescription,
          lessonVideo,
          lessonPdf,
          courseId,
        } = response.data;

        setCourseId(courseId);
        setTitle(lessonTitle);
        setDescription(lessonDescription);
        setVideoUrl(lessonVideo || null);
        setPdf(lessonPdf || null);
        setExistingVideoUrl(lessonVideo || null);
        setExistingPdfUrl(lessonPdf || null);
      } catch (error) {
        Swal.fire('Error', 'Failed to fetch lesson details.', 'error');
      }
    };

    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId]);

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file){
      if (file.type === 'application/pdf') {
        setPdf(file);
      } else {
        Swal.fire('Error', 'Invalid file type. Please upload a PDF file.', 'error');
      }
    }else {
    setPdf(null);
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
    if (!pdf||pdf===null) return '';
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
      //Swal.fire('Error', `Error uploading PDFffff: ${error.response?.data?.message || error.message}`, 'error');
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

    
    const titleregex = /^[a-zA-Z0-9\s\-\:!()&,\.\[\]\/\+]+$/;
    const descriptionRegex = /^[a-zA-Z0-9\s\-\:!()&,\.\[\]\/\+]+$/;

    if (!title || !description || !lessonId) {
      Swal.fire('Validation Error', 'Title and Description are required!', 'warning');
      return;
    }

    if (!titleregex.test(title) || !descriptionRegex.test(description)) {
      Swal.fire(
        'Validation Error',
        'Title and description must contain only letters (first nine characters) and numbers!',
        'warning'
      );
      return;
    }

    setLoading(true);

    try {
      Swal.fire('Uploading', 'Uploading files, please wait...', 'info');
      const pdfUrl = pdf ? await uploadPdfToCloudinary() : existingPdfUrl;
      const videoFileUrl = videoUrl ? await submitvideoUrl() : existingVideoUrl;

      const updatedLesson = {
        lessonTitle: title.trim(),
        lessonDescription: description.trim(),
        lessonVideo: videoFileUrl,
        lessonPdf: pdfUrl,
      };

      await api.put(`/instructor/update-lesson/${lessonId}`, updatedLesson);

      Swal.fire('Success', 'Lesson updated successfully!', 'success');
      navigate(`/instructor/course-view/${courseId}`);
    } catch (error: any) {
      Swal.fire('Error', `Failed to update lesson: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/instructor/course-view/${courseId}`);
  };

  return (
    <div className="p-6">
      <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Edit Lesson</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block font-medium">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full border p-2 rounded"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block font-medium">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full border p-2 rounded"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="videoUrl" className="block font-medium">Video:</label>
            {existingVideoUrl && (
              <video src={existingVideoUrl} controls className="mb-2 w-full rounded" />
            )}
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
            {existingPdfUrl && (
              <a
                href={existingPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 underline mb-2"
              >
                View Existing PDF
              </a>
            )}
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
            {loading ? 'Updating...' : 'Update Lesson'}
          </button>
          <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white py-2 px-4 rounded"
              disabled={loading}
            >
              Cancel
            </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditLessonPage;
