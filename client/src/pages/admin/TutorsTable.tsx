import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type Tutor = {
  id: string;
  username: string;
  email: string;
  phone: string;
  gender: number;
  role: string;
  blocked: boolean;  // Track block/unblock status
};

const TutorsTable: React.FC = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/instructors');
        setTutors(response.data);
      } catch (err) {
        setError('Failed to fetch tutors');
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  const toggleBlockStatus = (tutorId: string) => {
    // Toggle the block status locally first
    const updatedTutors = tutors.map((tutor) =>
      tutor.id === tutorId ? { ...tutor, blocked: !tutor.blocked } : tutor
    );
    setTutors(updatedTutors);

    // Optionally send the update to the backend
    axios
      .patch(`http://localhost:5000/api/admin/instructors/${tutorId}/block`, {
        blocked: updatedTutors.find((tutor) => tutor.id === tutorId)?.blocked,
      })
      .catch(() => {
        setError('Failed to update block status');
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => navigate('/add-tutor')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Tutor
        </button>
      </div>
      <table className="min-w-full bg-green-200 rounded-lg">
        <thead>
          <tr>
            {['Name', 'Email Id', 'Phone', 'Gender', 'Role', 'Update', 'Action'].map((header) => (
              <th key={header} className="p-4 border-b border-green-300 text-left">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tutors.map((tutor) => (
            <tr key={tutor.id} className="bg-green-100 even:bg-green-200">
              <td className="p-4 border-b border-green-300">{tutor.username}</td>
              <td className="p-4 border-b border-green-300">{tutor.email}</td>
              <td className="p-4 border-b border-green-300">{tutor.phone}</td>
              <td className="p-4 border-b border-green-300">{tutor.gender}</td>
              <td className="p-4 border-b border-green-300">{tutor.role}</td>
              <td className="p-4 border-b border-green-300">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => navigate(`/update-tutor/${tutor.id}`)}
                >
                  Update
                </button>
              </td>
              <td className="p-4 border-b border-green-300">
                <button
                  onClick={() => toggleBlockStatus(tutor.id)}
                  className={`px-4 py-2 rounded ${tutor.blocked ? 'bg-green-500' : 'bg-red-500'} text-white`}
                >
                  {tutor.blocked ? 'Unblock' : 'Block'}
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

export default TutorsTable;
