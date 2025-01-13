import { useEffect, useState } from "react";
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

const EarningsVsCoursesChart = () => {
  const [chartData, setChartData] = useState<ChartData<"line", number[], unknown>>({
    labels: [],
    datasets: [],
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesResponse = await api.get("/instructor/my-courses/coursesCount");
        const earningsResponse = await api.get("/instructor/earningsCount");

        const totalCourses = coursesResponse.data.count;
        const totalEarnings = earningsResponse.data.totalEarnings;

        setChartData({
          labels: ["Total Courses"],
          datasets: [
            {
              label: "Earnings (₹)",
              data: [totalEarnings],
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              tension: 0.4,
              pointBackgroundColor: "rgba(75, 192, 192, 1)",
              pointBorderColor: "#fff",
            },
            {
              label: "Total Courses",
              data: [totalCourses],
              backgroundColor: "rgba(255, 159, 64, 0.2)",
              borderColor: "rgba(255, 159, 64, 1)",
              tension: 0.4,
              pointBackgroundColor: "rgba(255, 159, 64, 1)",
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
    <div className="bg-gradient-to-r from-blue-100 to-blue-300 p-6 rounded-md shadow-md">
      <h3 className="text-xl font-semibold text-blue-800 mb-4">Earnings vs Total Courses</h3>
      <p className="text-sm text-gray-700 mb-6">
        This chart compares the earnings with the total number of courses.
      </p>
      {chartData && <Line data={chartData} options={options} />}
      </div>
  );
};

export default EarningsVsCoursesChart;
