import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../../infrastructure/api/api';

interface Quiz {
  _id: string;
  question: string;
}

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const { courseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get(`/instructor/quizzes/${courseId}`);
        console.log(response,"quizes")
        setQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load quizzes!',
        });
      }
    };

    fetchQuizzes();
  }, [courseId]);

  const handleDelete = async (quizId: string) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This will permanently delete the quiz.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        await api.delete(`/instructor/quizzes/${courseId}/${quizId}`);
        setQuizzes((prev) => prev.filter((quiz) => quiz._id !== quizId));
        Swal.fire('Deleted!', 'Quiz has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete quiz!',
      });
    }
  };

  const handleEdit = (quizId: string) => {
    navigate(`/instructor/quizzes/${courseId}/edit/${quizId}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Quiz List</h1>
        {quizzes.length > 0 ? (
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="flex items-center justify-between bg-white p-4 shadow-md rounded-md"
              >
                <span className="text-gray-800">{quiz._id}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(quiz._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-4 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(quiz._id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-4 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No quizzes found.</p>
        )}
      </div>
    </div>
  );
};

export default QuizList;
