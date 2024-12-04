import React, { useContext, useState } from 'react';
import AppContext from "../context/AppContext";
import { useNavigate } from 'react-router-dom';

const Address = () => {
  const [address, setAddress] = useState({
    userId: '',
    address: '',
    city: '',
    state: '',
    country: '',
    phoneNumber: '',
  });
  const { userAddress ,addAddress } = useContext(AppContext);
const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    addAddress(address);
    navigate('/checkout');
  };

  return (
    <div className="h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Address Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={address.address}
              onChange={handleChange}
              placeholder="Enter your address"
              className="w-full bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-1">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={address.city}
              onChange={handleChange}
              placeholder="Enter your city"
              className="w-full bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium mb-1">
              State
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={address.state}
              onChange={handleChange}
              placeholder="Enter your state"
              className="w-full bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-1">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={address.country}
              onChange={handleChange}
              placeholder="Enter your country"
              className="w-full bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="phoneNumber"  className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="number"
              id="phoneNumber"
              name="phoneNumber"
              value={address.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
          >
            Save Address
          </button>
        </form>
      {
        userAddress && (
          <h2 className='text-center'>
          <button className="p-3 bg-yellow-200 my-3  text-black rounded-xl hover:bg-yellow-300" onClick={() => navigate('/checkout')}>Use Old Address </button>
          </h2>
        )
      }
      </div>
    </div>
  );
};
export default Address;
