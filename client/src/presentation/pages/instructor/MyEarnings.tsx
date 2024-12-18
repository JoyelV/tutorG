import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import DashboardHeader from "../../components/instructor/DashboardHeader";
import Sidebar from "../../components/instructor/Sidebar";
import api from "../../../infrastructure/api/api"; 
import { assets } from "../../../assets/assets_user/assets";

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
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const coursesResponse = await api.get("/instructor/coursesCount");
        const myCoursesResponse = await api.get("/instructor/my-courses/coursesCount");
        const studentsResponse = await api.get("/instructor/studentsCount");
        const earningsResponse = await api.get("/instructor/earningsCount");
        const response = await api.get("/instructor/getEarningDetails");
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
  }, []);

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
        <main className="ml-4 p-4">
          <Typography variant="h5" className="mb-4">
            Good Morning, My Earnings
          </Typography>

          {/* Statistics Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Revenue", value: stats.totalRevenue },
              { label: "Current Balance", value: stats.currentBalance },
              { label: "Total Withdrawals", value: stats.totalWithdrawals },
            ].map((stat, index) => (
              <Card
                key={index}
                className={`p-4 text-white ${
                  index % 2 === 0
                    ? "bg-gradient-to-r from-blue-500 to-purple-600"
                    : "bg-gradient-to-r from-green-400 to-teal-500"
                }`}
              >
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center ${
                        index % 2 === 0 ? "bg-blue-700" : "bg-green-600"
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
                <Bar
                  data={chartData.bar}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
              <div className="h-60">
                <Pie
                  data={chartData.pie}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            </div>
          </div>

          {/* Withdraw Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded shadow-md">
              <Typography color="textSecondary" className="mb-2">
                Payment Method:
              </Typography>
              <div className="flex items-center mb-4">
                <img src={assets.stripe_logo} alt="Stripe" className="h-8" />
                <Typography className="ml-2 text-sm text-gray-500">
                  Your withdrawal will be processed via Stripe.
                </Typography>
              </div>
              <Typography variant="h6" className="font-bold mb-4">
                {stats.currentBalance}
              </Typography>
              <Button variant="contained" color="warning">
                Withdraw Money
              </Button>
            </div>
            <div className="bg-white p-6 rounded shadow-md">
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
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <tr key={index}>
                        <td className="py-2">21 Sep, 2021</td>
                        <td className="py-2">Mastercard</td>
                        <td className="py-2">₹5000.00</td>
                        <td className="py-2">
                          <span className="text-green-500">Completed</span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Earnings;
