import React, { useContext ,useEffect,useState } from "react";
import AppContext from "../context/AppContext";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";



const ShoppingCart = () => {
  let { cart , addToCart ,isLoggedIn , decreaseQuantity ,removeItem,clearCart} = useContext(AppContext);

  const navigate = useNavigate();

  
  if (!cart) {
    return (
      <div className="text-center text-white mt-10">
        <h1 className="text-3xl">Cart is empty</h1>
      </div>
    );
  }

  if(cart.items.length === 0){
    return (
      <div className="text-center text-white mt-10">
        <h1 className="text-3xl">No items in the card </h1>
      <Link to="/" className="btn text-xl btn-warning mt-4">Continue Shopping ...</Link>
      </div>
    )
  }


  return (
    <div className="container mx-auto p-6 relative w-1/2  text-white ">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <p className="text-lg mt-4">
          Total Items: <span className="font-semibold">{cart.items.length}</span>
        </p>
        <p className="text-lg">
          Total Price:{" "}
          <span className="font-semibold text-green-400">
            ${cart.items.reduce((acc, item) => acc + item.totalPrice, 0).toFixed(2)}
          </span>
        </p>
      </div>

      {/* Cart Items */}
      <div className="grid grid-cols-1 gap-8">
        {cart.items.map((item) => (
          <div
            key={item._id}
            className="flex flex-col md:flex-row items-center justify-between p-6 bg-gray-800 rounded-lg shadow-lg"
          >
            {/* Product Info */}
            <Link to={`/product/${item.productId._id}`} className="flex items-center">
              <img
                src={item.productId.image}
                alt={item.productId.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="ml-6">
                <h2 className="text-xl font-semibold">{item.productId.name}</h2>
                <p className="text-gray-400">₹{item.productId.price}</p>
                <p className="text-gray-500 text-sm mt-2">
                  Quantity: {item.quantity}
                </p>
              </div>
            </Link>

            {/* Actions */}
            <div className="flex mt-4 md:mt-0">
              <button
                onClick={(event) => {
                  event.stopPropagation(); 
                  if (isLoggedIn) {
                    addToCart(item.productId._id);
                  } else {
                    toast.error("Please log in to add items to the cart.");
                  }
                }} 
                className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 mr-2"
              >
                <FaPlus />
              </button>
              <button
               onClick={(event) => {
                event.stopPropagation(); 
                if (isLoggedIn) {
                  decreaseQuantity(item.productId._id);
                } else {
                  toast.error("Please log in to add items to the cart.");
                }
              }} 
                className="p-3 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 mx-2"
              >
                <FaMinus />
              </button>
              <button
               onClick={(event) => {
                event.stopPropagation(); 
                if (isLoggedIn) {
                  if(confirm("sure want to remove form the cart")){
                    removeItem(item.productId._id);
                  }
                } else {
                  toast.error("Please log in to add items to the cart.");
                }
              }
            }
                className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                <FaTrash />
              </button>
            </div>


          </div>
        ))}
      </div>

      <div className="items-center justify-center flex gap-10 m-8">
        <button onClick={() => navigate("/Address")}   className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700" >Checkout</button>
        <button onClick={()=>{
          if(confirm("sure want to clear the cart")){
            clearCart()
          }
        }} className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700" >ClearCart</button>
      </div>
    </div>
  );
};

export default ShoppingCart;
