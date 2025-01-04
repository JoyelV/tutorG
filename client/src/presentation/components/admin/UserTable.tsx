import React, { useEffect, useState } from 'react';
import api from '../../../infrastructure/api/api';
import Swal from 'sweetalert2';
import { CircularProgress, Box, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Button } from '@mui/material';

type User = {
  _id: string;
  username: string;
  email: string;
  phone: string;
  gender: string;
  role: string;
  isBlocked: boolean;
};

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    api
      .get('/admin/users')
      .then((response) => {
        setUsers(response.data);
        setTotalUsers(response.data.length);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load users');
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter((user) =>
    `${user.username} ${user.email} ${user.phone} ${user.gender} ${user.role}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage);
  };

  const toggleBlockStatus = async (userId: string) => {
    try {
      const result = await Swal.fire({
        title: 'Block/Unblock User?',
        text: 'Are you sure you want to block/unblock this user?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Proceed!',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        const userToToggle = users.find((user) => user._id === userId);
        if (!userToToggle) {
          setError('User not found');
          return;
        }

        const updatedStatus = !userToToggle.isBlocked;
        const response = await api.patch(`/admin/users/${userId}`, { isBlocked: updatedStatus });

        setUsers((prevUsers) =>
          prevUsers.map((user) => (user._id === userId ? response.data : user))
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

  return (
    <div className="flex flex-col p-6">
      <div className="mb-4 flex justify-between items-center">
        <Typography variant="h6">User Management</Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearch}
        />
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
            {filteredUsers
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => toggleBlockStatus(user._id)}
                      variant="contained"
                      color={user.isBlocked ? 'success' : 'error'}
                    >
                      {user.isBlocked ? 'Unblock' : 'Block-?'}
                    </Button>
                  </TableCell>
                  <TableCell>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(filteredUsers.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
      />
    </div>
  );
};

export default UserTable;
