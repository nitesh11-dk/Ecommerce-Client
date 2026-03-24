import React, { useContext, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaUsers, FaShoppingBag, FaShieldAlt, FaHome, FaBoxOpen, FaPlus, FaUserEdit, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import AppContext from '../../context/AppContext';
import { toast } from 'react-toastify';

import AdminOverview from './AdminOverview';

const NAV = [
  { to: '/adminpanel/users',  label: 'Users',  icon: <FaUsers /> },
  { to: '/adminpanel/orders', label: 'Orders', icon: <FaShoppingBag /> },
  { to: '/adminpanel/products', label: 'Products', icon: <FaBoxOpen /> },
  { to: '/adminpanel/addproduct', label: 'Add Product', icon: <FaPlus /> },
];

function AdminPanel() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutUser } = useContext(AppContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/', { replace: true });
    toast.success('Logged out successfully');
    window.scrollTo(0, 0);
  };

  return (
    <div className="admin-layout" style={{ position: 'relative', display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* Mobile Top Header */}
      <div className="admin-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
            <FaBars style={{ fontSize: 20, color: 'var(--text-primary)' }} />
          </button>
          <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>Admin Dashboard</span>
        </div>
        <FaShieldAlt style={{ color: 'var(--primary)', fontSize: 18 }} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`} style={{
        width: 220, flexShrink: 0,
        background: 'var(--surface)', borderRight: '1px solid var(--border)',
        padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FaShieldAlt style={{ color: 'var(--primary)', fontSize: 18 }} />
            <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>Admin Panel</span>
          </div>
          <button className="admin-close-btn" onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none' }}>
            <FaTimes style={{ fontSize: 18, color: 'var(--text-muted)' }} />
          </button>
        </div>
        {NAV.map(({ to, label, icon }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} onClick={() => setSidebarOpen(false)} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 'var(--radius-md)',
                fontSize: 14, fontWeight: 500,
                background: active ? 'var(--primary-light)' : 'transparent',
                color: active ? 'var(--primary)' : 'var(--text-secondary)',
                transition: 'all 0.15s',
              }}>
                {icon} {label}
              </div>
            </Link>
          );
        })}
        <div className="admin-bottom-actions" style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Link to="/profile" onClick={() => setSidebarOpen(false)} style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 'var(--radius-md)', fontSize: 14, color: 'var(--text-secondary)' }}>
              <FaUserEdit /> Edit Profile
            </div>
          </Link>
          <button onClick={handleLogout} style={{ border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', padding: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 'var(--radius-md)', fontSize: 14, color: 'var(--danger)' }}>
              <FaSignOutAlt /> Logout
            </div>
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="admin-content" style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
        {location.pathname === '/adminpanel' && <AdminOverview />}
        <Outlet />
      </main>
    </div>
  );
}

export default AdminPanel;
