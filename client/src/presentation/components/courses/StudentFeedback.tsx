// StudentFeedback.tsx
import React from 'react';

interface Feedback {
  name: string;
  comment: string;
  rating: string;
}

const feedbacks: Feedback[] = [
  { name: 'Gilbert Dizosa', comment: 'Great course, learned a lot!', rating: '⭐⭐⭐⭐⭐' },
  { name: 'Joyel Varghese', comment: 'Great course, learned a lot!', rating: '⭐⭐⭐⭐⭐' },
  { name: 'Gokul K', comment: 'Great course, learned a lot!', rating: '⭐⭐⭐⭐⭐' },
  { name: 'Rahul Eldo', comment: 'Great course, learned a lot!', rating: '⭐⭐⭐⭐⭐' }
];

const StudentFeedback: React.FC = () => {
  return (
    <div className="py-4">
      <h2 className="text-2xl font-semibold">Student Feedback</h2>
      {feedbacks.map((feedback, index) => (
        <div key={index} className="mt-4">
          <p><strong>{feedback.name}</strong></p>
          <p>{feedback.comment}</p>
          <p>{feedback.rating}</p>
        </div>
      ))}
    </div>
  );
};

export default StudentFeedback;
