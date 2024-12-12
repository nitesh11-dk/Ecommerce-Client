import {Link} from 'react-router-dom'
import AppContext from "../../context/AppContext";
import {  toast } from "react-toastify";
import { useContext } from 'react';
import {  FaShoppingCart } from 'react-icons/fa';
const Cards = ({products}) => {
  const {  addToCart ,isLoggedIn,isAdmin,deleteProduct } = useContext(AppContext);
  if (!products) {
    return <div>Loading...</div>;
  }
  
  return (
    <div  className='flex gap-10 flex-wrap  justify-center  px-20 w-[99%]'>
    {products.map((product) => (
     <div key={product._id} className="relative card bg-base-100 p-2 h-[400px] w-72 shadow-xl">
       <Link to={`/product/${product._id}`}  >
      <figure>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-contain  rounded-3xl"
        />
      </figure>
      <div className="card-body ">
        <h2 className="card-title">
          {product.name.split(" ").slice(0, 4).join(" ")}
        </h2>
        <div className="flex justify-between items-center mt-1">
          <span className="text-lg font-semibold">₹{product.price.toFixed(2)}</span>
        </div>
      </div>
    </Link>
   <div className='gap-4 flex absolute bottom-2  justify-between px-2'>
   {
    isAdmin && (
       
  <div className='flex gap-4'>
     <button className="btn bg-blue-500 w-fit  mt-6 px-4 text-xl text-white hover:bg-blue-700 transition-all duration-300"
   >
     <Link to={`/update/${product._id}`}>Edit</Link>
   </button>
  <button onClick={()=>deleteProduct(product._id)} className="btn btn-error w-fit px-4 text-xl  mt-6 text-white hover:bg-red-700 transition-all duration-300"
   >
     Delete
   </button>
  </div>
    )
   }
   
    <button 
  onClick={(event) => {
    event.stopPropagation(); 
    if (isLoggedIn) {
      addToCart(product._id);
    } else {
      toast.error("Please log in to add items to the cart.");
    }
  }} 
  className="btn btn-primary w-fit  mt-6 text-white hover:bg-indigo-700 px-4 text-xl transition-all duration-300"
>
<FaShoppingCart/>
</button>
   </div>
     </div>
    ))}
  </div>
  )
}

export default Cards