import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const UserForm = ({ initialData, onSubmit, buttonText }) => {
  const [formData, setFormData] = useState(initialData);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isRegister = buttonText === 'Register';

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await onSubmit(formData);
      if (success) {
        setFormData(initialData);
        if (isRegister) navigate('/login');
        else navigate('/profile');
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
        boxShadow: 'var(--shadow-xl)', padding: '40px',
        width: '100%', maxWidth: 420,
        border: '1px solid var(--border)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52,
            background: 'linear-gradient(135deg, var(--primary), #7c3aed)',
            borderRadius: 14, margin: '0 auto 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FaUser style={{ color: '#fff', fontSize: 20 }} />
          </div>
          <h1 style={{ fontWeight: 800, fontSize: 24, marginBottom: 4 }}>
            {isRegister ? 'Create Account' : 'Edit Profile'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            {isRegister ? 'Join SoleStep today' : 'Update your information'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {'name' in formData && (
            <div>
              <label className="form-label" htmlFor="name">Full Name</label>
              <div style={{ position: 'relative' }}>
                <FaUser style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 13 }} />
                <input className="form-input" id="name" name="name" type="text"
                  value={formData.name} onChange={handleChange}
                  placeholder="John Doe"
                  style={{ paddingLeft: 38 }} required={isRegister} />
              </div>
            </div>
          )}

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
            <label className="form-label" htmlFor="password">
              Password {!isRegister && <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(leave blank to keep current)</span>}
            </label>
            <div style={{ position: 'relative' }}>
              <FaLock style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 13 }} />
              <input className="form-input" id="password" name="password"
                type={showPwd ? 'text' : 'password'}
                value={formData.password} onChange={handleChange}
                placeholder="••••••••"
                style={{ paddingLeft: 38, paddingRight: 38 }}
                required={isRegister} />
              <button type="button" onClick={() => setShowPwd(!showPwd)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 15,
              }}>
                {showPwd ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: 15, marginTop: 4, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Saving…' : buttonText}
          </button>
        </form>

        {isRegister && (
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', marginTop: 18 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default UserForm;
