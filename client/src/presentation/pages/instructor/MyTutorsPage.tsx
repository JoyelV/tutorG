import React, { useEffect, useState } from 'react';
import api from '../../../infrastructure/api/api';
import { useNavigate } from 'react-router-dom';

interface Tutor {
  _id: string;
  username: string;
  image: string;
  title: string;
}

const MyTutorsPage: React.FC = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tutorsPerPage] = useState<number>(12);
  const studentId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTutors = async () => {
      if (!studentId) {
        console.error('Student ID is not available');
        return;
      }

      try {
        const response = await api.get(`/user/my-tutors`);
        const orders = response.data;

        const tutorsList = orders.map((order: any) => ({
          _id: order.tutorId._id,
          username: order.tutorId.username,
          image: order.tutorId.image,
          title: 'Instructor',
        }));

        setTutors(tutorsList);
      } catch (error) {
        console.error('Error fetching tutors:', error);
      }
    };

    fetchTutors();
  }, [studentId]);

  const indexOfLastTutor = currentPage * tutorsPerPage;
  const indexOfFirstTutor = indexOfLastTutor - tutorsPerPage;
  const currentTutors = tutors.slice(indexOfFirstTutor, indexOfLastTutor);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <section className="p-8 bg-white">

      <div className="mx-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-center">
        {currentTutors.length > 0 ? (
          currentTutors.map((tutor, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md max-w-xs w-full mx-auto transform transition duration-500 hover:scale-105 hover:shadow-xl"
              onClick={() => navigate(`/instructorProfile/${tutor._id}`)}
            >
              {/* Tutor Image */}
              <div
                className="h-60 bg-cover bg-center rounded-t-xl"
                style={{ backgroundImage: `url(${tutor.image})` }}
              ></div>

              <div className="p-3">
                {/* Tutor Name */}
                <h2 className="text-center px-2 py-1 rounded-full text-xs font-semibold uppercase text-gray-800 leading-tight">
                  {tutor.username}
                </h2>
                <p className="text-center text-sm text-gray-500 mb-2">{tutor.title}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <img
              src="https://via.placeholder.com/150"
              alt="No Tutors Illustration"
              className="w-40 h-40 mb-6"
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              No Tutors Found
            </h2>
            <p className="text-gray-600 text-lg mb-6 text-center">
              You don't have any courses enrolled, Purchase a course.
            </p>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
              onClick={() => navigate('/course-listing')}
            >
              Browse All Courses
            </button>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {tutors.length > tutorsPerPage && (
        <div className="flex justify-center mt-6">
          {[...Array(Math.ceil(tutors.length / tutorsPerPage))].map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-3 py-1 rounded-full ${currentPage === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyTutorsPage;
