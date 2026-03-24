import React, { useContext } from 'react';
import AppContext from '../context/AppContext';
import { FaPlus, FaMinus, FaTrash, FaShoppingBag, FaArrowRight } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, decreaseQuantity, addToCart, removeItem } = useContext(AppContext);
  const navigate = useNavigate();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="fade-up" style={{ minHeight: 'calc(100vh - 64px)', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, paddingBottom: 100 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Your cart is empty</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', padding: '14px 32px', fontSize: 16, width: '100%' }}>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const totalQty = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <div className="fade-up" style={{ minHeight: 'calc(100vh - 64px)', background: 'var(--bg)', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontWeight: 800, fontSize: 28, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
          <FaShoppingBag style={{ color: 'var(--primary)' }} /> Shopping Cart
        </h1>

        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Cart Items List */}
          <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {cart.items.map((item) => (
              <div key={item._id} className="card-surface" style={{ display: 'flex', padding: 20, gap: 24, alignItems: 'center' }}>
                {/* Product Image */}
                <div style={{ width: 100, height: 100, background: '#f8fafc', borderRadius: 12, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <img src={item.productId.image} alt={item.productId.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>

                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Link to={`/product/${item.productId._id}`} style={{ textDecoration: 'none', color: 'var(--text-primary)' }}>
                      <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>{item.productId.name}</h3>
                    </Link>
                    <span style={{ fontWeight: 800, fontSize: 18 }}>₹{Number(item.totalPrice).toLocaleString('en-IN')}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>₹{Number(item.productId.price).toLocaleString('en-IN')} each</span>
                    {item.selectedSize && (
                      <span style={{ fontSize: 12, fontWeight: 700, background: 'var(--surface-2)', padding: '2px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>
                        Size: {item.selectedSize}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
                    {/* Qty Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', width: 'fit-content', background: '#fff' }}>
                      <button className="qty-btn" onClick={() => decreaseQuantity(item.productId._id, item.selectedSize)}>
                        <FaMinus style={{ fontSize: 11 }} />
                      </button>
                      <span style={{ fontWeight: 700, fontSize: 15, width: 44, textAlign: 'center' }}>{item.quantity}</span>
                      <button className="qty-btn" onClick={() => addToCart(item.productId._id, item.selectedSize)}>
                        <FaPlus style={{ fontSize: 11 }} />
                      </button>
                    </div>

                    <button className="btn-icon" onClick={() => { if (confirm('Remove item?')) removeItem(item.productId._id, item.selectedSize); }} style={{ color: 'var(--danger)', borderColor: '#fecaca', width: 36, height: 36 }}>
                      <FaTrash style={{ fontSize: 14 }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="card-surface" style={{ flex: '0 0 340px', position: 'sticky', top: 90, padding: 24 }}>
            <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 20 }}>Order Summary</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 15 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal ({totalQty} items)</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{Number(totalPrice).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Delivery logic</span>
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>Free</span>
              </div>

              <div className="divider" style={{ margin: '8px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 20 }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>₹{Number(totalPrice).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button className="btn-primary" onClick={() => navigate('/checkout')} style={{ width: '100%', marginTop: 24, padding: '16px', fontSize: 16 }}>
              Proceed to Checkout <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
