import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import api from '../../../infrastructure/api/api';

type CourseVideoProps = {
  videoUrl?: string; 
  id?: string;     
  lesson:string;  
};

const CourseVideo = ({ videoUrl, id,lesson }: CourseVideoProps) => {
  const [existingVideoUrl, setExistingVideoUrl] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      if (videoUrl) return; 
      
      try {
        if (!id) {
          showError('Invalid course ID.');
          return;
        }
        const response = await api.get(`/instructor/course-view/${id}`);
        console.log(response.data, 'Video data in instructor');
        if (response.status === 200) {
          const data = response.data;
          setExistingVideoUrl(data.trailer || '');
        } else {
          showError('Unauthorized request.');
        }
      } catch (err) {
        showError('Unauthorized request.');
      }
    };

    fetchCourses();
  }, [id, videoUrl]);

  const showError = (message: string) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      showCancelButton: false,
      confirmButtonText: 'Go to Listing page',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/user-profile');
      }
    });
  };

  const videoSource = videoUrl || existingVideoUrl;

  const updateProgress = async () => {
    try {
      const response = await api.put(`/user/progress/${id}`, {
        completedLesson: lesson, 
      });
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Progress Updated',
          text: 'Your course progress has been updated!',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Update Progress',
        text: 'Could not update progress at this moment.',
      });
    }
  };

  return (
    <Box>
      <div className="mb-4">
        {videoSource ? (
          <video
            src={videoSource}
            controls
            className="mb-2 w-full rounded"
            onEnded={updateProgress} 
          />
        ) : (
          <div className="mb-2 text-gray-500">No video available</div>
        )}
      </div>
    </Box>
  );
};

export default CourseVideo;
