import React, { useContext, useEffect } from 'react';
import AppContext from '../context/AppContext.jsx';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaBox } from 'react-icons/fa';

const OrderConformation = () => {
  const { getOrders, userOrder } = useContext(AppContext);

  useEffect(() => { 
    getOrders(); 
    window.scrollTo(0, 0);
  }, []);

  // Show the most recent order
  const order = userOrder?.[0];

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: 'var(--bg)', padding: '40px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Success header */}
        <div className="fade-up" style={{
          background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)',
          padding: '40px 32px', textAlign: 'center', marginBottom: 24,
        }}>
          <div style={{
            width: 72, height: 72, background: '#f0fdf4',
            borderRadius: '50%', border: '2px solid #bbf7d0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <FaCheckCircle style={{ fontSize: 34, color: 'var(--success)' }} />
          </div>
          <h1 style={{ fontWeight: 900, fontSize: 28, color: 'var(--text-primary)', marginBottom: 8 }}>
            Order Confirmed! 🎉
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 440, margin: '0 auto 24px' }}>
            Thank you for shopping with SoleStep. Your order has been placed and will be shipped soon.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>
              <FaHome /> Continue Shopping
            </Link>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default OrderConformation;
