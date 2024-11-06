// src/components/Topics.js
import React from 'react';

const topics = [
    { name: "Business", courses: "32,821 Courses" },
    { name: "Finance", courses: "33,417 Courses" },
    // Add more topics
];

const Topics = () => (
    <section className="p-8 bg-white">
        <h3 className="text-2xl font-bold mb-4">Topics recommended for you</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {topics.map((topic, index) => (
                <div key={index} className="p-4 bg-blue-100 rounded shadow hover:bg-blue-200">
                    <h4 className="text-lg font-semibold">{topic.name}</h4>
                    <p className="text-gray-600">{topic.courses}</p>
                </div>
            ))}
        </div>
    </section>
);

export default Topics;
