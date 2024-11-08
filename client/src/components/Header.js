
const Header = () => (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <nav className="space-x-4">
            <a href="#home" className="hover:text-blue-400">Home</a>
            <a href="#courses" className="hover:text-blue-400">Courses</a>
            <a href="#about" className="hover:text-blue-400">About</a>
            <a href="#contact" className="hover:text-blue-400">Contact</a>
            <a href="#instructor" className="hover:text-blue-400">Become an Instructor</a>
        </nav>
    </header>
);

export default Header;
