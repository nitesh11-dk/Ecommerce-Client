import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaEdit } from 'react-icons/fa';
import AppContext from '../../context/AppContext';
import { toast } from 'react-toastify';

const GENDER_LABELS = { men: '♂ Men', women: '♀ Women', unisex: '⚤ Unisex', kids: '🧒 Kids' };
const CAT_EMOJI = { sneakers: '🏃', formal: '👞', sandals: '🩴', sports: '⚽', boots: '🥾', casual: '😎' };

const Cards = ({ products }) => {
  const { addToCart, isLoggedIn, isAdmin, deleteProduct } = useContext(AppContext);

  if (!products || products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: 56, marginBottom: 14 }}>👟</div>
        <p style={{ fontSize: 16, fontWeight: 500 }}>No shoes found</p>
      </div>
    );
  }

  const handleAddToCart = (e, productId) => {
    e.preventDefault(); e.stopPropagation();
    if (!isLoggedIn) { toast.error('Please log in to add items to cart'); return; }
    addToCart(productId);
  };

  const handleDelete = (e, productId) => {
    e.preventDefault(); e.stopPropagation();
    if (confirm('Delete this product?')) deleteProduct(productId);
  };

  return (
    <div className="product-grid">
      {products.map((product) => {
        const inStock = product.quantity > 0;
        const emoji = CAT_EMOJI[product.category] || '👟';
        const totalSizes = product.sizes?.filter(s => s.stock > 0).length || 0;

        return (
          <div key={product._id} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            transition: 'box-shadow 0.22s, transform 0.22s',
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; }}>

            <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Image */}
              <div style={{ background: '#f8fafc', height: 190, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, position: 'relative' }}>
                <img src={product.image} alt={product.name}
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', transition: 'transform 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />

                {/* Gender badge */}
                <span style={{
                  position: 'absolute', top: 10, left: 10,
                  background: '#eff6ff', color: '#2563eb',
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                }}>
                  {GENDER_LABELS[product.gender] || product.gender}
                </span>

                {/* Out of stock overlay */}
                {!inStock && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(255,255,255,0.7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ background: '#dc2626', color: '#fff', fontWeight: 800, fontSize: 12, padding: '6px 16px', borderRadius: 99 }}>
                      OUT OF STOCK
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: '12px 14px 8px', flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                {/* Brand + Category */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {product.brand}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>· {emoji} {product.category}</span>
                </div>

                <p style={{
                  fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
                  lineHeight: 1.4, display: '-webkit-box',
                  WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {product.name}
                </p>

                {/* Color */}
                {product.color && (
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Color: {product.color}</span>
                )}

                {/* Available sizes preview */}
                {product.sizes?.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 2 }}>
                    {product.sizes.filter(s => s.stock > 0).slice(0, 5).map(s => (
                      <span key={s.size} style={{
                        fontSize: 10, fontWeight: 600, padding: '2px 6px',
                        border: '1px solid var(--border)', borderRadius: 4,
                        background: 'var(--surface-2)', color: 'var(--text-secondary)',
                      }}>
                        {s.size}
                      </span>
                    ))}
                    {totalSizes > 5 && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>+{totalSizes - 5}</span>}
                  </div>
                )}

                {/* Price & stock */}
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6 }}>
                  <span style={{ fontWeight: 800, fontSize: 17 }}>₹{Number(product.price || 0).toLocaleString('en-IN')}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: inStock ? 'var(--success)' : 'var(--danger)' }}>
                    {inStock ? `${product.quantity} left` : 'Sold Out'}
                  </span>
                </div>
              </div>
            </Link>

            {/* Action buttons */}
            <div style={{ padding: '10px 14px 14px', display: 'flex', gap: 8, borderTop: '1px solid var(--border)' }}>
              {isAdmin ? (
                <>
                  <Link to={`/update/${product._id}`} className="btn-outline"
                    style={{ flex: 1, fontSize: 12, padding: '7px 8px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <FaEdit style={{ fontSize: 11 }} /> Edit
                  </Link>
                  <button className="btn-danger" style={{ flex: 1, fontSize: 12, padding: '7px 8px' }}
                    onClick={(e) => handleDelete(e, product._id)}>
                    <FaTrash style={{ fontSize: 11 }} /> Delete
                  </button>
                </>
              ) : (
                <button className="btn-primary"
                  style={{ flex: 1, fontSize: 13, padding: '8px 10px', opacity: inStock ? 1 : 0.5 }}
                  onClick={(e) => inStock && handleAddToCart(e, product._id)}
                  disabled={!inStock}>
                  <FaShoppingCart style={{ fontSize: 13 }} />
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Cards;