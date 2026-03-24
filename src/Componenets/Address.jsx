import React, { useContext, useState } from 'react';
import AppContext from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaCity, FaGlobe, FaArrowRight } from 'react-icons/fa';

const FIELDS = [
  { name: 'address',     label: 'Street Address', icon: <FaMapMarkerAlt />, placeholder: '123 Main Street, Apt 4B', type: 'text' },
  { name: 'city',        label: 'City',            icon: <FaCity />,         placeholder: 'Mumbai',            type: 'text' },
  { name: 'state',       label: 'State',           icon: <FaGlobe />,        placeholder: 'Maharashtra',       type: 'text' },
  { name: 'country',     label: 'Country',         icon: <FaGlobe />,        placeholder: 'India',             type: 'text' },
  { name: 'phoneNumber', label: 'Phone Number',    icon: <FaPhone />,        placeholder: '+91 9876543210',    type: 'tel' },
];

const Address = () => {
  const [form, setForm] = useState({ address: '', city: '', state: '', country: '', phoneNumber: '' });
  const [loading, setLoading] = useState(false);
  const { userAddress, addAddress } = useContext(AppContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addAddress(form);
      navigate('/checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: 'var(--bg)', padding: '40px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 28 }}>
      {/* Saved Address Card */}
      {userAddress && (
        <div className="fade-up" style={{
          background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)',
          padding: 28, width: 280, flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <FaMapMarkerAlt style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontWeight: 700, fontSize: 16 }}>Saved Address</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
            <p>{userAddress.address}</p>
            <p>{userAddress.city}, {userAddress.state}</p>
            <p>{userAddress.country}</p>
            <p style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FaPhone style={{ fontSize: 11, color: 'var(--primary)' }} /> {userAddress.phoneNumber}
            </p>
          </div>
          <button className="btn-primary" style={{ width: '100%', marginTop: 20, padding: '10px' }}
            onClick={() => navigate('/checkout')}>
            Use This Address <FaArrowRight />
          </button>
        </div>
      )}

      {/* New Address Form */}
      <div className="fade-up" style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)',
        padding: '36px 40px', width: '100%', maxWidth: 460,
      }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 4 }}>
            {userAddress ? 'Add New Address' : 'Delivery Address'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Where should we deliver your order?
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {FIELDS.map(({ name, label, icon, placeholder, type }) => (
            <div key={name}>
              <label className="form-label" htmlFor={name}>{label}</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 13 }}>
                  {icon}
                </span>
                <input className="form-input" id={name} name={name} type={type}
                  value={form[name]} onChange={handleChange}
                  placeholder={placeholder}
                  style={{ paddingLeft: 38 }}
                  required />
              </div>
            </div>
          ))}
          <button className="btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: 15, marginTop: 4, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Saving…' : 'Save & Continue'} {!loading && <FaArrowRight />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Address;
