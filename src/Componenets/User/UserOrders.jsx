import React, { useContext, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaHistory, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

const UserOrders = () => {
  const { userOrder, getOrders, cancelOrder } = useContext(AppContext);

  useEffect(() => {
    getOrders();
    window.scrollTo(0, 0);
  }, []);

  // Helpers for status styling
  const getStatusClasses = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-50 text-green-700 border-green-100';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-100';
      case 'Shipped': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Out for Delivery': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getRefundClasses = (status) => {
    if (status === 'Refund Successful') return 'bg-green-100 text-green-800 border-green-200';
    if (status === 'Refund Processed') return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-amber-100 text-amber-800 border-amber-200';
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-10 px-6">
      <div className="max-w-4xl mx-auto fade-up">
        <header className="flex items-center gap-4 mb-8">
           <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
             <FaHistory className="text-xl" />
           </div>
           <div>
             <h1 className="text-2xl font-black text-slate-900 leading-tight">My Order History</h1>
             <p className="text-sm text-slate-500 font-medium">Track your shipments and manage returns</p>
           </div>
        </header>

        {!userOrder || userOrder.length === 0 ? (
          <div className="card-surface p-12 text-center mt-8 bg-white border border-slate-200 shadow-sm rounded-2xl">
            <div className="text-6xl mb-6 grayscale opacity-40">🛍️</div>
            <h2 className="text-xl font-black text-slate-800 mb-2">No orders found</h2>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto">Looks like you haven't placed any orders yet. Start your shopping journey today!</p>
            <Link to="/" className="btn-primary inline-flex items-center px-8 py-3 rounded-xl shadow-lg shadow-indigo-200">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {userOrder.map((order) => {
              const orderDate = new Date(order.orderDate).toLocaleDateString('en-IN', {
                year: 'numeric', month: 'long', day: 'numeric'
              });

              return (
                <div key={order._id} className="card-surface p-0 bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                  {/* Card Header: Metadata */}
                  <div className="px-6 py-5 bg-slate-50/50 border-b border-slate-100 flex flex-wrap gap-6 justify-between items-center">
                    <div className="flex gap-8">
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Date</div>
                        <div className="text-sm font-bold text-slate-800">{orderDate}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Paid</div>
                        <div className="text-sm font-bold text-indigo-600">₹{Number(order.amount).toLocaleString('en-IN')}</div>
                      </div>
                      <div className="hidden sm:block">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ship to</div>
                        <div className="text-sm font-bold text-slate-800">{order.userShippingAddress?.name}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order ID</div>
                       <div className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">#{order.orderId}</div>
                    </div>
                  </div>

                  {/* Card Body: Items and Status */}
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-8">
                       {/* Left: Items List */}
                       <div className="flex-1 space-y-4">
                         {order.orderItems?.map((item, idx) => (
                           <div key={idx} className="flex items-center gap-4 group">
                             <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-lg p-2 flex items-center justify-center flex-shrink-0">
                                <img src={item.productId?.image} alt="" className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform" />
                             </div>
                             <div className="flex-1 min-w-0">
                               <Link to={`/product/${item.productId?._id}`} className="font-bold text-slate-800 hover:text-indigo-600 transition-colors block truncate text-sm">
                                 {item.productId?.name || 'Item'}
                               </Link>
                               <div className="text-xs text-slate-500 mt-1 flex gap-3 font-medium">
                                 <span>Qty: {item.quantity}</span>
                                 {item.selectedSize && <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-black text-slate-600">SIZE: {item.selectedSize}</span>}
                                 <span className="text-slate-900 font-bold ml-auto">₹{Number(item.totalPrice).toLocaleString('en-IN')}</span>
                               </div>
                             </div>
                           </div>
                         ))}
                       </div>

                       {/* Right: Fulfillment & Actions */}
                       <div className="lg:w-64 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-6 flex flex-col justify-between gap-4">
                          <div className="space-y-3">
                             {/* Delivery Status */}
                             <div>
                               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Fulfillment</div>
                               <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold ${getStatusClasses(order.orderStatus)}`}>
                                 {order.orderStatus === 'Delivered' ? <FaCheckCircle /> : <FaClock />}
                                 {order.orderStatus?.toUpperCase() || 'PROCESSING'}
                               </div>
                             </div>

                             {/* Refund Status (if cancelled) */}
                             {order.orderStatus === 'Cancelled' && (
                               <div>
                                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Refund Progress</div>
                                 <div className={`px-3 py-2 rounded-lg border text-xs font-bold ${getRefundClasses(order.refundStatus)}`}>
                                   {order.refundStatus === 'Refund Successful' ? '✅ Money Returned' : `🔄 ${order.refundStatus || 'Pending'}`}
                                 </div>
                               </div>
                             )}
                          </div>

                          {/* Cancellation Button */}
                          {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                             <button 
                               onClick={async () => {
                                 if (confirm('Are you sure you want to cancel this order? This action will initiate your refund process according to our policy.')) {
                                   await cancelOrder(order._id);
                                   getOrders();
                                 }
                               }}
                               className="w-full py-2.5 px-4 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                             >
                               <FaTimesCircle className="text-sm" /> Cancel Order
                             </button>
                          )}
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
