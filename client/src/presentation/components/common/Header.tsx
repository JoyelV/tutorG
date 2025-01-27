import React, { useState } from 'react';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="p-4 bg-gray-800 text-white">
            {/* Container */}
            <div className="flex justify-between items-center">
                {/* Hamburger Menu (Visible on Mobile) */}
                <button
                    className="md:hidden focus:outline-none"
                    onClick={toggleMenu}
                    aria-label="Toggle Menu"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                        />
                    </svg>
                </button>

                {/* Navigation Links */}
                <nav
                    className={`space-x-4 md:flex ${isMenuOpen ? 'flex flex-col space-x-0 space-y-2 mt-4' : 'hidden'} md:space-y-0 md:mt-0`}
                >
                    <a href="/" className="hover:text-blue-400">Home</a>
                    <a href="/course-listing" className="hover:text-blue-400">Courses</a>
                    <a href="/about" className="hover:text-blue-400">About</a>
                    <a href="/contact" className="hover:text-blue-400">Contact</a>
                    <a href="/become-an-instructor" className="hover:text-blue-400">Become an Instructor</a>
                    <a href="/user-profile" className="hover:text-blue-400">Profile</a>
                </nav>
            </div>
        </header>
    );
};

export default Header;

