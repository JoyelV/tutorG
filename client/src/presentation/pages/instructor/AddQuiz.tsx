import React, { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../../infrastructure/api/api';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/instructor/Sidebar';

interface FormData {
  question: string;
  answer: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}

const AddQuizForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    question: '',
    answer: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const { courseId } = useParams();
  const navigate = useNavigate();

  const validateField = (name: string, value: string): string | null => {
    if (!value.trim()) {
      return 'This field is required';
    }
    if (value.trim().length < 5) {
      return 'Minimum 5 characters required';
    }
    if (/^[^a-zA-Z]*$/.test(value)) {
      return 'Must contain letters';
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    const error = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) {
        newErrors[key as keyof FormData] = error;
      }
    });

    // Ensure the answer matches one of the options
    const options = [
      formData.option1,
      formData.option2,
      formData.option3,
      formData.option4,
    ];
    if (!options.includes(formData.answer)) {
      newErrors.answer = 'Answer must match one of the options';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const { question, answer, option1, option2, option3, option4 } = formData;
      const options = [option1, option2, option3, option4];

      await api.post(`/instructor/quizzes/${courseId}`, { question, answer, options });
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Quiz submitted successfully!',
      });
      setFormData({
        question: '',
        answer: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
      });
      navigate(`/instructor/course-view/${courseId}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to submit quiz!',
      });
    }
  };

  const handleClose = () => {
    setFormData({
      question: '',
      answer: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
    });
    navigate(`/instructor/course-view/${courseId}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Quiz</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full p-2 border ${
                    errors[key as keyof FormData] ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder={`e.g., ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                  required
                />
                {errors[key as keyof FormData] && (
                  <p className="text-red-500 text-xs mt-1">{errors[key as keyof FormData]}</p>
                )}
              </div>
            ))}

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Save & Submit
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddQuizForm;
