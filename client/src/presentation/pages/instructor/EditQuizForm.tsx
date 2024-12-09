import React, { useState, useEffect } from 'react';
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

const EditQuizForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    question: '',
    answer: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await api.get(`/instructor/quizzes/${courseId}/${quizId}`);
        const { question, answer, options } = response.data;

        setFormData({
          question,
          answer,
          option1: options[0] || '',
          option2: options[1] || '',
          option3: options[2] || '',
          option4: options[3] || '',
        });
      } catch (error) {
        console.error('Error fetching quiz data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load quiz data!',
        });
      }
    };

    fetchQuizData();
  }, [courseId, quizId]);

  const validateField = (name: string, value: string): string | null => {
    const trimmedValue = value.trim();
    const isValid =  /^[A-Za-z\s]+$/.test(trimmedValue);
    if (!trimmedValue) return 'This field is required';
    if (!isValid) return 'Only letters and spaces are allowed';
    return null;
  };

  const validateAnswer = (): string | null => {
    const { answer, option1, option2, option3, option4 } = formData;
    const options = [option1, option2, option3, option4];
    if (!options.includes(answer)) return 'Answer must match one of the options';
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    for (const [key, value] of Object.entries(formData)) {
      const error = validateField(key, value);
      if (error) newErrors[key as keyof FormData] = error;
    }

    const answerError = validateAnswer();
    if (answerError) newErrors.answer = answerError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const { question, answer, option1, option2, option3, option4 } = formData;
      const options = [option1, option2, option3, option4];

      await api.put(`/instructor/quizzes/${courseId}/${quizId}`, { question, answer, options });
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Quiz updated successfully!',
      });
      navigate(`/instructor/course-view/${courseId}`);
    } catch (error) {
      console.error('Error updating quiz:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update quiz!',
      });
    }
  };

  const handleCancel = () => {
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Quiz</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                  {key.replace('option', 'Option ')}
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
                  placeholder={`Enter ${key.replace('option', 'Option ')}`}
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
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancel}
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

export default EditQuizForm;
