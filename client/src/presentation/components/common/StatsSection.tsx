import React from "react";

const logos = ["Netflix", "YouTube", "Google", "Lenovo", "Slack", "Verizon", "Lexmark", "Microsoft"];

const StatsSection: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-2xl font-bold mb-8">We Just keep growing with 6.3k Companies</h3>
        {/* Logos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {logos.map((logo, index) => (
            <div key={index} className="p-4 bg-white shadow rounded">
              <p className="font-semibold">{logo}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 text-center">
          <div>
            <h4 className="text-3xl font-bold text-orange-500">67.1K</h4>
            <p className="text-gray-600">Students</p>
          </div>
          <div>
            <h4 className="text-3xl font-bold text-orange-500">26K</h4>
            <p className="text-gray-600">Certified Instructors</p>
          </div>
          <div>
            <h4 className="text-3xl font-bold text-orange-500">72</h4>
            <p className="text-gray-600">Country Languages</p>
          </div>
          <div>
            <h4 className="text-3xl font-bold text-orange-500">99.9%</h4>
            <p className="text-gray-600">Success Rate</p>
          </div>
          <div>
            <h4 className="text-3xl font-bold text-orange-500">57</h4>
            <p className="text-gray-600">Trusted Companies</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
