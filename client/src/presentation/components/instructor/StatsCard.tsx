import React from "react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: JSX.Element;
  color?: string; 
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, color }) => {
  return (
    <div
      className={`flex items-center p-6 rounded-lg shadow-lg ${
        color || "bg-gradient-to-r from-blue-500 to-purple-500"
      } text-white`}
    >
      <div className="text-4xl">{icon}</div>
      <div className="ml-4">
        <p className="text-sm uppercase font-semibold opacity-80">{label}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </div>
  );
};

export default StatsCard;
