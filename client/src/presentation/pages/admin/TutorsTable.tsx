import React, { useEffect, useState } from 'react';
import api from '../../../infrastructure/api/api';
import Swal from 'sweetalert2';
import { CircularProgress, Box, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type Tutor = {
  _id: string;
  username: string;
  email: string;
  phone: string;
  gender: string;
  role: string;
  isBlocked: boolean;
};

const TutorsTable: React.FC = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [totalTutors, setTotalTutors] = useState<number>(0);
  const navigate = useNavigate();
  useEffect(() => {
    api
      .get('/admin/instructors')
      .then((response) => {
        setTutors(response.data);
        setFilteredTutors(response.data);
        setTotalTutors(response.data.length);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load tutors');
        setLoading(false);
      });
  }, []);

  const filteredTutorsList = tutors.filter((tutor) =>
    `${tutor.username} ${tutor.email} ${tutor.phone} ${tutor.gender} ${tutor.role}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage);
  };

  const toggleBlockStatus = async (tutorId: string) => {
    try {
      const result = await Swal.fire({
        title: 'Block/Unblock Tutor?',
        text: 'Are you sure you want to block/unblock this tutor?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Proceed!',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        const tutorToToggle = tutors.find((tutor) => tutor._id === tutorId);
        if (!tutorToToggle) {
          setError('Tutor not found');
          return;
        }

        const updatedStatus = !tutorToToggle.isBlocked;
        const response = await api.patch(`/admin/instructors/${tutorId}`, { isBlocked: updatedStatus });

        setTutors((prevTutors) =>
          prevTutors.map((tutor) => (tutor._id === tutorId ? response.data : tutor))
        );
      }
    } catch (err) {
      console.error('Error updating block status:', err);
      setError('Failed to update block status');
    }
  };

  if (loading) return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f9f9f9">
      <CircularProgress color="primary" size={50} />
      <Typography variant="h6" color="textSecondary" mt={2}>
        Loading, please wait...
      </Typography>
    </Box>
  );
  if (error) return <div>{error}</div>;

  const handleAddTutor = () => {
    navigate('/admin/add-tutor');
  };

  return (
    <div className="flex flex-col p-6">
      <div className="mb-4 flex justify-between items-center">
        <Typography variant="h6">Tutor Management</Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search tutors..."
          value={searchTerm}
          onChange={handleSearch}
        />
         <button
        onClick={handleAddTutor}
        className="bg-blue-500 hover:bg-blue-700 text-white rounded"
        style={{ padding: '0.5rem 1rem' }}
      >
        Add Tutor
      </button>
      </div>
     
      <TableContainer className="mb-4">
        <Table>
          <TableHead>
            <TableRow>
              {['Name', 'Email Id', 'Phone', 'Gender', 'Role', 'Status'].map((header) => (
                <TableCell key={header} align="left" sx={{ fontWeight: 'bold' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTutorsList
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((tutor) => (
                <TableRow key={tutor._id}>
                  <TableCell>{tutor.username}</TableCell>
                  <TableCell>{tutor.email}</TableCell>
                  <TableCell>{tutor.phone}</TableCell>
                  <TableCell>{tutor.gender}</TableCell>
                  <TableCell>{tutor.role}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => toggleBlockStatus(tutor._id)}
                      variant="contained"
                      color={tutor.isBlocked ? 'error' : 'success'}
                    >
                      {tutor.isBlocked ? 'Blocked!!' : 'Unblocked'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(filteredTutorsList.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
      />
    </div>
  );
};

export default TutorsTable;
