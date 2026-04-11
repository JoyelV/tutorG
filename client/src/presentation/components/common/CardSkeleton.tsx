import React from 'react';
import { Card, CardContent, Skeleton, Box } from '@mui/material';

interface CardSkeletonProps {
  height?: number | string;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({ height = 300 }) => {
  return (
    <Card sx={{ height, display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      {/* Image Thumbnail Skeleton */}
      <Skeleton sx={{ height: 160 }} animation="wave" variant="rectangular" />
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1, pt: 2 }}>
        {/* Title */}
        <Skeleton animation="wave" height={28} width="90%" style={{ marginBottom: 6 }} />
        
        {/* Subtitle / Instructor name */}
        <Skeleton animation="wave" height={20} width="60%" />
        
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Rating and Price Row */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Skeleton animation="wave" height={24} width="30%" />
          <Skeleton animation="wave" height={28} width="20%" />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardSkeleton;
