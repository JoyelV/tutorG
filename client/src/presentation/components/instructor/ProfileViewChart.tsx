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

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const ProfileViewChart = () => {
  const data = {
    labels: ["Aug 01", "Aug 10", "Aug 20", "Aug 31"],
    datasets: [
      {
        label: "Profile Views",
        data: [120, 200, 150, 300],
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        tension: 0.4,
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(54, 162, 235, 1)",
      },
    ],
  };

  const options: any = {
    plugins: {
      legend: {
        display: true,
        position: "top" as const, // Explicitly typing the position for TypeScript compatibility
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
            `${tooltipItem.raw.toLocaleString()} views on ${tooltipItem.label}`,
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
          callback: (value: number) => `${value} views`,
        },
      },
    },
  };

  return (
    <div className="bg-gradient-to-r from-green-100 to-green-300 p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold text-green-800 mb-4">
        Profile Views Overview
      </h3>
      <p className="text-sm text-gray-700 mb-6">
        This chart shows the number of profile views over the month. Monitor peaks in student interest and engagement.
      </p>
      <Line data={data} options={options} />
    </div>
  );
};

export default ProfileViewChart;
