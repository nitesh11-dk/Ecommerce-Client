import React, { useState, useContext, useEffect } from 'react';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AppContext from "../context/AppContext";
import { toast } from 'react-toastify';
import { GrUserAdmin } from "react-icons/gr";
import { FaUserAstronaut } from "react-icons/fa";


const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { setSearchFilter, isLoggedIn, logoutUser,cart ,isAdmin } = useContext(AppContext);


  let navigate = useNavigate();
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearchFilter(query); 
  };

  


const location = useLocation();
  return (
    <div>
      <div className="navbar bg-base-200 sm:px-20 sticky top-0 z-50 shadow-md">
        <div className="navbar-start flex  gap-2">
          <Link to="/" className="btn btn-ghost normal-case text-xl">TechBazaar</Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <div className="form-control w-full max-w-md relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="input input-bordered w-full pl-10"
            />
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="navbar-end flex gap-2">
          {isLoggedIn ? (
            <>
              <Link to="/cart" className="btn btn-ghost relative">
          <span className={` h-6 w-6  absolute flex items-center justify-center ${cart?.items?.length >0 ? 'visible' : 'hidden'} top-0 right-0 rounded-full `}>
           { cart &&  cart?.items?.length
           }
          </span>
            <FaShoppingCart className="text-xl" />
          </Link>
              <Link to="/profile">
            {
              isAdmin ? (<GrUserAdmin className='text-3xl ' />):(<FaUserAstronaut  className='text-3xl '/>)
            }
          </Link>
              <button 
                onClick={() => {
                  logoutUser();
                  toast.success("Logout Successfully");
                  navigate('/');
                }} 
                className="btn btn-outline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="btn btn-outline">SignUp</Link>
              <Link to="/login" className="btn btn-outline">SignIn</Link>
            </>
          )}

        
        </div>
      </div>

      {
         (location.pathname === '/') && (

          <div className="bg-base400 flex items-center justify-center p-4">
    {isAdmin && (
      <Link to={'/addproduct'} className="px-4 py-2 rounded-xl bg-base-300 mr-8">
        Add Product
      </Link>
    )}
    <div className="flex justify-between gap-10 items-center">
      {isAdmin && (
        <Link to={'/adminpanel'} className="px-4 py-2 rounded-xl bg-gray-500 mr-8">
          ADMIN
        </Link>
      )}
    </div>
  </div>
      
         )  
      }
    </div>
  );
};

export default Navbar;
