import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUserCircle, FaShieldAlt, FaBars, FaTimes, FaBoxOpen } from 'react-icons/fa';
import AppContext from '../context/AppContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setSearchFilter, isLoggedIn, logoutUser, cart, isAdmin, user } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cart?.items?.length || 0;

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    setSearchFilter(q);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/', { replace: true });
    toast.success('Logged out successfully');
    window.scrollTo(0, 0);
  };

  return (
    <>
      {/* ── Main Navbar ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 999,
        background: '#fff',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '0 24px',
          display: 'flex', alignItems: 'center',
          height: 64, gap: 16,
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span style={{
              background: 'linear-gradient(135deg, #1e40af, #7c3aed)',
              borderRadius: 10, width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>👟</span>
            <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Sole<span style={{ color: 'var(--primary)' }}>Step</span>
            </span>
          </Link>

          {/* Search */}
          {!isAdmin && (
            <div className="nav-search" style={{ flex: 1, maxWidth: 480, position: 'relative' }}>
              <FaSearch style={{
                position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', fontSize: 14,
              }} />
              <input
                className="form-input"
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search products, brands, categories…"
                style={{ paddingLeft: 38, height: 40, fontSize: 14 }}
              />
            </div>
          )}

          {/* Nav Actions */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto', flexShrink: 0 }}>
            {isLoggedIn ? (
              <>
                {/* Regular User Nav Items - Hidden for Admins */}
                {!isAdmin && (
                  <>
                    {/* Cart */}
                    <Link to="/cart" style={{ position: 'relative', textDecoration: 'none' }}
                      title="Shopping Cart">
                      <button className="btn-icon" style={{ width: 40, height: 40 }}>
                        <FaShoppingCart style={{ fontSize: 17 }} />
                        {cartCount > 0 && (
                          <span style={{
                            position: 'absolute', top: -4, right: -4,
                            background: 'var(--accent)', color: '#fff',
                            borderRadius: 99, fontSize: 10, fontWeight: 800,
                            minWidth: 18, height: 18, padding: '0 4px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            lineHeight: 1, border: '2px solid #fff',
                          }}>{cartCount}</span>
                        )}
                      </button>
                    </Link>

                    {/* Profile */}
                    <Link to="/orders" style={{ textDecoration: 'none' }} title="My Orders">
                      <button className="btn-icon" style={{ width: 40, height: 40 }}>
                        <FaBoxOpen style={{ fontSize: 17 }} />
                      </button>
                    </Link>
                     <Link to="/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }} title="Profile">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 12px', borderRadius: 'var(--radius-lg)', background: 'var(--bg)', border: '1px solid var(--border)', transition: 'all 0.2s' }} className="nav-profile-btn">
                          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                            {user?.name?.split(' ')[0]}
                          </span>
                          <FaUserCircle style={{ fontSize: 18, color: 'var(--primary)' }} />
                        </div>
                     </Link>

                    <button className="btn-outline" onClick={handleLogout} style={{ padding: '7px 16px', fontSize: 13 }}>
                      Logout
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <Link to="/register" className="btn-outline" style={{ padding: '7px 16px', fontSize: 13 }}>
                  Sign Up
                </Link>
                <Link to="/login" className="btn-primary" style={{ padding: '7px 16px', fontSize: 13 }}>
                  Sign In
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;
