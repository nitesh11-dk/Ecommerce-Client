import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/config';
import AppContext from '../../context/AppContext';
import { FaBoxOpen, FaUsers, FaShoppingBag, FaDollarSign } from 'react-icons/fa';

function AdminOverview() {
  const { products } = useContext(AppContext);
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const [usersRes, ordersRes] = await Promise.all([
          axios.get(`${BASE_URL}/user/all`, { headers: { Auth: token }, withCredentials: true }),
          axios.get(`${BASE_URL}/payment/allorders`, { headers: { Auth: token }, withCredentials: true })
        ]);

        const totalUsers = usersRes.data.users?.length || 0;
        const allOrders = ordersRes.data.orders || [];
        const totalOrders = allOrders.length;
        const totalRevenue = allOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

        setStats({ users: totalUsers, orders: totalOrders, revenue: totalRevenue });
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalProducts = products?.length || 0;

  const kpis = [
    { label: 'Total Products', value: totalProducts, icon: <FaBoxOpen />, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Total Users', value: stats.users, icon: <FaUsers />, color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'Total Orders', value: stats.orders, icon: <FaShoppingBag />, color: '#10b981', bg: '#ecfdf5' },
    { label: 'Total Payments', value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: <FaDollarSign />, color: '#f59e0b', bg: '#fffbeb' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-lg)' }} />
        ))}
      </div>
    );
  }

  return (
    <div className="fade-up">
      <div style={{ marginBottom: 24 }}>
        <h1 className="section-title">Store Overview</h1>
        <p className="section-subtitle">Real-time statistics for SoleStep</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        {kpis.map((kpi, index) => (
          <div key={index} className="card-surface" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: kpi.bg, color: kpi.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0
            }}>
              {kpi.icon}
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                {kpi.label}
              </p>
              <p style={{ color: 'var(--text-primary)', fontSize: 24, fontWeight: 800, margin: 0 }}>
                {kpi.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminOverview;
