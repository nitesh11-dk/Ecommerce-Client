import React from 'react'
import { Link } from 'react-router-dom'

const Detailed = ({order}) => {
  return (
    <div className="flex flex-col items-center md:flex-row gap-10">
      
          <div className="flex-1">
            <h2 className="text-3xl font-semibold mb-4 text-gray-200">Order Items</h2>
            <table className="w-full bg-gray-900 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-4 py-2 border border-gray-600 text-left">Product Image</th>
                  <th className="px-4 py-2 border border-gray-600 text-left">Product Name</th>
                  <th className="px-4 py-2 border border-gray-600 text-left">Price</th>
                  <th className="px-4 py-2 border border-gray-600 text-left">Quantity</th>
                  <th className="px-4 py-2 border border-gray-600 text-left">Total</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800">
                {order.orderItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border border-gray-600">
                      <img
                        src={item.productId.image}
                        alt={item.productId.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-4 py-2 border border-gray-600 hover:underline">
                    <Link  to={`/product/${item.productId._id}`}>
                  {item.productId.name}
                   </Link>
                  
                    </td>
                    <td className="px-4 py-2 border border-gray-600">₹{item.productId.price}</td>
                    <td className="px-4 py-2 border border-gray-600">{item.quantity}</td>
                    <td className="px-4 py-2 border border-gray-600">
                      ₹{item.totalPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2"></td>
                  <td className="px-4 py-2 font-bold border border-gray-600 text-green-400">
                    Total
                  </td>
                  <td className="px-4 py-2 font-bold border border-gray-600 text-green-400">
                    {order?.orderItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </td>
                  <td className="px-4 py-2 font-bold border border-gray-600 text-green-400">
                    ₹{order?.amount}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          
          <div className="flex-1 space-y-8 bg-gray-800 p-6 rounded-lg shadow-lg">
  {/* Order Details Section */}
  <div>
    <h2 className="text-xl font-bold mb-6 text-green-400 tracking-wide uppercase">
      Order Details
    </h2>
    <p className="text-gray-300 text-lg leading-relaxed">
      <strong className="text-white">Order ID:</strong> {order.orderId}
    </p>
    <p className="text-gray-300 text-lg leading-relaxed">
      <strong className="text-white">Order Date:</strong>{' '}
      {new Date(order.orderDate).toLocaleString()}
    </p>
    <p className="text-gray-300 text-lg leading-relaxed">
      <strong className="text-white">Payment Status:</strong> {order.payStatus}
    </p>
    <p className="text-gray-300 text-lg leading-relaxed">
      <strong className="text-white">Payment ID:</strong> {order.paymentId}
    </p>
    <p className="text-gray-300 text-lg leading-relaxed">
      <strong className="text-white">Amount Paid:</strong> ₹{order.amount}
    </p>
  </div>

  {/* Shipping Address Section */}
  <div>
    <h2 className="text-xl font-bold mb-6 text-green-400 tracking-wide uppercase">
      Shipping Address
    </h2>
    <p className="text-gray-300 text-lg leading-relaxed">
      {`${order?.userShippingAddress?.address}, ${order?.userShippingAddress?.city}, ${order?.userShippingAddress?.state}`}
    </p>
  </div>

  {/* User Details Section */}
  <div>
    <h2 className="text-xl font-bold mb-6 text-green-400 tracking-wide uppercase">
      User Details
    </h2>
    <p className="text-gray-300 text-lg leading-relaxed">
      <strong className="text-white">User ID:</strong> {order.userId}
    </p>
  </div>
</div>

        </div>
  )
}

export default Detailed