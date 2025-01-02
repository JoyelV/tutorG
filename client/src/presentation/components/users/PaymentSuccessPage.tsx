import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../../infrastructure/api/api";

interface Order {
  _id: string;
  sessionId: string;
  paymentMethod: string;
  studentId: {
    username: string;
    email: string;
    image: string;
  };
  courseId: {
    _id:string;
    title: string;
    subtitle: string;
    subCategory: string;
    language: string;
    thumbnail: string;
  };
  tutorId: {
    username: string;
    email: string;
    image: string;
  };
  amount: number;
  createdAt: string;
}

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get(`/user/getorders?session_id=${sessionId}`);
        setOrders(response.data.orders);
      } catch (err: any) {
        console.error("Failed to fetch orders:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) fetchOrders();
  }, [sessionId]);

  if (loading) {
    return <div className="text-center">Loading order details...</div>;
  }

  if (!orders.length) {
    return <div className="text-center text-red-500">No orders found for this session.</div>;
  }

  return (
    <div className="mt-10">
      {/* Logo Section */}
      <div className="text-center mb-10">
        <img src="/tutorg-logo.png" alt="TutorG Logo" className="mx-auto w-40" />
      </div>

      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-semibold text-green-600 text-center mb-6">Payment Successful!</h1>
          <p className="text-lg text-gray-700 text-center mb-6">Thank you for your payment. Below are your order details:</p>

          {orders.map((order) => (
            <div key={order._id} className="border-t pt-6">
              {/* Top Section: Student Details and Date */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-lg font-semibold">Student Details:</p>
                  <div className="flex items-center mt-2">
                    <img
                      src={`${process.env.REACT_APP_SOCKET_URL}/${order.studentId.image}`}
                      alt={order.studentId.username}
                      className="w-16 h-16 rounded-full shadow-md mr-4"
                    />
                    <div>
                      <p className="text-md font-medium">{order.studentId.username}</p>
                      <p className="text-sm text-gray-500">{order.studentId.email}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Purchase:</p>
                  <p className="text-md font-medium text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Course and Instructor Details Section */}
              <div className="border rounded-md p-4 mb-6">
                <table className="table-auto w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2">Thumbnail</th>
                      <th className="py-2">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-4">
                        <img
                          src={order.courseId.thumbnail}
                          alt={order.courseId.title}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      </td>
                      <td className="py-4">
                        <p className="text-md font-semibold">{order.courseId.title}</p>
                        <p className="text-sm text-gray-500">{order.courseId.subtitle}</p>
                        <p className="text-sm text-gray-500">Category: {order.courseId.subCategory}</p>
                        <p className="text-sm text-gray-500">Language: {order.courseId.language}</p>
                        <button
                          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          onClick={() => navigate(`/enrolled-singlecourse/${order.courseId._id}`)}
                        >
                          Go to Course Page
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4">
                        <img
                          src={`${process.env.REACT_APP_SOCKET_URL}/${order.tutorId.image}`}
                          alt={order.tutorId.username}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </td>
                      <td className="py-4">
                        <p className="text-md font-medium">Instructor: {order.tutorId.username}</p>
                        <p className="text-sm text-gray-500">{order.tutorId.email}</p>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="py-4">
                        <p className="text-sm text-gray-500">Payment Method: {order.paymentMethod}</p>
                        <p className="text-sm font-medium">Amount: ₹{order.amount}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* Footer Section */}
          <div className="text-center mt-10">
            <p className="text-sm text-gray-600">Thank you for your purchase! We hope you enjoy your course.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
