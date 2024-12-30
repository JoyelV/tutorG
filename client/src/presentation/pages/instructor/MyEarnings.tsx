import { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import DashboardHeader from "../../components/instructor/DashboardHeader";
import Sidebar from "../../components/instructor/Sidebar";
import api from "../../../infrastructure/api/api";
import { useElements, useStripe } from '@stripe/react-stripe-js';
import { useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ChartData {
  bar: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }>;
  };
  pie: {
    labels: string[];
    datasets: Array<{
      data: number[];
      backgroundColor: string[];
    }>;
  };
}

const Earnings = () => {
  const [stats, setStats] = useState<{
    totalRevenue: number;
    currentBalance: number;
    totalWithdrawals: number;
  }>({
    totalRevenue: 0,
    currentBalance: 0,
    totalWithdrawals: 0,
  });

  const [chartData, setChartData] = useState<ChartData>({
    bar: { labels: [], datasets: [] },
    pie: { labels: [], datasets: [] },
  });

  const [openModal, setOpenModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawalHistory, setWithdrawalHistory] = useState<any[]>([]);  
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; 
  const totalPages = Math.ceil(withdrawalHistory.length / rowsPerPage);

  const paginatedData = withdrawalHistory.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const stripe = useStripe();
  const elements = useElements();

  const handleWithdrawSubmit = async () => {
    if (!withdrawAmount) return;

    try {
      const response = await api.post("/instructor/create-checkout-session", {
        amount: withdrawAmount,
      });

      const { sessionId } = response.data;

      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
          console.error('Error redirecting to checkout', error);
          alert('Something went wrong. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error during withdrawal:', error);
      alert('An error occurred while processing the withdrawal.');
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const coursesResponse = await api.get("/instructor/coursesCount");
        const myCoursesResponse = await api.get("/instructor/my-courses/coursesCount");
        const studentsResponse = await api.get("/instructor/studentsCount");
        const earningsResponse = await api.get("/instructor/earningsCount");
        const response = await api.get("/instructor/getEarningDetails");
        const historyResponse = await api.get("/instructor/getWithdrawalHistory");  

        const currentBalance = response.data.currentBalance;
        const totalWithdrawals = response.data.totalWithdrawals;

        const totalCourses = coursesResponse.data.count || 0;
        const myCourses = myCoursesResponse.data.count || 0;
        const totalStudents = studentsResponse.data.count || 0;
        const earnings = earningsResponse.data.totalEarnings || 0;

        setStats({
          totalRevenue: earnings,
          currentBalance: currentBalance,
          totalWithdrawals: totalWithdrawals,
        });

        setWithdrawalHistory(historyResponse.data.withdrawalHistory);

        setChartData({
          bar: {
            labels: ["Total Courses", "My Courses", "Students", "Earnings"],
            datasets: [
              {
                label: "Statistics",
                data: [totalCourses, myCourses, totalStudents, earnings],
                backgroundColor: [
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                ],
                borderColor: [
                  "rgba(75, 192, 192, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(255, 99, 132, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
          pie: {
            labels: ["Total Courses", "My Courses", "Students", "Earnings"],
            datasets: [
              {
                data: [totalCourses, myCourses, totalStudents, earnings],
                backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
              },
            ],
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStats();
    
   const queryParams = new URLSearchParams(location.search);
   if (queryParams.get("session_id")) {
     toast.success("Payment successful! Your withdrawal has been processed.", {
      position: "top-right", 
     });
   }
 }, [location.search]); 

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <Sidebar />
      </aside>

      {/* Main content area */}
      <div className="flex-1 bg-gray-100 ml-10 pt-20">
        {/* Fixed Dashboard Header */}
        <div className="fixed top-0 left-0 right-0 bg-gray-800">
          <DashboardHeader />
        </div>

        {/* Main Content */}
        <main className="ml-2 p-2">
          <Typography variant="h5" className="mb-4">
            Good Morning, My Earnings
          </Typography>

          {/* Statistics Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[{ label: "Total Revenue", value: stats.totalRevenue },
            { label: "Current Balance", value: stats.currentBalance },
            { label: "Total Withdrawals", value: stats.totalWithdrawals },
            ].map((stat, index) => (
              <Card
                key={index}
                className={`p-2 text-white ${index % 2 === 0
                    ? "bg-gradient-to-r from-blue-500 to-purple-600"
                    : "bg-gradient-to-r from-green-400 to-teal-500"
                  }`}
              >
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center ${index % 2 === 0 ? "bg-blue-700" : "bg-green-600"
                        }`}
                    >
                      <span className="text-xl font-bold">{index + 1}</span>
                    </div>
                    <Typography variant="h6" className="font-bold text-right">
                      {stat.value}
                    </Typography>
                  </div>
                  <Typography variant="subtitle2" className="mt-4 opacity-90">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Graph Section */}
          <div className="bg-white p-6 rounded shadow-md mb-8">
            <Typography variant="subtitle1" className="font-semibold mb-4">
              Statistics Overview
            </Typography>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-60">
                <Bar data={chartData.bar} options={{ maintainAspectRatio: false }} />
              </div>
              <div className="h-60">
                <Pie data={chartData.pie} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          {/* Withdraw Section */}
          <Button variant="contained" color="warning" onClick={handleOpenModal}>
            Withdraw Money
          </Button>

          {/* Withdraw Modal */}
          <Dialog open={openModal} onClose={handleCloseModal}>
            <DialogTitle>Withdraw Money</DialogTitle>
            <DialogContent>
              <Typography variant="subtitle1" className="mb-4">
                Enter the amount you want to withdraw
              </Typography>
              <TextField
                label="Amount"
                variant="outlined"
                type="number"
                fullWidth
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                margin="normal"
              />
              <Typography variant="body2" className="mt-2">
                Note: Your withdrawal will be processed through Stripe.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} color="primary">
                Cancel
              </Button>
              <Button onClick={handleWithdrawSubmit} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </main>
        {/* Withdraw History Table */}
    <div className="bg-white p-4 rounded shadow-md">
      <Typography variant="subtitle1" className="font-semibold mb-4">
        Withdraw History
      </Typography>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="border-b py-2">Date</th>
            <th className="border-b py-2">Method</th>
            <th className="border-b py-2">Amount</th>
            <th className="border-b py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((transaction, index) => (
            <tr key={index}>
              <td className="py-2">{new Date(transaction.date).toLocaleDateString()}</td>
              <td className="py-2">{transaction.method}</td>
              <td className="py-2">₹{transaction.amount}</td>
              <td className="py-2">
                <span className={`text-${transaction.status === "completed" ? "green" : "red"}-500`}>
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-end mt-4">
        <Button
          variant="contained"
          color="primary"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="mr-2"
        >
          Previous
        </Button>
        {[...Array(totalPages)].map((_, index) => (
          <Button
            key={index}
            variant="contained"
            color={currentPage === index + 1 ? "secondary" : "primary"}
            onClick={() => handlePageChange(index + 1)}
            className="mx-1"
          >
            {index + 1}
          </Button>
        ))}
        <Button
          variant="contained"
          color="primary"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Earnings;
