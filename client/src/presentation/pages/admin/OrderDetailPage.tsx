import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import TopNav from "../../components/admin/TopNav";
import api from "../../../infrastructure/api/api";
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Avatar, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Grid, 
  Box, 
  CircularProgress 
} from "@mui/material";

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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>No order details found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      <Box sx={{ width: 250, bgcolor: 'background.paper' }}>
        <Sidebar />
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3 }}>
        <TopNav />
        <Typography variant="h4" gutterBottom>
          Order Details
        </Typography>

        <Grid container spacing={3}>
          {/* Student and Tutor Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Student Information</Typography>
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
                        <Avatar src={order.studentId.image} alt={order.studentId.username} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Tutor Information</Typography>
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
                        <Avatar src={order.tutorId.image} alt={order.tutorId.username} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>

          {/* Course and Order Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Course Information</Typography>
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
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Order Information</Typography>
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
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Back Button */}
        <Box sx={{ mt: 3 }}>
          <Link to="/admin/orders">
            <Button variant="contained" color="primary">
              Back to Orders
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderView;
