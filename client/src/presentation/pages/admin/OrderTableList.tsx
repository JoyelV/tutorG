import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import TopNav from "../../components/admin/TopNav";
import api from "../../../infrastructure/api/api";
import { useNavigate } from "react-router-dom";

interface Order {
  _id: string;
  studentId: string;
  courseId: string;
  tutorId: string;
  status: string;
  paymentMethod: string;
  amount: number;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

const OrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = async (page: number) => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/orders?page=${page}&limit=10`);
      const data = await response.data;
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const handleView = (orderId: string) => {
    navigate(`/admin/orderDetail/${orderId}`);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <TopNav />
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Order Management</h1>
        <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutor ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.studentId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.studentId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.courseId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.tutorId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.paymentMethod}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => handleView(order._id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center ">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded disabled:opacity-50"
          >
            Previous
          </button>
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default OrdersTable;
