import React, { useRef, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { PlayCircleOutline, Fullscreen, FullscreenExit } from '@mui/icons-material';
import api from '../../../infrastructure/api/api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

type CourseImageProps = {
  courseId: string | undefined;  
};

const CourseImage = ({ courseId }: CourseImageProps) => {
  const [videourl, setVideourl] = useState('http://res.cloudinary.com/dazdngh4i/video/upload/v1732434714/hxkeqoh7gqdmaeitxjfj.mp4');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoTime, setVideoTime] = useState('00:00 / 00:00');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!courseId) {
          showError('Invalid course ID.');
          return;
        }
        const response = await api.get(`/user/courses/${courseId}`);
        if (response.status === 200) {
          const data = response.data;
          setVideourl(data.trailer);
        } else {
          showError('Unauthorized request.');
        }
      } catch (err) {
        showError('Unauthorized request..');
      }
    };

    fetchCourses();
  }, [courseId]);

  const showError = (message: string) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      showCancelButton: false,
      confirmButtonText: 'Go to Listing page',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/course-listing');
      }
    });
  };

  // Format time in MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  // Update the progress and video time
  const updateProgress = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setProgress((currentTime / duration) * 100);
      setVideoTime(`${formatTime(currentTime)} / ${formatTime(duration)}`);
    }
  };

  // Handle play/pause functionality
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    if (containerRef.current) {
      if (isFullScreen) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
      setIsFullScreen(!isFullScreen);
    }
  };

  // Update progress every time the video time changes (timeupdate event)
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('timeupdate', updateProgress);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('timeupdate', updateProgress);
      }
    };
  }, []);

  // Handle manual progress bar update (change event on range input)
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setProgress(value);

    if (videoRef.current) {
      const duration = videoRef.current.duration;
      videoRef.current.currentTime = (value / 100) * duration;
    }
  };

  return (
    <>
      <Box
        ref={containerRef}
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          width: '100%',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          position: 'relative',
        }}
      >
        <video
          ref={videoRef}
          src={videourl}
          style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
          muted
          preload="metadata"
        />

        {/* Play/Pause and Fullscreen Icons */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgcolor="rgba(0, 0, 0, 0.4)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={handlePlayPause}
        >
          <PlayCircleOutline sx={{ fontSize: 64, color: 'white', opacity: isPlaying ? 0 : 1 }} />
        </Box>
        <Box
          position="absolute"
          top={16}
          right={16}
          sx={{ cursor: 'pointer', zIndex: 10 }}
          onClick={toggleFullScreen}
        >
          {isFullScreen ? (
            <FullscreenExit sx={{ fontSize: 36, color: 'white' }} />
          ) : (
            <Fullscreen sx={{ fontSize: 36, color: 'white' }} />
          )}
        </Box>

        {/* Progress Bar */}
        <Box position="absolute" bottom={16} left={16} right={16} display="flex" flexDirection="column" alignItems="center">
          <input
            type="range"
            value={progress}
            onChange={handleProgressChange}
            max={100}
            style={{
              width: '100%',
              height: '8px',
              background: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '4px',
            }}
          />
          <Box sx={{ color: 'white', mt: 1 }}>{videoTime}</Box>
        </Box>
      </Box>
    </>
  );
};

export default CourseImage;
