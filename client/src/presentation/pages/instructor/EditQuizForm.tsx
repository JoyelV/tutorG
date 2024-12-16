import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../../../infrastructure/api/api';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/instructor/Sidebar';

interface Question {
  question: string;
  answer: string;
  options: string[];
}

interface FormData {
  questions: Question[];
}

const EditQuizForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ questions: [] });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await api.get(`/instructor/quizzes/${courseId}/${quizId}`);
        setFormData({ questions: response.data.questions });
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
    const isValid = /^[A-Za-z\s]+$/.test(trimmedValue);
    if (!trimmedValue) return 'This field is required';
    if (!isValid) return 'Only letters and spaces are allowed';
    return null;
  };

  const validateAnswer = (answer: string, options: string[]): string | null => {
    if (!options.includes(answer)) return 'Answer must match one of the options';
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: string) => {
    const { value } = e.target;
    setFormData((prev) => {
      const updatedQuestions = [...prev.questions];
      if (field === 'question' || field === 'answer') {
        updatedQuestions[index][field] = value; 
      } else if (field.startsWith('option')) {
        const optionIndex = parseInt(field.replace('option', ''), 10) - 1;
        updatedQuestions[index].options[optionIndex] = value;
      }
      
      return { ...prev, questions: updatedQuestions };
    });

    const question = formData.questions[index];
    if (field === 'answer') {
      setErrors((prev) => ({
        ...prev,
        [`${index}-answer`]: validateAnswer(value, question.options) || '',
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [`${index}-${field}`]: validateField(field, value) || '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    formData.questions.forEach((question, index) => {
      const { question: qText, answer, options } = question;
      if (!qText.trim()) newErrors[`${index}-question`] = 'Question is required';
      if (!answer.trim()) newErrors[`${index}-answer`] = 'Answer is required';
      if (options.length !== 4 || options.some((opt) => !opt.trim())) {
        newErrors[`${index}-options`] = 'All 4 options are required';
      }
      const answerError = validateAnswer(answer, options);
      if (answerError) newErrors[`${index}-answer`] = answerError;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await api.put(`/instructor/quizzes/${courseId}/${quizId}`, formData);
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
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <Sidebar />
      </aside>
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Quiz</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {formData.questions.map((q, index) => (
              <div key={index} className="space-y-4">
                <div>
                  <label htmlFor={`question-${index}`} className="block text-sm font-medium text-gray-700">
                    Question {index + 1}
                  </label>
                  <input
                    type="text"
                    id={`question-${index}`}
                    value={q.question}
                    onChange={(e) => handleInputChange(e, index, 'question')}
                    className={`mt-1 block w-full p-2 border ${
                      errors[`${index}-question`] ? 'border-red-500' : 'border-gray-300'
                    } rounded-md`}
                  />
                  {errors[`${index}-question`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`${index}-question`]}</p>
                  )}
                </div>
                {q.options.map((option, optIndex) => (
                  <div key={optIndex}>
                    <label htmlFor={`option-${index}-${optIndex}`} className="block text-sm font-medium text-gray-700">
                      Option {optIndex + 1}
                    </label>
                    <input
                      type="text"
                      id={`option-${index}-${optIndex}`}
                      value={option}
                      onChange={(e) => handleInputChange(e, index, `option${optIndex + 1}`)}
                      className={`mt-1 block w-full p-2 border ${
                        errors[`${index}-options`] ? 'border-red-500' : 'border-gray-300'
                      } rounded-md`}
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor={`answer-${index}`} className="block text-sm font-medium text-gray-700">
                    Answer
                  </label>
                  <input
                    type="text"
                    id={`answer-${index}`}
                    value={q.answer}
                    onChange={(e) => handleInputChange(e, index, 'answer')}
                    className={`mt-1 block w-full p-2 border ${
                      errors[`${index}-answer`] ? 'border-red-500' : 'border-gray-300'
                    } rounded-md`}
                  />
                  {errors[`${index}-answer`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`${index}-answer`]}</p>
                  )}
                </div>
              </div>
            ))}
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
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
