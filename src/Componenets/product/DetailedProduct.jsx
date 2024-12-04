import React from 'react'
import { useEffect, useState ,useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReleatedProduct from './ReleatedProduct';
import AppContext from "../../context/AppContext";
import {  toast } from "react-toastify";
import { BASE_URL } from '../../constants/config';
const DetailedProduct = () => {
  
  const {  addToCart ,isLoggedIn } = useContext(AppContext);
    let  {id } = useParams();
    const [product, setProduct] = useState(null);

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/product/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    withCredentials: true
                }
            });
            setProduct(response.data.product);
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, []);
if(!product) return <div>Loading...</div>

const formattedDate =  new Date(product.createdAt).toLocaleString();


  return (
    <>
    
    
    <div className=' flex-col flex items-center gap-10 py-10'>   
<div className="card  bg-zinc-700 p-4  w-full max-w-5xl shadow-xl flex flex-row items-center">
  <figure className="w-1/2 ">
    <img
      src={product.image}
      alt={product.name}
      className="w-full h-64 object-cover rounded-lg"
    />
  </figure>
  <div className="card-body w-2/3 pl-6">
    <h2 className="card-title text-4xl font-semibold text-gray-300">
      {product.name}
      <div className="badge badge-secondary ml-3">NEW</div>
    </h2>
    <p className="text-lg mt-4 text-gray-400 leading-relaxed">
      {product.description}
    </p>

    <div className="mt-6">
      <div className="card-actions justify-start">
        <div className="badge badge-outline py-4 text-teal-600 border-teal-600">
          {product.category}
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="text-2xl font-semibold text-indigo-600">
          ${product.price.toFixed(2)}
        </span>
        <span className="text-md text-green-500">Stock: {product.quantity}</span>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p><strong>Created At:</strong> {formattedDate}</p>
      </div>

      <button 
  onClick={(event) => {
    event.stopPropagation(); 
    if (isLoggedIn) {
      addToCart(product._id);
    } else {
      toast.error("Please log in to add items to the cart.");
    }
  }} 
  className="btn btn-primary w-full mt-6 text-white hover:bg-indigo-700 transition-all duration-300"
>
  Add to Cart
</button>

    </div>
  </div>
</div>

<div> <ReleatedProduct category={product.category} productId={product._id} /></div>

    </div>
    
    
    </>
  )
}

export default DetailedProduct