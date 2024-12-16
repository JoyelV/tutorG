import React, { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../../infrastructure/api/api';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/instructor/Sidebar';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

const AddQuizForm: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([
    { question: '', options: ['', '', '', ''], answer: '' },
  ]);
  const { courseId } = useParams();
  const navigate = useNavigate();

  const handleQuestionChange = (index: number, field: string, value: string) => {
    const updatedQuestions = [...questions];
    if (field === 'question') {
      updatedQuestions[index].question = value;
    } else if (field === 'answer') {
      updatedQuestions[index].answer = value;
    } else {
      const optionIndex = parseInt(field.replace('option', ''), 10);
      updatedQuestions[index].options[optionIndex] = value;
    }
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: '' }]);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate questions
    for (const { question, options, answer } of questions) {
      if (!question || options.some((opt) => !opt) || !answer) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Each question must have text, 4 options, and a valid answer.',
        });
        return;
      }

      if (!options.includes(answer)) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Answer must match one of the options.',
        });
        return;
      }
    }

    try {
      await api.post(`/instructor/quizzes/${courseId}`, { questions });
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Quiz submitted successfully!',
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Quiz</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {questions.map((question, index) => (
              <div key={index} className="space-y-2 border p-4 rounded-md">
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                  placeholder={`Question ${index + 1}`}
                  className="block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
                {question.options.map((option, i) => (
                  <input
                    key={i}
                    type="text"
                    value={option}
                    onChange={(e) => handleQuestionChange(index, `option${i}`, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className="block w-full p-2 border border-gray-300 rounded-md mt-1"
                    required
                  />
                ))}
                <input
                  type="text"
                  value={question.answer}
                  onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                  placeholder="Answer"
                  className="block w-full p-2 border border-gray-300 rounded-md mt-1"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="text-red-500 mt-2"
                >
                  Remove Question
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addQuestion}
              className="bg-green-500 text-white py-2 px-4 rounded-md"
            >
              Add Another Question
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 px-4 rounded-md mt-4"
            >
              Save & Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddQuizForm;
