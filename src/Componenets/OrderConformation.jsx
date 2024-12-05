import React, { useContext, useEffect } from 'react';
import AppContext from "../context/AppContext.jsx";
import { Link } from 'react-router-dom';
import DetailedOrder from './ADMIN/DetailedOrder.jsx';
const OrderConformation = () => {
  const { getOrders, userOrder } = useContext(AppContext);

  useEffect(() => {
    getOrders();
  }, []);


  if (!userOrder) {
    return <h3 className="text-white text-center">Loading...</h3>;
  }
  const order = userOrder[0];

  return (
  
    <div className="h-[93vh] flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-400">
          🎉 Order Confirmed!
        </h1>
        <p className="text-gray-400 text-center mb-8">
  Thank you for shopping with us. Your order will be shipped soon..
</p>


<DetailedOrder order={order}/>

      </div>
    </div>
  );
};

export default OrderConformation;
