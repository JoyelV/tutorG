// src/components/HeroSection.js
import React from 'react';

const HeroSection = () => (
    <section className="flex flex-col md:flex-row items-center justify-between p-8 bg-blue-50 text-gray-800">
        <div className="mb-6 md:mb-0 md:w-1/2">
            <h2 className="text-4xl font-bold mb-4">Connect with us</h2>
            <p className="mb-6">We’d love to hear from you! Get in touch with our team.</p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-500">Know More</button>
        </div>
        <img src="path/to/hero-image.jpg" alt="Connect with Us" className="w-full md:w-1/2 rounded-lg shadow-lg" />
    </section>
);

export default HeroSection;
