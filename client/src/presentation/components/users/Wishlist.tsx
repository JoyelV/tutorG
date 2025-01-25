import { useEffect, useState, useCallback } from 'react';
import api from '../../../infrastructure/api/api';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
}

interface WishlistItem {
  _id: string;
  course: Course[];
}

function WishList() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  const userId = localStorage.getItem('userId');

  const fetchWishlistItems = useCallback(async () => {
    try {
      const response = await api.get(`/user/wishlist`);
      if (response.data) {
        setWishlistItems(response.data);
      } else {
        setWishlistItems([]);
      }
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
      toast.error('Failed to load wishlist items.');
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchWishlistItems();
  }, [userId, fetchWishlistItems]);

  const handleRemove = useCallback(async (wishlistItemId: string) => {
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
        await api.delete(`/user/removeitem/${wishlistItemId}`);
        setWishlistItems((prev) => prev.filter((item) => item._id !== wishlistItemId));
        Swal.fire('Deleted!', 'Your item has been removed.', 'success');
      }
    } catch (error) {
      console.error('Error deleting wishlist item:', error);
      toast.error('Failed to delete the item.');
    }
  }, []);

  const handleAddToCart = useCallback(
    async (wishlistItemId: string, courseId: string) => {
      if (!userId) {
        toast.error('Please log in to add items to your cart.');
        return;
      }

      try {
        const response = await api.post(`/user/cart/add`, { userId, courseId });
        const { message } = response.data;

        if (message === "Student is already enrolled in this course") {
          toast.info(message);
          return;
        } else if (message === "Course already exists in the cart") {
          toast.info(message);
          return;
        } else {
          toast.success(message);
        }
        await api.delete(`/user/removeitem/${wishlistItemId}`);
        setWishlistItems((prev) => prev.filter((item) => item._id !== wishlistItemId));
        Swal.fire('Moved!', 'The item has been added to your cart.', 'success');
      } catch (error: any) {
        console.error('Error while adding to cart:', error);
        toast.error(error.response?.data?.message || 'Failed to add the item to the cart.');
      }
    },
    [userId]
  );

  return (
    <>
      <section className="py-8 lg:py-24 relative -mt-9">
        <div className="w-full max-w-7xl px-4 md:px-5 mx-auto">
          <div className="border-t border-sky-200 py-3">
            {wishlistItems.length > 0 ? (
              wishlistItems.map((wishlistItem) => (
                <div
                  key={wishlistItem._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 border-b border-sky-200 py-4"
                >
                  {wishlistItem.course.map((course) => (
                    <div key={course._id} className="flex items-start sm:items-center gap-4">
                      <img src={course.thumbnail} alt={course.title} className="w-20 h-20 sm:w-16 sm:h-16 rounded-md" />
                      <div>
                        <h4 className="font-semibold text-sky-600">{course.title}</h4>
                        <p className="text-sky-500 text-sm">Duration: {course.duration} hrs</p>
                        <p className="text-sky-500 text-sm">Language: {course.language}</p>
                        <p className="text-sky-500 text-sm">Level: {course.level}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <p className="font-bold text-sky-600">₹{wishlistItem.course[0]?.courseFee}</p>
                    <button
                      onClick={() => handleRemove(wishlistItem._id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => handleAddToCart(wishlistItem._id, wishlistItem.course[0]._id)}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col text-center py-16 items-center">
                <p className="text-sky-500">Your wishlist is empty.</p>
                <p className="text-gray-500 mt-4">
                  Looks like you haven’t added anything to your wishlist yet.
                </p>
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
      </section>
      <ToastContainer />
    </>
  );
}

export default WishList;