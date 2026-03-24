import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/config';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BASE_URL}/payment/allorders`, { headers: { Auth: token }, withCredentials: true });
        setOrders(res.data.orders || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 'var(--radius-lg)' }} />)}
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="section-title">All Orders</h1>
        <p className="section-subtitle">{orders.length} total orders</p>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <FaShoppingBag style={{ fontSize: 40, marginBottom: 14 }} />
          <p style={{ fontSize: 16, fontWeight: 500 }}>No orders yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {orders.map((order) => (
            <Link key={order._id} to={`/adminpanel/orders/${order._id}`} style={{ textDecoration: 'none' }}>
              <div className="card-surface fade-up" style={{
                padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16,
                cursor: 'pointer', transition: 'box-shadow 0.18s',
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}>
                <div style={{ width: 40, height: 40, background: '#f0fdf4', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaCheckCircle style={{ color: 'var(--success)', fontSize: 18 }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Order #{order.orderId}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                    {new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span className="badge badge-success" style={{ marginBottom: 4, display: 'block' }}>{order.payStatus}</span>
                  <span className={`badge ${order.orderStatus === 'Cancelled' ? 'badge-danger' : 'badge-primary'}`} style={{ marginBottom: 4, display: 'block' }}>{order.orderStatus || 'Processing'}</span>
                  <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>₹{Number(order.amount).toLocaleString('en-IN')}</span>
                </div>
                <FaArrowRight style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
