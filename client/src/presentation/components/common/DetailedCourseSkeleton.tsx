import React from 'react';
import { Box, Skeleton, Grid, Paper } from '@mui/material';

const DetailedCourseSkeleton: React.FC = () => {
  return (
    <Box className="flex flex-col w-full min-h-screen p-4">
      <div className="flex flex-col md:flex-row w-full flex-grow bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Main Content Area (Left/Top) */}
        <div className="md:w-2/3 w-full p-6">
          {/* Course Header Skeleton */}
          <Box mb={2}>
            <Skeleton variant="text" sx={{ fontSize: '2rem', width: '80%', mb: 1 }} />
            <Skeleton variant="text" sx={{ fontSize: '1.25rem', width: '60%', mb: 2 }} />
            <Box display="flex" alignItems="center" gap={2}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width={150} />
            </Box>
          </Box>

          {/* Course Image Skeleton */}
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2, mb: 4 }} />

          {/* Section Tabs Skeleton */}
          <Box display="flex" gap={2} mb={4} borderBottom="1px solid #e0e0e0" pb={1}>
            <Skeleton variant="text" width={100} height={40} />
            <Skeleton variant="text" width={120} height={40} />
            <Skeleton variant="text" width={100} height={40} />
            <Skeleton variant="text" width={90} height={40} />
          </Box>

          {/* Content Area Skeleton */}
          <Box>
            <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '40%', mb: 2 }} />
            <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2, mb: 2 }} />
            <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
          </Box>
        </div>

        {/* Sidebar Area (Right/Bottom) */}
        <div className="md:w-1/3 w-full p-6 border-l border-gray-100">
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #eee', borderRadius: 2 }}>
            <Skeleton variant="text" sx={{ fontSize: '2.5rem', width: '50%', mb: 3 }} />
            <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 1, mb: 3 }} />
            
            <Box display="flex" flexDirection="column" gap={2}>
              {[1, 2, 3, 4, 5].map((item) => (
                <Box key={item} display="flex" justifyContent="space-between" borderBottom="1px solid #f0f0f0" pb={1}>
                  <Skeleton variant="text" width={100} />
                  <Skeleton variant="text" width={80} />
                </Box>
              ))}
            </Box>
          </Paper>
        </div>
      </div>
    </Box>
  );
};

export default DetailedCourseSkeleton;
