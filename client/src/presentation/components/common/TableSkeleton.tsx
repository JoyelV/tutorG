import React from 'react';
import { Box, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ columns = 5, rows = 5 }) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            {Array.from(new Array(columns)).map((_, index) => (
              <TableCell key={`header-${index}`}>
                <Skeleton animation="wave" height={24} width="80%" />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from(new Array(rows)).map((_, rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>
              {Array.from(new Array(columns)).map((_, colIndex) => (
                <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                  {colIndex === 0 ? (
                    // Often the first column has an avatar or specific shape
                    <Box display="flex" alignItems="center" gap={2}>
                      <Skeleton animation="wave" variant="circular" width={40} height={40} />
                      <Box sx={{ width: '100%' }}>
                        <Skeleton animation="wave" height={20} width="80%" />
                        <Skeleton animation="wave" height={15} width="40%" />
                      </Box>
                    </Box>
                  ) : (
                    <Skeleton animation="wave" height={20} width={colIndex === columns - 1 ? '40%' : '80%'} />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableSkeleton;
