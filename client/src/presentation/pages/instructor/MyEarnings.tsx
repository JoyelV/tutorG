import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import DashboardHeader from "../../components/instructor/DashboardHeader";
import Sidebar from "../../components/instructor/Sidebar";
import { assets } from "../../../assets/assets_user/assets";

const Earnings = () => {
  const stats = [
    { label: "Total Revenue", value: "₹13,804.00" },
    { label: "Current Balance", value: "₹8,593.00" },
    { label: "Total Withdrawals", value: "₹13,184.00" },
    { label: "Today Revenue", value: "₹1620.00" },
  ];

  const barChartData = {
    labels: ["Orders", "Students", "Instructors", "Courses Enrolled"],
    datasets: [
      {
        label: "Statistics",
        data: [200, 150, 10, 120],
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
  };

  const pieChartData = {
    labels: ["Orders", "Students", "Instructors", "Courses Enrolled"],
    datasets: [
      {
        data: [200, 150, 10, 120],
        backgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#4BC0C0",
        ],
      },
    ],
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
        <main className="ml-4 p-4">
          <Typography variant="h5" className="mb-4">
            Good Morning, My Earnings
          </Typography>

          {/* Statistics Cards */}
<div className="grid grid-cols-4 gap-4 mb-8">
  {stats.map((stat, index) => (
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
          {/* Icon Placeholder */}
          <div
            className={`h-12 w-12 rounded-full flex items-center justify-center ${
              index % 2 === 0 ? "bg-blue-700" : "bg-green-600"
            }`}
          >
            <span className="text-xl font-bold">{index + 1}</span>
          </div>
          {/* Statistic Value */}
          <Typography variant="h6" className="font-bold text-right">
            {stat.value}
          </Typography>
        </div>
        {/* Statistic Label */}
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
                <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
              </div>
              <div className="h-60">
                <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
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
                <img src={assets.stripe_logo} alt="PayPal" className="h-8" />
                <Typography className="ml-2 text-sm text-gray-500">
                  Your withdrawal will be processed via Stripe.
                </Typography>
              </div>
              <Typography variant="h6" className="font-bold mb-4">
                ₹16,593.00
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
