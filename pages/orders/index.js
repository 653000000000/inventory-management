import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/orders');
        setOrders(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setErrorMessage('Failed to fetch orders.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (errorMessage) return <div>{errorMessage}</div>;

  const calculateTotalCost = (order) => {
    return order.products.reduce((total, product) => {
      // Check if product still exists before accessing price
      if (product.productId) {
        return total + product.productId.price * product.quantity;
      }
      return total; // Skip the product if it has been deleted
    }, 0);
  };

  return (
    <div>
      <h1 className="font-bold text-3xl mb-4 text-white text-center">Orders page</h1>

      <div className="flex justify-end mb-4">
        <Link href="/orders/new" className="bg-blue-500 text-white p-2 rounded-lg">
          Add New Order
        </Link>
      </div>

      {!orders.length ? (
        <div className="text-white text-center">No orders found.</div>
      ) : (
        <table className="min-w-full table-auto bg-black text-white border-collapse border border-gray-800">
          <thead>
            <tr>
              <th className="border border-gray-800 px-4 py-2 text-center">Order ID</th>
              <th className="border border-gray-800 px-4 py-2 text-center">Customer Name</th>
              <th className="border border-gray-800 px-4 py-2 text-center">Status</th>
              <th className="border border-gray-800 px-4 py-2 text-center">Total Cost</th>
              <th className="border border-gray-800 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="text-center">
                <td className="border border-gray-800 px-4 py-2 text-center">{order._id}</td>
                <td className="border border-gray-800 px-4 py-2 text-center">{order.customerName}</td>
                <td className="border border-gray-800 px-4 py-2 text-center">{order.status}</td>
                <td className="border border-gray-800 px-4 py-2 text-center">
                  ${calculateTotalCost(order).toFixed(2)}
                </td>
                <td className="border border-gray-800 px-4 py-2 text-center">
                  <Link href={`/orders/${order._id}`} className="text-blue-500 underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link href="/" className="bg-gray-500 text-white p-2 mt-4 inline-block text-center">
        Back to Home
      </Link>
    </div>
  );
}
