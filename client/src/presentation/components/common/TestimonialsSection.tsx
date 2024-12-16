import React from "react";

const testimonials = [
  { name: "Sundar Rajan", text: "TutorG fit us like a glove. Their team curates fresh, up-to-date courses from their marketplace and makes them available to customers.", role: "CEO of Google" },
  { name: "Saboa Nathiya", text: "TutorG responds to the needs of the business in an agile and global manner. It’s truly the best solution for our employees and their careers.", role: "CEO of Microsoft" },
  { name: "Ted Markos", text: "In total, it was a big success, I would get emails about what a fantastic resource it was.It’s truly the best solution for our employees and their careers.", role: "CEO of Netflix" },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="p-6 bg-white rounded-lg shadow">
            <p className="text-orange-500 mb-4">“{testimonial.text}"</p>
            <p className="font-bold">{testimonial.name}</p>
            <p className="text-sm text-gray-500">{testimonial.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
