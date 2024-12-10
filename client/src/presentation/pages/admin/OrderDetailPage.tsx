import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import TopNav from "../../components/admin/TopNav";
import api from "../../../infrastructure/api/api";
import { Card, CardContent, Typography, Button, Grid, LinearProgress, Avatar, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

interface OrderDetail {
  _id: string;
  studentId: {
    _id: string;
    username: string;
    email: string;
    image: string;
  };
  courseId: {
    _id: string;
    title: string;
    subtitle: string;
    subCategory: string;
    language: string;
    thumbnail: string;
    description: string;
  };
  tutorId: {
    _id: string;
    username: string;
    email: string;
    image: string;
  };
  status: string;
  paymentMethod: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

const OrderView: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/order-view/${orderId}`);
      const data = await response.data;
      setOrder(data.order);
    } catch (err) {
      console.error("Error fetching order detail:", err);
      setError("Failed to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>No order details found.</p>
      </div>
    );
  }

  const progressColor = order.status === "Completed" ? "success" : "primary";

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <Sidebar />
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6">
        <TopNav />
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Order Details</h1>
        <div className="grid grid-cols-1 gap-6">
          {/* Order Information and Student Information Tables */}
          <div className="flex space-x-6">
            <div className="w-1/2">
              {/* Student Information Table */}
              <Card className="shadow-lg p-4 bg-white">
                <CardContent>
                  <Typography variant="h6" className="mb-2 font-semibold text-gray-700">
                    Student Information
                  </Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Field</strong></TableCell>
                        <TableCell><strong>Details</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell><strong>Username</strong></TableCell>
                        <TableCell>{order.studentId.username}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Email</strong></TableCell>
                        <TableCell>{order.studentId.email}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Profile Image</strong></TableCell>
                        <TableCell>
                          <Avatar src={`http://localhost:5000/${order.studentId.image}`} alt={order.studentId.username} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            <div className="w-1/2">
              {/* Tutor Information Table */}
              <Card className="shadow-lg p-4 bg-white">
                <CardContent>
                  <Typography variant="h6" className="mb-2 font-semibold text-gray-700">
                    Tutor Information
                  </Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Field</strong></TableCell>
                        <TableCell><strong>Details</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell><strong>Username</strong></TableCell>
                        <TableCell>{order.tutorId.username}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Email</strong></TableCell>
                        <TableCell>{order.tutorId.email}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Profile Image</strong></TableCell>
                        <TableCell>
                          <Avatar src={`http://localhost:5000/${order.tutorId.image}`} alt={order.tutorId.username} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Course and Tutor Information Tables */}
          <div className="flex space-x-6">
            <div className="w-1/2">
              {/* Course Information Table */}
              <Card className="shadow-lg p-4 bg-white">
                <CardContent>
                  <Typography variant="h6" className="mb-2 font-semibold text-gray-700">
                    Course Information
                  </Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Field</strong></TableCell>
                        <TableCell><strong>Details</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell><strong>Title</strong></TableCell>
                        <TableCell>{order.courseId.title}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Subtitle</strong></TableCell>
                        <TableCell>{order.courseId.subtitle}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Category</strong></TableCell>
                        <TableCell>{order.courseId.subCategory}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Language</strong></TableCell>
                        <TableCell>{order.courseId.language}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Description</strong></TableCell>
                        <TableCell>{order.courseId.description}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            <div className="w-1/2">
              {/* Order Details Card */}
              <Card className="shadow-lg p-4 bg-white">
                <CardContent>
                  <Typography variant="h6" className="mb-2 font-semibold text-gray-700">
                    Order Information
                  </Typography>

                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Field</strong></TableCell>
                        <TableCell><strong>Details</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell><strong>Order ID</strong></TableCell>
                        <TableCell>{order._id}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Status</strong></TableCell>
                        <TableCell>{order.status}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Payment Method</strong></TableCell>
                        <TableCell>{order.paymentMethod}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Amount</strong></TableCell>
                        <TableCell>₹{order.amount}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Created At</strong></TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Updated At</strong></TableCell>
                        <TableCell>{new Date(order.updatedAt).toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Progress</strong></TableCell>
                        <TableCell>
                          <LinearProgress
                            variant="determinate"
                            value={order.status === "Completed" ? 100 : 50}
                            color={progressColor}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
          {/* Back Button */}
          <div className="mt-6">
            <Link to="/admin/orders">
              <Button variant="contained" color="primary">
                Back to Orders
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderView;
