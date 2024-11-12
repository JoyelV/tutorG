import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: JSX.Element;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon }) => {
  return (
    <div className="flex items-center bg-white p-4 rounded-lg shadow">
      <div className="text-orange-500">{icon}</div>
      <div className="ml-4">
        <p className="text-gray-500">{label}</p>
        <h3 className="text-xl font-semibold">{value}</h3>
      </div>
    </div>
  );
};

export default StatsCard;
