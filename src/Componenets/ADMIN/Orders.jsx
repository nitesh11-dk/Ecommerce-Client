import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/config';
import { Link } from 'react-router-dom';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/payment/allorders`, {
          headers: {
            "Content-Type": "application/json",
            Auth: token,
          },
          withCredentials: true,
        });

        setOrders(response.data.orders); 
      }
    } catch (error) {
      console.error("Error fetching orders: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-white bg-gray-900 min-h-screen flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-200">All Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {orders.length > 0 ? (
          orders.map((order) => (
           <Link to={`/adminpanel/orders/${order._id}`}  key={order._id}>
            <div
              
              className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700"
            >
              <h2 className="text-md font-bold mb-4 text-gray-100">Order ID: {order.orderId}</h2>
              <p className="text-lg text-gray-400 mb-2">
                <span className="font-semibold text-gray-300">Payment Status:</span> {order.payStatus}
              </p>
              <p className="text-lg text-gray-400 mb-2">
                <span className="font-semibold text-gray-300">Payment ID:</span> {order.paymentId}
              </p>
              <p className="text-lg text-gray-400 mb-4">
                <span className="font-semibold text-gray-300">Total Amount:</span>  (₹{order.amount})
              </p>
              <p className="text-lg text-gray-400 mb-2">
                <span className="font-semibold text-gray-300">Order Date:</span> {new Date(order.orderDate).toLocaleDateString()}
              </p>
              <p className="text-lg text-gray-400 mb-2">
                <span className="font-semibold text-gray-300">User ID:</span> {order._id}
              </p>
            </div></Link>
          ))
        ) : (
          <div className="col-span-full text-center text-lg text-gray-400">
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
