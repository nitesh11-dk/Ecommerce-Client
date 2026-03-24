import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaTag, FaArrowLeft, FaTruck, FaCheckCircle, FaRulerHorizontal } from 'react-icons/fa';
import AppContext from '../../context/AppContext';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../constants/config';
import ReleatedProduct from './ReleatedProduct';

const DetailedProduct = () => {
  const { addToCart, isLoggedIn, isAdmin } = useContext(AppContext);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/product/${id}`);
        setProduct(res.data.product);
        // Auto-select first available size
        const firstAvailable = res.data.product?.sizes?.find(s => s.stock > 0);
        if (firstAvailable) setSelectedSize(firstAvailable.size);
      } catch {
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div style={{ maxWidth: 1000, margin: '40px auto', padding: '0 24px', display: 'flex', gap: 32 }}>
      <div className="skeleton" style={{ width: 440, height: 440, borderRadius: 'var(--radius-lg)', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="skeleton" style={{ height: 32, borderRadius: 8, width: '80%' }} />
        <div className="skeleton" style={{ height: 24, borderRadius: 8, width: '40%' }} />
        <div className="skeleton" style={{ height: 80, borderRadius: 8 }} />
        <div className="skeleton" style={{ height: 60, borderRadius: 10, width: '50%', marginTop: 'auto' }} />
      </div>
    </div>
  );

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-secondary)' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>👟</div>
      <h2>Shoe not found</h2>
      <Link to="/" className="btn-primary" style={{ display: 'inline-flex', marginTop: 16, textDecoration: 'none' }}>← Back to Home</Link>
    </div>
  );

  const availableSizes = product.sizes?.filter(s => s.stock > 0) || [];
  const inStock = product.quantity > 0 && availableSizes.length > 0;
  const selectedSizeInfo = availableSizes.find(s => s.size === selectedSize);

  const handleAddToCart = () => {
    if (!isLoggedIn) { toast.error('Please log in to add items to cart'); return; }
    if (!selectedSize) { toast.error('Please select a size first'); return; }
    addToCart(product._id, selectedSize);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - 64px)', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <FaArrowLeft style={{ fontSize: 11 }} /> Shop
          </Link>
          <span>/</span>
          <span style={{ textTransform: 'capitalize' }}>{product.gender}</span>
          <span>/</span>
          <span style={{ textTransform: 'capitalize' }}>{product.category}</span>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{product.brand}</span>
        </div>

        {/* Product Detail Card */}
        <div className="fade-up product-detail-layout" style={{
          background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)',
          display: 'flex', gap: 0, overflow: 'hidden',
        }}>
          {/* Image */}
          <div className="product-image-container" style={{
            width: 440, flexShrink: 0, background: '#f8fafc',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 40, borderRight: '1px solid var(--border)', position: 'relative'
          }}>
            <img src={product.image} alt={product.name} style={{ maxWidth: '100%', maxHeight: 360, objectFit: 'contain' }} />
            {!inStock && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ background: '#dc2626', color: '#fff', fontWeight: 800, fontSize: 16, padding: '10px 24px', borderRadius: 99 }}>OUT OF STOCK</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-info-container" style={{ flex: 1, padding: '40px 48px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{product.brand}</span>
                <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}><FaTag style={{ fontSize: 9, marginRight: 4 }} />{product.category}</span>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, margin: 0 }}>
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)' }}>₹{Number(product.price || 0).toLocaleString('en-IN')}</span>
              <span style={{ fontSize: 13, color: 'var(--success)', fontWeight: 700, background: '#f0fdf4', padding: '4px 10px', borderRadius: 99 }}>Including Taxes</span>
            </div>

            {/* Size Selector */}
            <div style={{ marginTop: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FaRulerHorizontal style={{ color: 'var(--text-muted)' }} /> Select Size (UK/India)
                </h3>
                <span style={{ fontSize: 12, color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>Size Guide</span>
              </div>
              
              {availableSizes.length > 0 ? (
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {product.sizes.map((s) => {
                    const available = s.stock > 0;
                    const isSelected = selectedSize === s.size;
                    return (
                      <button key={s.size} disabled={!available}
                        onClick={() => setSelectedSize(s.size)}
                        style={{
                          width: 48, height: 48, borderRadius: 8,
                          fontSize: 15, fontWeight: 700, cursor: available ? 'pointer' : 'not-allowed',
                          border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                          background: isSelected ? 'var(--primary-light)' : (available ? 'var(--surface)' : '#f1f5f9'),
                          color: isSelected ? 'var(--primary)' : (available ? 'var(--text-primary)' : '#cbd5e1'),
                          transition: 'all 0.15s'
                        }}>
                        {s.size}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <p style={{ color: 'var(--danger)', fontSize: 14, fontWeight: 600 }}>Currently unavailable in any size.</p>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Product Details</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{product.description}</p>
              {product.color && <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8 }}><strong>Color:</strong> {product.color}</p>}
            </div>

            <div className="divider" style={{ margin: '0' }} />

            {/* Delivery */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-secondary)', padding: '12px 16px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)' }}>
              <FaTruck style={{ color: 'var(--primary)' }} />
              <span>Free delivery on orders above ₹499. Easy 14-day returns.</span>
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 'auto' }}>
              {!isAdmin && (
                <button className="btn-primary" onClick={handleAddToCart} disabled={!inStock || !selectedSize}
                  style={{ flex: 1, padding: '16px', fontSize: 16, opacity: (!inStock || !selectedSize) ? 0.5 : 1 }}>
                  <FaShoppingCart /> {inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              )}
              {selectedSizeInfo && selectedSizeInfo.stock <= 5 && (
                <span style={{ fontSize: 12, color: 'var(--danger)', fontWeight: 600, width: 100 }}>
                  Only {selectedSizeInfo.stock} left in size {selectedSize}!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Related */}
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 20, color: 'var(--text-primary)' }}>
            More like this
          </h2>
          <ReleatedProduct category={product.category} productId={product._id} />
        </div>
      </div>
    </div>
  );
};

export default DetailedProduct;