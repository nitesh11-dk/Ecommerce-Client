import {Link} from 'react-router-dom'
import AppContext from "../../context/AppContext";
import {  toast } from "react-toastify";
import { useContext } from 'react';
const Cards = ({products}) => {
  const {  addToCart ,isLoggedIn } = useContext(AppContext);
  if (!products) {
    return <div>Loading...</div>;
  }
  
  return (
    <div  className='flex gap-10 flex-wrap  justify-center  px-20 w-[99%]'>
    {products.map((product) => (
     <div key={product._id} className="card bg-base-100 p-2 h-fit w-92 shadow-xl">
       <Link to={`/product/${product._id}`}  >
      <figure>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {product.name}
          <div className="badge badge-secondary">NEW</div>
        </h2>
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-semibold">₹{product.price.toFixed(2)}</span>
        </div>
       
      </div>
    </Link>
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
    ))}
  </div>
  )
}

export default Cards