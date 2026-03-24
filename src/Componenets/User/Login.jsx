import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppContext from '../../context/AppContext';
import { FaEnvelope, FaLock, FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', adminKey: '' });
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser, loginAdmin } = useContext(AppContext);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { email, password, adminKey } = formData;
      const res = isAdminLogin
        ? await loginAdmin(email, password, adminKey)
        : await loginUser(email, password);
      
      if (res && res.success) {
        setFormData({ email: '', password: '', adminKey: '' });
        // Strictly redirect based on actual roles from backend
        if (res.isAdmin) {
          navigate('/adminpanel');
        } else {
          navigate('/');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: 24,
    }}>
      <div className="fade-up" style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-xl)', padding: '40px 40px',
        width: '100%', maxWidth: 420,
        border: '1px solid var(--border)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52,
            background: isAdminLogin
              ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
              : 'linear-gradient(135deg, var(--primary), #7c3aed)',
            borderRadius: 14, margin: '0 auto 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {isAdminLogin
              ? <FaShieldAlt style={{ color: '#fff', fontSize: 22 }} />
              : <FaEnvelope style={{ color: '#fff', fontSize: 20 }} />}
          </div>
          <h1 style={{ fontWeight: 800, fontSize: 24, marginBottom: 4, color: 'var(--text-primary)' }}>
            {isAdminLogin ? 'Admin Login' : 'Welcome back'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            {isAdminLogin ? 'Sign in to the admin dashboard' : 'Sign in to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="form-label" htmlFor="email">Email address</label>
            <div style={{ position: 'relative' }}>
              <FaEnvelope style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 14 }} />
              <input className="form-input" id="email" name="email" type="email"
                value={formData.email} onChange={handleChange}
                placeholder="you@example.com"
                style={{ paddingLeft: 38 }} required />
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <FaLock style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 13 }} />
              <input className="form-input" id="password" name="password"
                type={showPwd ? 'text' : 'password'}
                value={formData.password} onChange={handleChange}
                placeholder="••••••••"
                style={{ paddingLeft: 38, paddingRight: 38 }} required />
              <button type="button" onClick={() => setShowPwd(!showPwd)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 15,
              }}>
                {showPwd ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {isAdminLogin && (
            <div>
              <label className="form-label" htmlFor="adminKey">Admin Key</label>
              <div style={{ position: 'relative' }}>
                <FaShieldAlt style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 13 }} />
                <input className="form-input" id="adminKey" name="adminKey" type="password"
                  value={formData.adminKey} onChange={handleChange}
                  placeholder="Enter admin key"
                  style={{ paddingLeft: 38 }} required={isAdminLogin} />
              </div>
            </div>
          )}

          <button className="btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: 15, marginTop: 4, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in…' : (isAdminLogin ? 'Login as Admin' : 'Sign In')}
          </button>
        </form>

        <div className="divider" style={{ margin: '20px 0' }} />

        <div style={{ textAlign: 'center', fontSize: 13 }}>
          <button onClick={() => setIsAdminLogin(!isAdminLogin)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontWeight: 600, fontSize: 13 }}>
            {isAdminLogin ? '← Back to User Login' : 'Login as Admin'}
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', marginTop: 12 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
