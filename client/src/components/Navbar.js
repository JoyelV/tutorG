import { useNavigate } from 'react-router-dom';


const Navbar = () => {
    const navigate = useNavigate();

    const isLoggedIn = Boolean(localStorage.getItem('token')); // Check if a token exists in localStorage

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token on logout
        window.location.reload(); // Reload to reflect changes (or use a more advanced state management approach)
    };

    return (
        <header className="flex items-center justify-between p-4 bg-white text-gray-800 border-b border-gray-300">
            <div className="text-2xl font-bold">
                <h2>
                    Tutor<span className="text-blue-600">G</span>
                </h2>
            </div>
            <div className="flex items-center gap-3 w-full max-w-md">
                <select className="p-2 border border-gray-300 rounded">
                    <option>Browse</option>
                    <option>Category 1</option>
                    <option>Category 2</option>
                </select>
                <input
                    type="text"
                    placeholder="What do you want to learn..."
                    className="p-2 border border-gray-300 rounded w-full"
                />
            </div>
            <div className="flex gap-4">
                <span className="text-xl cursor-pointer">🔔</span> {/* Notification Icon */}
                <span className="text-xl cursor-pointer">❤️</span> {/* Favorite Icon */}
                <span className="text-xl cursor-pointer">🛒</span> {/* Cart Icon */}
            </div>
            <div className="flex gap-2">
                {isLoggedIn ? (
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded transition duration-300 ease-in-out hover:bg-red-600"
                    >
                        Logout
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => navigate('/register')}
                            className="px-4 py-2 bg-orange-500 text-white rounded transition duration-300 ease-in-out hover:bg-orange-600"
                        >
                            Create Account
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-4 py-2 text-orange-500 border border-orange-500 rounded transition duration-300 ease-in-out hover:bg-orange-500 hover:text-white"
                        >
                            Sign In
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Navbar;
