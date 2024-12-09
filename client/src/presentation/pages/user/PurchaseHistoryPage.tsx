import { useState, useEffect } from 'react';
import api from '../../../infrastructure/api/api';

interface Order {
  _id: string;
  courseId: {
    title: string;
  };
  tutorId: {
    username: string;
  };
  status: string;
  paymentMethod: string;
  amount: number;
  createdAt: string;
}

const PurchaseHistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const response = await api.get(`/user/purchase-history`);
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch purchase history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, [userId]);

  if (isLoading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Course Title</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Tutor</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Payment Method</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Purchase Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-t">
              <td className="px-6 py-4 text-sm font-medium text-gray-700">{order.courseId.title}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{order.tutorId.username}</td>
              <td className="px-6 py-4 text-sm text-gray-700">₹{order.amount.toFixed(2)}</td> 
              <td className="px-6 py-4 text-sm text-gray-700">{order.paymentMethod}</td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseHistoryPage;
