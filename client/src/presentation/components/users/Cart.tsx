import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import api from '../../../infrastructure/api/api';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const studentId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await api.get(`/user/getcart`);
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
      const paymentData = cartItems.map((item) => ({
        studentId: studentId,
        courseId: item.course[0]._id,
        courseFee: item.course[0].courseFee,
        title: item.course[0].title,
        thumbnail: item.course[0].thumbnail,
      }));

      const response = await api.post(`/user/stripepayment`, { cartItems: paymentData });
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        toast.error('Failed to initiate payment. Please try again.');
      }
    } catch {
      toast.error('Payment processing failed. Please try again.');
    }
  };

  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => total + item.course[0].courseFee, 0);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cartItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) 
  return <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-blue-500"></div>

  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <section className="py-8 lg:py-24 relative min-h-screen flex flex-col">
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-6 mx-auto flex-grow">
        <p className="text-2xl font-bold text-center text-sky-500">CART PAGE</p>
        <div className="border-t border-sky-200 py-3">
          {cartItems.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto text-sm sm:text-base">
                  <thead>
                    <tr className="border-b">
                      <th className="px-2 py-2 sm:px-4">Course Description</th>
                      <th className="px-2 py-2 sm:px-4">Fee</th>
                      <th className="px-2 py-2 sm:px-4">Remove</th>
                      <th className="px-2 py-2 sm:px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((cartItem) => (
                      <tr key={cartItem._id} className="border-b">
                        {cartItem.course.map((course) => (
                          <td key={course._id} className="px-2 py-2 sm:px-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-16 h-16 rounded-md"
                              />
                              <div>
                                <p className="font-semibold text-sky-600">{course.title}</p>
                                <p className="text-sky-500">Category: {course.category}</p>
                                <p className="text-sky-500">Level: {course.level}</p>
                                <p className="text-sky-500">Rating: {course.rating} ⭐</p>
                              </div>
                            </div>
                          </td>
                        ))}
                        <td className="px-2 py-2 sm:px-4">₹{cartItem.course[0]?.courseFee}</td>
                        <td className="px-2 py-2 sm:px-4">
                          <button
                            onClick={() => handleRemove(cartItem._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </td>
                        <td className="px-2 py-2 sm:px-4">
                          <button
                            onClick={() => handleMoveToWishlist(cartItem._id, cartItem.course[0]._id)}
                            className="text-blue-500 hover:text-blue-700 ml-2"
                          >
                            Move to Wishlist
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col sm:flex-row justify-between mt-6">
                <p className="font-semibold text-lg">Total Amount: ₹{calculateTotalAmount()}</p>
                <button
                  onClick={handlePaymentSelection}
                  className="mt-4 sm:mt-0 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Proceed to Checkout
                </button>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 disabled:opacity-50"
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  className="px-4 py-2 ml-2 bg-sky-500 text-white rounded hover:bg-sky-600"
                  disabled={currentPage * itemsPerPage >= cartItems.length}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-sky-600">Your cart is empty!</h2>
              <p className="text-gray-500 mt-4">Looks like you haven’t added anything to your cart yet.</p>
              <button
                onClick={() => (window.location.href = '/course-listing')}
                className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Go to Courses
              </button>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default CartPage;
