import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const RevenueChart = () => {
  const data = {
    labels: ["Aug 01", "Aug 10", "Aug 20", "Aug 31"],
    datasets: [
      {
        label: "Revenue (₹)",
        data: [100000, 150000, 120000, 175000],
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.4,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  const options: any = {
    plugins: {
      legend: {
        display: true,
        position: "top" as const, // Explicitly type the string to match the enum
        labels: {
          color: "#333",
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) =>
            `₹${tooltipItem.raw.toLocaleString()} earned on ${tooltipItem.label}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(200, 200, 200, 0.1)",
        },
        ticks: {
          color: "#555",
        },
      },
      y: {
        grid: {
          color: "rgba(200, 200, 200, 0.1)",
        },
        ticks: {
          color: "#555",
          callback: (value: number) => `₹${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="bg-gradient-to-r from-blue-100 to-blue-300 p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold text-blue-800 mb-4">
        Revenue Overview
      </h3>
      <p className="text-sm text-gray-700 mb-6">
        This chart shows the monthly revenue trends. Analyze spikes in revenue and identify top-performing days.
      </p>
      <Line data={data} options={options} />
    </div>
  );
};

export default RevenueChart;
