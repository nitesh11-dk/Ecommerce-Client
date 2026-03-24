import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../constants/config';
import DetailedOrder from './DetailedOrder';
import AppContext from '../../context/AppContext';

const PREDEFINED_STATUSES = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

const OrderDetailed = () => {
  const { id } = useParams();  
  const { updateOrderStatus, updateRefundStatus } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/payment/order/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Auth: token,
          },
          withCredentials: true,
        });
        setOrder(response.data.order); 
      }
    } catch (error) {
      console.error("Error fetching orders: ", error);
      setError("Failed to fetch order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();  
  }, [id]);  

  if (loading) return <div className="flex items-center justify-center min-h-[400px] text-slate-500 font-medium">Loading session...</div>;
  if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;
  if (!order) return <div className="p-10 text-center text-slate-400">No order record found.</div>;

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Go Back */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <button 
            onClick={() => window.history.back()} 
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex items-center gap-2.5 text-sm font-bold text-slate-700 shadow-sm"
          >
             <span className="text-lg">←</span> Back to Order List
          </button>
          <div className="sm:text-right">
             <h1 className="text-2xl font-black text-slate-900 leading-tight">Order Management</h1>
             <p className="text-sm text-slate-500 font-medium">Control fulfillment and manage refund lifecycles</p>
          </div>
        </div>

        {/* Integration of DetailedOrder and Status Management */}
        <DetailedOrder 
          order={order} 
          statusControls={
            <div className="flex flex-col gap-3.5">
               <div className="flex flex-col gap-1.5">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Delivery Status</label>
                 <select
                   value={order.orderStatus || 'Processing'}
                   disabled={order.orderStatus === 'Cancelled' || order.orderStatus === 'Delivered'}
                   onChange={async (e) => {
                      const success = await updateOrderStatus(order._id, e.target.value);
                      if (success) fetchOrders();
                   }}
                   className={`w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all font-bold ${
                     order.orderStatus === 'Cancelled' || order.orderStatus === 'Delivered'
                     ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                     : 'bg-white border-slate-200 text-indigo-700 focus:ring-indigo-100'
                   }`}
                   >
                   {PREDEFINED_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
               </div>

               {order.orderStatus === 'Cancelled' && (
                 <div className="flex flex-col gap-1.5 pt-1.5">
                   <label className="text-[10px] font-black text-red-500 uppercase tracking-widest">Refund Management</label>
                   <select
                     value={order.refundStatus || 'Pending'}
                     disabled={order.refundStatus === 'Refund Successful'}
                     onChange={async (e) => {
                        const success = await updateRefundStatus(order._id, e.target.value);
                        if (success) fetchOrders();
                     }}
                     className={`w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all font-bold ${
                       order.refundStatus === 'Refund Successful' 
                       ? 'bg-red-50/50 border-red-100 text-red-300 cursor-not-allowed' 
                       : 'bg-white border-red-200 text-red-600 focus:ring-red-100'
                     }`}
                   >
                     <option value="Pending">Refund Pending</option>
                     <option value="Refund Processed">Refund Processed</option>
                     <option value="Refund Successful">Refund Successful</option>
                   </select>
                 </div>
               )}
            </div>
          }
        />
      </div>
    </div>
  );
};

export default OrderDetailed;
