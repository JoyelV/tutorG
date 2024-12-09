import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2
import api from '../../../infrastructure/api/api';
import Sidebar from '../../components/admin/Sidebar';

const AddReviewForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    material: '',
    comment: '',
  });
  const [errors, setErrors] = useState({
    title: '',
    material: '',
    comment: '',
  });
  const { courseId } = useParams();
  const navigate = useNavigate();

  const validateInput = (name: string, value: string): string => {
    const regex = /^[A-Za-z\s]*$/;
    if (!regex.test(value)) {
      return `${name} should contain only letters and spaces.`;
    }
    if (value.trim() === '') {
      return `${name} is required.`;
    }
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateInput(name, value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const titleError = validateInput('Title', formData.title);
    const materialError = validateInput('Material', formData.material);
    const commentError = validateInput('Comment', formData.comment);

    if (titleError || materialError || commentError) {
      setErrors({
        title: titleError,
        material: materialError,
        comment: commentError,
      });
      return;
    }

    try {
      const response = await api.post(`/qa/courses/${courseId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        Swal.fire('Oops!', 'Review already exists.', 'error');
      } else if (response.status !== 201) {
        Swal.fire('Error', 'Failed to submit review.', 'error');
      } else {
        Swal.fire('Success!', 'Review submitted successfully!', 'success');
        setFormData({ title: '', material: '', comment: '' });
        navigate(`/qa/viewCoursePage/${courseId}`);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Swal.fire('Error', 'Something went wrong while submitting your review.', 'error');
    }
  };

  const handleClose = () => {
    setFormData({ title: '', material: '', comment: '' });
    navigate(`/qa/viewCoursePage/${courseId}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <Sidebar />
      </aside>
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Review</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title of Material
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., Vue Forms"
                required
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="material" className="block text-sm font-medium text-gray-700">
                Review
              </label>
              <input
                type="text"
                id="material"
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., Bad Video Quality"
                required
              />
              {errors.material && <p className="text-red-500 text-sm mt-1">{errors.material}</p>}
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                Comment
              </label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Write your comments here..."
                rows={4}
                required
              ></textarea>
              {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment}</p>}
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReviewForm;
