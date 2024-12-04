import React, { useContext } from "react";
import AppContext from "../context/AppContext";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL, razorpayKey } from "../constants/config";

const Checkout = () => {
  const { cart, addToCart, isLoggedIn, decreaseQuantity, removeItem, userAddress,user,clearCart } = useContext(AppContext);
  const navigate = useNavigate();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center text-white mt-10">
        <h1 className="text-3xl">No items in the cart</h1>
        <Link to="/" className="btn text-xl btn-warning mt-4">Continue Shopping ...</Link>
      </div>
    );
  }
  
  const totalQuantity = cart.items?.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.items?.reduce((acc, item) => acc + item.totalPrice, 0);


  
  const handlePayment = async () => {
    try {
      const orderResponse = await axios.post(`${BASE_URL}/payment/checkout`, {
        amount: totalPrice,
        cardItems: cart?.items,
        userId: user?._id,
        userShippingAddress: userAddress,
      });
      const { orderId, amount } = orderResponse.data;
      const options = {
        key: razorpayKey,
        amount: amount,
        currency: "INR",
        name: "Nitesh-Dk-Ecommerce",
        description: "Test Transaction for E-commerce",
        order_id: orderId,
        handler: async function (response) {
          const payemntData = {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            amount: amount,
            orderItems: cart?.items,
            userId: user?._id,
            userShippingAddress: userAddress,
          }
    const api = await axios.post(`${BASE_URL}/payment/verify-payment`, payemntData);
if(api.data.success){
  clearCart();
  toast.success('Payment successful!');
navigate('/orderconfirmation')
}
        },
        prefill: {
          name: "Nitesh kushwaha",
          email: "niteshkushwaha1109@gmail.com",
          contact: "9000090000",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
  
      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        navigate('/checkout');
        toast.error('Payment failed. Please try again later.');
      });
  
      rzp1.open();
    } catch (error) {
      console.error('Error during payment:', error);
      alert('Something went wrong. Please try again later.');
    }
  };
  
 
  return (
    <div className="container mx-auto w-screen justify-center items-center p-6 text-white flex flex-col gap-8">
        <h1 className="text-4xl font-bold mb-6 text-center">Order Summary</h1>
  
      <div className="flex gap-10">
        <div className="overflow-x-auto  ">
          <table  className="  bg-gray-900  min-w-full table-auto text-left overflow-hidden  ">
          <thead className="overflow-hidden">
  <tr>
    <th className=" text-center px-4 py-2 border border-gray-400">Image</th>
    <th className=" text-center px-4 py-2 border border-gray-400">Product</th>
    <th className=" text-center px-4 py-2 border border-gray-400">Qty</th>
    <th className=" text-center px-4 py-2 border border-gray-400">Price</th>
    <th className=" text-center px-4 py-2 border border-gray-400">++</th>
    <th className=" text-center px-4 py-2 border border-gray-400">--</th>
    <th className=" text-center px-4 py-2 border border-gray-400">Remove</th>
  </tr>
</thead>
<tbody className="bg-gray-800">
  {cart.items.map((item) => (
    <tr key={item._id} className="border-b border-gray-600">
      <td className="px-4 py-2 border border-gray-400">
        <img
          src={item.productId.image}
          alt={item.productId.name}
          className="w-16 h-16 object-cover rounded-lg"
        />
      </td>
      <td className="px-4 py-2 border border-gray-400">
        <Link to={`/product/${item.productId._id}`} className="hover:underline">
          {item.productId.name}
        </Link>
      </td>
      <td className="px-4 py-7 flex justify-center items-center border border-gray-400">{item.quantity}</td>
      <td className="px-4 py-2 border border-gray-400">₹{item.productId.price}</td>
      <td className="px-4 py-2 border border-gray-400">
        <button
          onClick={() => isLoggedIn && addToCart(item.productId._id)}
          className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700"
        >
          <FaPlus />
        </button>
      </td>
      <td className="px-4 py-2 border border-gray-400">
        <button
          onClick={() => isLoggedIn && decreaseQuantity(item.productId._id)}
          className="p-2 bg-yellow-600 text-white rounded-full hover:bg-yellow-700"
        >
          <FaMinus />
        </button>
      </td>
      <td className="px-4 py-2 border border-gray-400">
        <button
          onClick={() =>
            isLoggedIn && confirm("Remove this item?") && removeItem(item.productId._id)
          }
          className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  ))}
</tbody>

            <tfoot>
              <tr className="overflow-hidden">
                <td colSpan="2" className="border border-gray-400 px-4 py-2 text-lg font-bold text-end">Total</td>
                <td className="px-4 flex justify-center items-center py-2 border border-gray-400 text-lg font-bold">{totalQuantity}</td>
                <td colSpan="1" className=" border border-gray-400px-4 py-2 text-lg font-bold text-green-400 text-center">₹{totalPrice.toFixed(2)}</td>
                <td colSpan="3" className=" border border-gray-400px-4 py-2 text-lg font-bold text-green-400 text-center"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="bg-gray-800 p-6 flex flex-col items-center  rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4"> Shipping Address</h2>
          {userAddress && (
            <div className="text-gray-200">
              <p><strong>Address:</strong> {userAddress.address}</p>
              <p><strong>City:</strong> {userAddress.city}</p>
              <p><strong>State:</strong> {userAddress.state}</p>
              <p><strong>Country:</strong> {userAddress.country}</p>
              <p><strong>Phone Number:</strong> {userAddress.phoneNumber}</p>
            </div>
          )
        }
        </div>

      </div>

<h3 className="text-center  ">
<button onClick={handlePayment} className="px-4 py-2 rounded-2xl bg-yellow-400  m-4 text-black font-semibold hover:bg-yellow-600">Proceed To Pay </button>
</h3>


    </div>
  );
};

export default Checkout;
