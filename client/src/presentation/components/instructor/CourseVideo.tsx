import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import api from '../../../infrastructure/api/api';

type CourseVideoProps = {
  id: string | undefined;  
};

const CourseVideo = ({ id }: CourseVideoProps) => {
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
        console.log(response.data, "video data in instructor");
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
  }, [id]);

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

  return (
    <Box>
      <div className="mb-4">
        {existingVideoUrl ? (
          <video src={existingVideoUrl} controls className="mb-2 w-full rounded" />
        ) : (
          <div className="mb-2 text-gray-500">No video available</div>
        )}
      </div>
    </Box>
  );
};

export default CourseVideo;
