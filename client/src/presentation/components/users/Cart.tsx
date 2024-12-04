import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';
import api from '../../../infrastructure/api/api';
import Swal from 'sweetalert2';

interface Course {
  _id: string;
  title: string;
  subtitle: string;
  category: string;
  level: string;
  courseFee: number;
  thumbnail: string;
  rating: number;
}

interface CartItem {
  _id: string;
  course: Course[];
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const studentId = localStorage.getItem('userId');

  // Fetch cart items on mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await api.get(`/user/getcart/${studentId}`);
        setCartItems(response.data);
      } catch {
        setError('Failed to fetch cart items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [studentId]);

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
        Swal.fire('Deleted!', 'The item has been removed from your cart.', 'success');
      }
    } catch {
      Swal.fire('Error', 'Failed to remove the item. Please try again.', 'error');
    }
  };

  const handleMoveToWishlist = async (cartItemId: string, courseId: string) => {
    try {
      await api.post(`/user/addtowishlist`, { userId: studentId, courseId });
      await api.delete(`/user/removecartitem/${cartItemId}`);
      setCartItems((prevItems) => prevItems.filter((item) => item._id !== cartItemId));
      Swal.fire('Moved!', 'The item has been added to your wishlist.', 'success');
    } catch {
      Swal.fire('Error', 'Failed to move the item to wishlist. Please try again.', 'error');
    }
  };

  const handlePaymentSelection = async () => {
    try {
      const paymentData = cartItems.map(item => ({
        studentId:studentId,
        courseId: item.course[0]._id,
        courseFee: item.course[0].courseFee,
        title: item.course[0].title,
        thumbnail: item.course[0].thumbnail
      }));
      
      const response = await api.post(`/user/stripepayment`, { cartItems: paymentData });
      console.log(response.data.url,":url")
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        toast.error('Failed to initiate payment. Please try again.');
      }
    } catch (err) {
      toast.error('Payment processing failed. Please try again.');
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
            <button
              onClick={handlePaymentSelection}
              className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
