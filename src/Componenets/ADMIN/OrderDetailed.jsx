import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // For accessing the product ID from URL
import { BASE_URL } from '../../constants/config';
import DetailedOrder from './DetailedOrder';
const OrderDetailed = () => {
  const { id } = useParams();  

  const [loading, setLoading] = useState(true);
  const [order,setOrder] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product details by ID
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
        // console.log(response.data.order)
        setOrder(response.data.order); 
      }
    } catch (error) {
      console.error("Error fetching orders: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();  
  }, [id]);  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!order) {
    return <div>No Order details found!</div>;
  }

  return (
   <>
   {
    order && (
      <>
      {/* <DetailedOrder order={order}/> */}
    <div className="flex justify-center mt-4">
      <button onClick={() => window.history.back()} className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600">
        Go Back
      </button>
    </div>
      </>
     )
   }
   </>
  );
};

export default OrderDetailed;
