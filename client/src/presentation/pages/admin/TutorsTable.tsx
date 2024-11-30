import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../infrastructure/api/api';
import Swal from 'sweetalert2';

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
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTutors.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredTutors.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    api
      .get('/admin/instructors')
      .then((response) => {
        setTutors(response.data);
        setFilteredTutors(response.data); 
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load tutors');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = tutors.filter((tutor) =>
      tutor.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTutors(filtered);
    setCurrentPage(1); 
  }, [searchTerm, tutors]);

  const toggleBlockStatus = async (tutorId: string) => {
    try {
      const result = await Swal.fire({
        title: 'Block/Unblock Category?',
        text: 'Are you sure you want to block/unblock this category?',
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

      const response = await api.patch(
        `/admin/instructors/${tutorId}`,
        { isBlocked: updatedStatus }
      );

      setTutors((prevTutors) =>
        prevTutors.map((tutor) => (tutor._id === tutorId ? response.data : tutor))
      );
    }
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tutors by name..."
          className="p-2 border rounded w-full max-w-sm"
        />
        <button
        onClick={() => navigate('/admin/add-tutor')}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Tutor
      </button>
      </div>
      <table className="min-w-full bg-green-200 rounded-lg">
        <thead>
          <tr>
            {['Name', 'Email Id', 'Phone', 'Gender', 'Role', 'Action','Status'].map((header) => (
              <th key={header} className="p-4 border-b border-green-300 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((tutor) => (
            <tr key={tutor._id} className="bg-green-100 even:bg-green-200">
              <td className="p-4 border-b border-green-300">{tutor.username}</td>
              <td className="p-4 border-b border-green-300">{tutor.email}</td>
              <td className="p-4 border-b border-green-300">{tutor.phone}</td>
              <td className="p-4 border-b border-green-300">{tutor.gender}</td>
              <td className="p-4 border-b border-green-300">{tutor.role}</td>
              <td className="p-4 border-b border-green-300">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => navigate(`/update-tutor/`)}
                >
                  Update
                </button>
              </td>
              <td className="p-4 border-b border-green-300">
                <button
                  onClick={() => toggleBlockStatus(tutor._id)}
                  className={`px-4 py-2 rounded ${tutor.isBlocked ? 'bg-green-500' : 'bg-red-500'
                    } text-white`}
                >
                  {tutor.isBlocked ? 'Unblock' : 'Blocked'}
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
            className={`p-2 border rounded ${currentPage === page ? 'bg-green-500 text-white' : ''
              }`}
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

export default TutorsTable;
