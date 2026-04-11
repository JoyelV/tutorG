import React from 'react';
import { Box, Skeleton, List, ListItem, ListItemAvatar } from '@mui/material';

interface ListSkeletonProps {
  rows?: number;
}

const ListSkeleton: React.FC<ListSkeletonProps> = ({ rows = 6 }) => {
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
      {Array.from(new Array(rows)).map((_, index) => (
        <ListItem key={index} alignItems="flex-start" sx={{ borderBottom: '1px solid #f0f0f0', py: 2 }}>
          <ListItemAvatar>
            <Skeleton animation="wave" variant="circular" width={50} height={50} />
          </ListItemAvatar>
          <Box sx={{ width: '100%', ml: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Skeleton animation="wave" height={24} width="40%" />
              <Skeleton animation="wave" height={20} width="15%" />
            </Box>
            <Skeleton animation="wave" height={20} width="90%" />
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default ListSkeleton;
