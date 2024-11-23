import React, { useEffect, useState } from 'react';
import api from '../../../infrastructure/api/api';

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
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredUsers = users.filter((user) =>
    `${user.username} ${user.email} ${user.phone} ${user.gender} ${user.role}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredUsers.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    api
      .get('/admin/users')
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load users');
        setLoading(false);
      });
  }, []);

  const toggleBlockStatus = async (userId: string) => {
    try {
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
    } catch (err) {
      console.error('Error updating block status:', err);
      setError('Failed to update block status');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full max-w-sm"
        />
      </div>
      <table className="min-w-full bg-blue-200 rounded-lg">
        <thead>
          <tr>
            {['Name', 'Email Id', 'Phone', 'Gender', 'Role', 'Status'].map((header) => (
              <th key={header} className="p-4 border-b border-blue-300 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((user) => (
            <tr key={user._id} className="bg-blue-100 even:bg-blue-200">
              <td className="p-4 border-b border-blue-300">{user.username}</td>
              <td className="p-4 border-b border-blue-300">{user.email}</td>
              <td className="p-4 border-b border-blue-300">{user.phone}</td>
              <td className="p-4 border-b border-blue-300">{user.gender}</td>
              <td className="p-4 border-b border-blue-300">{user.role}</td>
              <td className="p-4 border-b border-blue-300">
                <button
                  onClick={() => toggleBlockStatus(user._id)}
                  className={`px-4 py-2 rounded ${user.isBlocked ? 'bg-green-500' : 'bg-red-500'} text-white`}
                >
                  {user.isBlocked ? 'Unblock' : 'Block'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          className="p-2 border rounded"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        >
          &lt;
        </button>
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`p-2 border rounded ${currentPage === page ? 'bg-blue-500 text-white' : ''}`}
          >
            {page}
          </button>
        ))}
        <button
          className="p-2 border rounded"
          onClick={() => setCurrentPage(Math.min(pageNumbers.length, currentPage + 1))}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default UserTable;
