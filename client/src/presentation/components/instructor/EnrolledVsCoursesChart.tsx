import React, { useEffect, useState } from "react";
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
import api from "../../../infrastructure/api/api";
import { ChartData } from 'chart.js/auto';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const EnrolledVsCoursesChart = () => {
  const [chartData, setChartData] = useState<ChartData<"line", number[], unknown>>({
    labels: [],
    datasets: [],
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const enrolledResponse = await api.get("/instructor/coursesCount");
        const myCoursesResponse = await api.get("/instructor/my-courses/coursesCount");

        const enrolledCourses = enrolledResponse.data.count;
        const totalCourses = myCoursesResponse.data.count;

        setChartData({
          labels: ["Enrolled Courses", "Total Courses"],
          datasets: [
            {
              label: "Courses",
              data: [enrolledCourses, totalCourses],
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              tension: 0.4,
              pointBackgroundColor: "rgba(54, 162, 235, 1)",
              pointBorderColor: "#fff",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, []);

  const options: any = {
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => `${tooltipItem.dataset.label}: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#555" },
      },
      y: {
        ticks: { callback: (value: number) => value.toLocaleString() },
      },
    },
  };

  return (
    <div className="bg-gradient-to-r from-green-100 to-green-300 p-6 rounded-md shadow-md">
      <h3 className="text-xl font-semibold text-green-800 mb-4">
        Enrolled vs Total Courses
      </h3>
      <p className="text-sm text-gray-700 mb-6">
        This chart shows the enrolled courses in comparison to your total courses.
      </p>
      {chartData && <Line data={chartData} options={options} />}
      </div>
  );
};

export default EnrolledVsCoursesChart;
