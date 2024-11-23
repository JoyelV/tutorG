import React from 'react';
import { Line } from 'react-chartjs-2';

const RevenueChart = () => {
  const data = {
    labels: ['Aug 01', 'Aug 10', 'Aug 20', 'Aug 31'],
    datasets: [
      {
        label: 'Revenue',
        data: [100000, 150000, 120000, 175000],
        fill: false,
        borderColor: 'blue',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold">Revenue</h3>
      <Line data={data} />
    </div>
  );
};

export default RevenueChart;
