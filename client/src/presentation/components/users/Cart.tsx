import { useEffect, useState } from 'react';
import api from '../../../infrastructure/api/api';
import Swal from 'sweetalert2';

interface Course {
  _id: string;
  title: string;
  subtitle: string;
  category: string;
  subCategory: string;
  language: string;
  level: string;
  duration: number;
  courseFee: number;
  thumbnail: string;
  trailer: string;
  description: string;
  learningPoints: string;
  targetAudience: string;
  requirements: string;
  feedback: string;
  instructorId: string;
  status: string;
  students: string[];
  rating: number;
  isApproved: boolean;
  createdAt: string;
}

interface CartItem {
  _id: string;
  user: string;
  course: Course[];
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const studentId = localStorage.getItem('userId');

  // Fetch cart items on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await api.get(`/user/getcart/${studentId}`);
        setCartItems(response.data);
      } catch (err) {
        setError('Error fetching cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  // Remove item from cart
  const handleRemove = async (cartItemId: string) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0284c7',
        cancelButtonColor: '#f472b6',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
      await api.delete(`/user/removecartitem/${cartItemId}`);
      setCartItems((prevItems) => prevItems.filter((item) => item._id !== cartItemId));
      }
    } catch (err) {
      alert('Failed to remove item from cart');
    }
  };

  // Move item to wishlist
  const handleMoveToWishlist = async (cartItemId: string, courseId: string) => {
    try {
      await api.post(`/user/addtowishlist`, { userId: studentId, courseId });
      await api.delete(`/user/removecartitem/${cartItemId}`);
      setCartItems((prevItems) => prevItems.filter((item) => item._id !== cartItemId));
    } catch (err) {
      alert('Failed to move item to wishlist');
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Shopping Cart</h1>
        <p className="text-lg">{cartItems.length} Courses in Cart</p>
      </div>
      {cartItems.length === 0 ? (
        <p className="text-center text-lg">Your cart is empty!</p>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between items-start border-b pb-6">
                <div className="w-32">
                  <img
                    src={item.course[0].thumbnail}
                    alt={item.course[0].title}
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
                <div className="flex-1 pl-6">
                  <h2 className="text-xl font-semibold">{item.course[0].title}</h2>
                  <p className="text-gray-600">{item.course[0].subtitle}</p>
                  <div className="mt-4 text-sm text-gray-600">
                    <p><strong>Category:</strong> {item.course[0].category}</p>
                    <p><strong>Level:</strong> {item.course[0].level}</p>
                    <p><strong>Price:</strong> ₹{item.course[0].courseFee}</p>
                    <div className="flex items-center mt-2">
                      <span>{item.course[0].rating}</span>
                      <span className="ml-1 text-yellow-500">⭐</span>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => handleMoveToWishlist(item._id, item.course[0]._id)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                    >
                      Move to Wishlist
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <div className="text-xl font-bold">
              Total: ₹{cartItems.reduce((total, item) => total + item.course[0].courseFee, 0)}
            </div>
            <button className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
