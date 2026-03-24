import React from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaUser, FaMapMarkerAlt, FaCreditCard, FaCalendarAlt, FaTag } from 'react-icons/fa';

const DetailedOrder = ({ order, statusControls }) => {
  if (!order) return null;

  // Helper for refund badge color
  const getRefundBadgeClass = (status) => {
    if (status === 'Refund Successful') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'Refund Processed') return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner: Basic Info & Status Badges */}
      <div className="card-surface p-5 flex items-center justify-between flex-wrap gap-4 shadow-sm border border-slate-200 rounded-2xl bg-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-xl">
             <FaBox />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Order Reference</div>
            <div className="text-lg font-black text-slate-900">#{order.orderId}</div>
          </div>
        </div>

        <div className="flex gap-2.5 items-center flex-wrap">
          <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold border ${order.payStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
            PAYMENT: {order.payStatus?.toUpperCase()}
          </span>
          <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold border ${order.orderStatus === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`}>
            STATUS: {order.orderStatus?.toUpperCase() || 'PROCESSING'}
          </span>
          {order.orderStatus === 'Cancelled' && (
            <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold border ${getRefundBadgeClass(order.refundStatus)}`}>
              REFUND: {order.refundStatus?.toUpperCase() || 'PENDING'}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Unified Metadata Grid Card */}
        <div className="card-surface overflow-hidden p-0 shadow-sm border border-slate-200 rounded-2xl bg-white">
          <div className="px-5 py-4 border-b border-slate-100 font-extrabold bg-slate-50 text-slate-800 text-xs uppercase tracking-widest">
             {statusControls ? 'Order Summary & Fulfillment' : 'Order Summary'}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-100">
            {/* Customer Column */}
            <div className="p-5 border-r border-slate-100">
              <div className="mb-4">
                 <div className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1.5">
                    <FaUser className="text-indigo-400" /> Customer
                 </div>
                 <div className="text-sm font-bold text-slate-900">{order.userShippingAddress?.name || 'Guest User'}</div>
                 <div className="text-[10px] text-slate-500 font-mono tracking-tight">{order.userId}</div>
              </div>
              <div className="pt-4 border-t border-slate-50">
                 <div className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1.5">
                    <FaCreditCard className="text-indigo-400" /> Payment Details
                 </div>
                 <div className="text-xs font-bold text-green-600">ID: {order.paymentId}</div>
                 <div className="text-[11px] text-slate-500">Method: Online Transaction</div>
              </div>
            </div>

            {/* Status & Date Column */}
            <div className="p-5">
              <div className="mb-4">
                 <div className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1.5">
                    <FaCalendarAlt className="text-indigo-400" /> Placement Date
                 </div>
                 <div className="text-sm font-bold text-slate-900">{new Date(order.orderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                 <div className="text-[11px] text-slate-500 font-medium">{new Date(order.orderDate).toLocaleTimeString('en-IN')}</div>
              </div>

              {statusControls && (
                <div className="pt-4 border-t border-slate-50">
                   {statusControls}
                </div>
              )}
            </div>
          </div>

          {/* Full Width Shipping Section */}
          <div className="p-5 bg-slate-50/50">
             <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-indigo-400" /> Shipping Destination
             </div>
             <div className="flex justify-between items-end flex-wrap gap-4">
                <div>
                  <div className="text-sm font-bold text-slate-900 leading-snug">{order.userShippingAddress?.address}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    {order.userShippingAddress?.city}, {order.userShippingAddress?.state}, {order.userShippingAddress?.pincode}
                  </div>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 font-bold text-indigo-600 text-sm shadow-sm">
                   📞 {order.userShippingAddress?.phoneNumber}
                </div>
             </div>
          </div>
        </div>

        {/* Items Table Card */}
        <div className="card-surface overflow-hidden p-0 shadow-sm border border-slate-200 rounded-2xl bg-white">
          <div className="px-5 py-4 border-b border-slate-100 font-bold flex items-center gap-2.5 bg-slate-50 text-slate-800 text-sm">
            <FaTag className="text-indigo-500" /> Order Registry
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-5 py-3 text-[10px] font-black uppercase text-slate-400 tracking-wider">Product Description</th>
                  <th className="px-5 py-3 text-[10px] font-black uppercase text-slate-400 tracking-wider text-right">Price</th>
                  <th className="px-5 py-3 text-[10px] font-black uppercase text-slate-400 tracking-wider text-center">Quantity</th>
                  <th className="px-5 py-3 text-[10px] font-black uppercase text-slate-400 tracking-wider text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.orderItems.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg p-1.5 flex items-center justify-center flex-shrink-0 ring-1 ring-slate-200">
                          <img src={item.productId?.image} alt="" className="max-w-full max-h-full object-contain" />
                        </div>
                        <div>
                           <span className="font-bold text-slate-900 block text-sm leading-tight">
                             {item.productId?.name}
                           </span>
                           {item.selectedSize && <span className="inline-block mt-1 text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">SIZE: {item.selectedSize}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right text-slate-500 text-xs font-semibold">₹{Number(item.productId?.price || 0).toLocaleString('en-IN')}</td>
                    <td className="px-5 py-4 text-center font-bold text-slate-700">{item.quantity}</td>
                    <td className="px-5 py-4 text-right font-black text-slate-900 border-l border-transparent">₹{Number(item.totalPrice).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50/50">
                <tr>
                  <td colSpan="2" className="px-5 py-4 text-right font-bold text-slate-400 text-xs">Final Tally</td>
                  <td className="px-5 py-4 text-center font-black text-slate-800">{order.orderItems.reduce((acc, item) => acc + item.quantity, 0)} Units</td>
                  <td className="px-5 py-4 text-right font-black text-indigo-600 text-lg">₹{Number(order.amount).toLocaleString('en-IN')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedOrder;