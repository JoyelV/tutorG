import React, { useState } from 'react';
import EditLessonPage from './EditLessonPage';

const EditLesson: React.FC = () => {
  return (
    <div className="p-6">
      <section>
        <EditLessonPage />
      </section>
    </div>
  );
};

export default EditLesson;
