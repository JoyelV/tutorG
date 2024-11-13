import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type User = {
  id: string;
  username: string;
  email: string;
  phone: string;
  gender: number;
  role: string;
  blocked: boolean; // Track block/unblock status
};

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/admin/users')
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load users');
        setLoading(false);
      });
  }, []);

  const toggleBlockStatus = (userId: string) => {
    // Toggle the block status locally first
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, blocked: !user.blocked } : user
    );
    setUsers(updatedUsers);
  
    // Optionally send the update to the backend
    axios
      .patch(`http://localhost:5000/api/admin/users/${userId}/block`, {
        blocked: updatedUsers.find((user) => user.id === userId)?.blocked,
      })
      .then((response) => {
        // If update successful, you may want to update the user in the UI with the response
        const updatedUser = response.data;
        const newUsers = users.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );
        setUsers(newUsers);
      })
      .catch(() => {
        setError('Failed to update block status');
      });
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-blue-200 rounded-lg">
        <thead>
          <tr>
            {['Name', 'Email Id', 'Phone', 'Gender', 'Role', 'Action'].map((header) => (
              <th key={header} className="p-4 border-b border-blue-300 text-left">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="bg-blue-100 even:bg-blue-200">
              <td className="p-4 border-b border-blue-300">{user.username}</td>
              <td className="p-4 border-b border-blue-300">{user.email}</td>
              <td className="p-4 border-b border-blue-300">{user.phone}</td>
              <td className="p-4 border-b border-blue-300">{user.gender}</td>
              <td className="p-4 border-b border-blue-300">{user.role}</td>
              <td className="p-4 border-b border-blue-300">
                <button
                  onClick={() => toggleBlockStatus(user.id)}
                  className={`px-4 py-2 rounded ${user.blocked ? 'bg-green-500' : 'bg-red-500'} text-white`}
                >
                  {user.blocked ? 'Unblock' : 'Block'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button className="p-2 border rounded">&lt;</button>
        {[1, 2, 3].map((page) => (
          <button key={page} className="p-2 border rounded">
            {page}
          </button>
        ))}
        <button className="p-2 border rounded">&gt;</button>
      </div>
    </div>
  );
};

export default UserTable;
