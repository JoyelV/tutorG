import React, { useEffect, useState } from 'react';
import api from '../../../infrastructure/api/api';

interface Tutor {
  username: string;
  image: string;
  title: string;
}

const MyTutorsPage: React.FC = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const studentId = localStorage.getItem('userId');

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

  return (
    <section className="p-8 bg-white">
      <h3 className="text-2xl font-bold mb-4 text-center">My Tutors</h3>
      <div className="mx-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-center">
        {tutors.length > 0 ? (
          tutors.map((tutor, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md max-w-xs w-full mx-auto transform transition duration-500 hover:scale-105 hover:shadow-xl"
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
          <p>No tutors found.</p>
        )}
      </div>
    </section>
  );
};

export default MyTutorsPage;
