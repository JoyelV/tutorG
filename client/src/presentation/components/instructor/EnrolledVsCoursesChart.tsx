import { Bar, Pie } from "react-chartjs-2";
import { useState, useEffect } from "react";

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

const ChartComponent = () => {
  const [chartData, setChartData] = useState<ChartData>({
    bar: { labels: [], datasets: [] },
    pie: { labels: [], datasets: [] },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalCourses = 10;
        const myCourses = 5;
        const totalStudents = 50;
        const earnings = 1000;

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
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex items-center justify-between">
      <div className="w-1/2 h-80">
        <Bar data={chartData.bar} options={{ maintainAspectRatio: false }} />
      </div>
      <div className="w-1/2 h-80">
        <Pie data={chartData.pie} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default ChartComponent;
