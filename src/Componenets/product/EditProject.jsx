import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/config';


function EditProduct() {
  const {  updateProduct } = useContext(AppContext); 
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    quantity: 0,
  });

  const fetchProduct = async () => {
      try {
          const response = await axios.get(`${BASE_URL}/product/${id}`, {
              headers: {
                  "Content-Type": "application/json",
                  withCredentials: true
              }
          });
          setFormData(response.data.product);
      } catch (error) {
          console.error("Error fetching product data:", error);
      }
  };

  useEffect(() => {
      fetchProduct();
  }, [id]);

if(!formData) return <div>Loading...</div>

 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    updateProduct(id, formData); 
    navigate('/'); 
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg w-full sm:w-96">
        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-2 w-full rounded-lg bg-gray-700 text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 p-2 w-full rounded-lg bg-gray-700 text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 p-2 w-full rounded-lg bg-gray-700 text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="mt-1 p-2 w-full rounded-lg bg-gray-700 text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 p-2 w-full rounded-lg bg-gray-700 text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="mt-1 p-2 w-full rounded-lg bg-gray-700 text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 p-2 rounded-lg text-white font-semibold hover:bg-indigo-500"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
