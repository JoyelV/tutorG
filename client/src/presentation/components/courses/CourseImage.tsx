import React, { useRef, useState } from 'react';
import { Box } from '@mui/material';
import { PlayCircleOutline, Fullscreen, FullscreenExit } from '@mui/icons-material';
import coursePreview from '../../../assets/course-preview.mp4'

const CourseImage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

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

  return (
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
      {/* Background Video */}
      <video
        ref={videoRef}
        src={'http://res.cloudinary.com/dazdngh4i/video/upload/v1732434714/hxkeqoh7gqdmaeitxjfj.mp4'} 
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          objectFit: 'cover',
        }}
        muted
        loop
      />
      
      {/* Overlay with Play/Pause Icon */}
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
        sx={{ transition: 'background 0.3s', cursor: 'pointer' }}
        onClick={handlePlayPause} 
      >
        <PlayCircleOutline sx={{ fontSize: 64, color: 'white', opacity: isPlaying ? 0 : 1 }} />
      </Box>

      {/* Full-Screen Toggle Icon */}
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
    </Box>
  );
};

export default CourseImage;
