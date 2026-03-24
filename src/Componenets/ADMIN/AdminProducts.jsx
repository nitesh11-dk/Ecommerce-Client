import React, { useContext } from 'react';
import AppContext from '../../context/AppContext';
import Cards from '../product/Cards';
import { FaBoxOpen, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function AdminProducts() {
  const { products } = useContext(AppContext);

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="section-title">All Products</h1>
          <p className="section-subtitle">{products?.length || 0} shoes in catalog</p>
        </div>
        <Link to="/adminpanel/addproduct" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', fontSize: 14 }}>
          <FaPlus /> Add New Shoe
        </Link>
      </div>

      {!products ? (
        <div className="product-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 360, borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-secondary)' }}>
          <FaBoxOpen style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }} />
          <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No products yet</h3>
          <p>Add some shoes to your catalog to see them here.</p>
        </div>
      ) : (
        <div className="fade-up">
          <Cards products={products} />
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
