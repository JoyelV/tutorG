import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import api from '../../../infrastructure/api/api';

type CourseVideoProps = {
  videoUrl?: string; 
  id: string | undefined;  
};

const CourseVideo = ({ videoUrl, id }: CourseVideoProps) => {
  const [existingVideoUrl, setExistingVideoUrl] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!id) {
          showError('Invalid course ID.');
          return;
        }
        const response = await api.get(`/instructor/course-view/${id}`);
        
        if (response.status === 200) {
          const data = response.data;
          setExistingVideoUrl(data.trailer);
        } else {
          showError('Unauthorized request.');
        }
      } catch (err) {
        showError('Unauthorized request..');
      }
    };

    fetchCourses();
  }, [id,videoUrl]);

  const showError = (message: string) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      showCancelButton: false,
      confirmButtonText: 'Go to Listing page',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/instructor/my-courses');
      }
    });
  };
  const videoSource = videoUrl || existingVideoUrl; 

  return (
    <Box>
      <div className="mb-4">
        {videoSource ? (
          <video src={videoSource} controls className="mb-2 w-full rounded" autoPlay />
        ) : (
          <div className="mb-2 text-gray-500">No video available</div>
        )}
      </div>
    </Box>
  );
};

export default CourseVideo;
