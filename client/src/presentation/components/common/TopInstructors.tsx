import React, { useState, useEffect } from 'react';
import { assets } from '../../../assets/assets_user/assets';
import api from '../../../infrastructure/api/api';

interface Instructor {
  _id: string;
  username: string;
  headline: string;
  areasOfExpertise: string;
  image: string;
  averageRating: number;
  numberOfRatings: number;
}

const TopInstructors: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await api.get('/user/top-tutors'); 
        setInstructors(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching instructors:', error);
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading top instructors...</div>;
  }

  return (
    <section className="p-8 bg-white">
      <h3 className="text-2xl font-bold mb-4 text-center">Our Top Instructors</h3>
      <div className="mx-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-center">
        {instructors.map((instructor) => (
          <div
            key={instructor._id}
            className="bg-white rounded-xl shadow-md max-w-xs w-full mx-auto transform transition duration-500 hover:scale-105 hover:shadow-xl"
          >
            {/* Instructor Image */}
            <div
              className="h-60 bg-cover bg-center rounded-t-xl"
              style={{ backgroundImage: `url(${instructor.image || assets.Instructor1})` }}
            ></div>
            <div className="p-3">
              {/* Instructor Name and Title */}
              <h2 className="text-center px-2 py-1 rounded-full text-xs font-semibold uppercase text-gray-800 leading-tight">
                {instructor.username}
              </h2>
              <p className="text-center text-sm text-gray-500 mb-2">{instructor.areasOfExpertise || 'Expertize'}</p>
              {/* Expertise and Rating */}
              <div className="flex items-center justify-between text-sm mb-1">
                <div className="font-bold text-lg text-orange-500">
                  ★ {instructor.averageRating.toFixed(1)}
                </div>
                <div>
                  <span className="text-gray-500 font-semibold">{instructor.numberOfRatings} ratings</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopInstructors;
