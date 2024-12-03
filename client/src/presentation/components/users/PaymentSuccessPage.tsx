import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';  

function PaymentSuccess() {
  // Local state to store cartId and studentId
  const [cartId, setCartId] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  // Use navigate and search params hooks
  const navigate = useNavigate();
  const searchQuery = useSearchParams()[0];
  const referenceNo = searchQuery.get("reference");

  // Simulating the process of getting cartId and studentId, this could be from props, context, or any other source
  useEffect(() => {
    // Here you can replace the hardcoded values with actual data fetching logic
    setCartId('12345');  // Example cartId, replace with actual logic
    setStudentId('student123');  // Example studentId, replace with actual logic
  }, []);

  const clearCart = async () => {
    try {
      console.log("Attempting to clear cart with ID:", cartId);

      const data = { id: studentId };

      const response = await axios.post('/user/cart/clear', data);
      console.log("Clear cart response:", response);

      if (response?.data?.status) {
        toast.success("Payment Successful");
      } else {
        toast.error("Failed to clear the cart.");
      }

    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Error occurred while clearing the cart.");
    }
  };

  useEffect(() => {
    (async () => {
      if (studentId) {
        await clearCart();
      } else {
        toast.error("CART ID IS NOT FOUND");
      }
    })();
  }, [studentId]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-sky-200">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-sky-600 mb-4">Payment Success!</h1>
        {/* <h1 className="text-lg font-semibold text-sky-600 mb-4">Reference Number : {referenceNo}</h1> */}
        <p className="text-lg text-sky-700 mb-6">Thank you for your payment. Your order has been successfully processed.</p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/enrolled-course"
            className="bg-sky-600 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
          >
            Enrolled Courses
          </Link>
          <button
            className="bg-green-700 hover:bg-gray-500 text-white px-4 py-2 rounded focus:outline-none focus:ring focus:ring-gray-300"
            onClick={() => {
              navigate('/');
            }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
