import React, { useEffect, useState } from 'react';
import api from '../../../infrastructure/api/api';
import Swal from 'sweetalert2';
import {
  CircularProgress,
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Button,
  Grid,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

type Tutor = {
  _id: string;
  username: string;
  email: string;
  phone: string;
  image: string;
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
  const [itemsPerPage] = useState<number>(4);
  const [totalTutors, setTotalTutors] = useState<number>(0);
  const navigate = useNavigate();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
    `${tutor.username} ${tutor.email} ${tutor.phone} ${tutor.image} ${tutor.role}`
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

  if (loading)
    return (
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
    <Box p={2}>
      <Grid container spacing={2} alignItems="center" justifyContent="space-between">
        <Grid item xs={12} sm={6}>
          <Typography variant={isSmallScreen ? 'h6' : 'h5'}>Tutors</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            placeholder="Search tutors..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            onClick={handleAddTutor}
            variant="contained"
            color="primary"
            fullWidth={isSmallScreen}
          >
            Add Tutor
          </Button>
        </Grid>
      </Grid>

      <TableContainer sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {['Image','Name', 'Email', 'Phone', 'Role', 'Status'].map((header) => (
                <TableCell key={header} align="left" sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
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
                  <TableCell>
                    <img
                      src={tutor.image}
                      alt={`${tutor.username}'s avatar`}
                      style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                    />
                  </TableCell>
                  <TableCell>{tutor.username}</TableCell>
                  <TableCell>{tutor.email}</TableCell>
                  <TableCell>{tutor.phone}</TableCell>
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

      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(filteredTutorsList.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default TutorsTable;
