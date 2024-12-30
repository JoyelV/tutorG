import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import TopNav from "../../components/admin/TopNav";
import api from "../../../infrastructure/api/api";
import { CircularProgress, Box, Typography, TextField, Pagination } from '@mui/material';
import { useNavigate } from "react-router-dom";

interface Order {
  _id: string;
  studentId: { username: string };
  courseId: { title: string; category: string };
  tutorId: { username: string };
  status: string;
  paymentMethod: string;
  amount: number;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

const OrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 5;

  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/admin/orders`, {
          params: {
            page: currentPage,
            limit: ordersPerPage,
          },
        });

        const data = response.data;
        setOrders(data.orders);
        setFilteredOrders(data.orders);
        setTotalPages(data.totalPages);
        setTotalAmount(data.orders.reduce((sum: number, order: Order) => sum + order.amount, 0));
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = orders.filter(order =>
      order.studentId.username.toLowerCase().includes(term) ||
      order.courseId.title.toLowerCase().includes(term) ||
      order.courseId.category.toLowerCase().includes(term) ||
      order.tutorId.username.toLowerCase().includes(term) ||
      order.status.toLowerCase().includes(term)
    );

    setFilteredOrders(filtered);
    const total = filtered.reduce(
      (sum: number, order: Order) => sum + order.amount,
      0
    );
    setTotalAmount(total);
  };

  const handleView = (orderId: string) => {
    navigate(`/admin/orderDetail/${orderId}`);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <TopNav />
        <div className="pt-6 p-3 overflow-y-auto h-full">
          {loading ? (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              height="100vh"
              bgcolor="#f9f9f9"
            >
              <CircularProgress color="primary" size={50} />
              <Typography variant="h6" color="textSecondary" mt={2}>
                Loading, please wait...
              </Typography>
            </Box>
          ) : (
            <>
              <div className="pt-16 p-6 overflow-y-auto h-full">
                <div className="mb-4 flex justify-between items-center">
                  <h1 className="text-2xl font-bold">ORDERS MANAGEMENT</h1>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search Orders"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <table className="w-full border-collapse border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="px-6 py-3 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course Title
                      </th>
                      <th className="px-6 py-3 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tutor Name
                      </th>
                      <th className="px-6 py-3 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-6 py-3 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map(order => (
                      <tr key={order._id}>
                        <td className="px-6 py-4">{order.studentId.username}</td>
                        <td className="px-6 py-4">{order.courseId.title}</td>
                        <td className="px-6 py-4">{order.courseId.category}</td>
                        <td className="px-6 py-4">{order.tutorId.username}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                              }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">{order.paymentMethod}</td>
                        <td className="px-6 py-4">₹{order.amount}</td>
                        <td className="px-6 py-4">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleView(order._id)}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 text-right font-bold text-gray-700">
                  Total Order Amount: ₹{totalAmount}
                </div>
                <Box display="flex" justifyContent="center" mt={4}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
