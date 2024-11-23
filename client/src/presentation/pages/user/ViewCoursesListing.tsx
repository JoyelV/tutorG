import React, { useState } from 'react';
import TopActionBar from '../../components/common/TopActionBar';
import { Pagination } from '@mui/material';
import ImageCard from '../../components/common/ImageCard';
import Navbar from '../../components/common/Navbar';

interface ViewCoursesListingProps {}

const ViewCoursesListing: React.FC<ViewCoursesListingProps> = () => {
  const [currentPage, setCurrentPage] = useState<number>(2);
  const totalPages: number = 5;

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
    <Navbar />
    <TopActionBar />

    <div className="min-h-screen flex flex-col items-center justify-center">
      <ImageCard />
      
      {/* Container to center pagination */}
      <div className="flex justify-center mt-6 w-full">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
        />
      </div>
      <br></br>
    </div>
    </>
  );
};

export default ViewCoursesListing;
