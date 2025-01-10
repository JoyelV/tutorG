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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<string>('desc');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const response = await api.get(`/user/purchase-history`, {
          params: {
            userId,
            page: currentPage,
            limit: 7,
            sort: sortOrder,
            direction: sortDirection,
          },
        });

        if (response.status === 204) {
          setError('No purchase history, Please purchase a course');
        } else {
          setOrders(response.data.orders);
          setTotalPages(response.data.totalPages);
        }
      } catch (err) {
        setError('Failed to fetch purchase history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, [userId, currentPage, sortOrder, sortDirection]);

  const handleSortChange = (sortBy: string) => {
    if (sortBy === sortOrder) {
      setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortOrder(sortBy);
      setSortDirection('asc');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-4xl mx-auto p-4 sm:p-6 flex flex-col">
      {orders.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer"
                    onClick={() => handleSortChange('courseId.title')}
                  >
                    Course Title
                  </th>
                  <th
                    className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer"
                    onClick={() => handleSortChange('tutorId.username')}
                  >
                    Tutor
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Payment Method
                  </th>
                  <th
                    className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer"
                    onClick={() => handleSortChange('createdAt')}
                  >
                    Purchase Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t">
                    <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-700">
                      {order.courseId.title}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">
                      {order.tutorId.username}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">
                      ₹{order.amount.toFixed(2)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">
                      {order.paymentMethod}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap justify-center items-center mt-4 space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg disabled:bg-gray-300"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="flex-grow flex items-center justify-center text-gray-500">
          No purchase history available.
        </div>
      )}
    </div>
  );
};

export default PurchaseHistoryPage;
