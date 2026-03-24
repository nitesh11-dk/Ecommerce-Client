import React, { useContext } from 'react';
import AppContext from '../context/AppContext';
import { FaPlus, FaMinus, FaTrash, FaMapMarkerAlt, FaPhone, FaCreditCard, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL, razorpayKey } from '../constants/config';

const Checkout = () => {
  const { cart, addToCart, isLoggedIn, decreaseQuantity, removeItem, userAddress, user, clearCart } = useContext(AppContext);
  const navigate = useNavigate();

  if (!cart || cart.items.length === 0) {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>No items in cart</h1>
          <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const totalQty = cart.items.reduce((a, i) => a + i.quantity, 0);
  const totalPrice = cart.items.reduce((a, i) => a + i.totalPrice, 0);

  const handlePayment = async () => {
    if (!userAddress) {
      toast.error('Please add a delivery address first');
      navigate('/address');
      return;
    }
    try {
      const orderRes = await axios.post(`${BASE_URL}/payment/checkout`, {
        amount: totalPrice, cardItems: cart?.items, userId: user?._id, userShippingAddress: userAddress,
      });
      const { orderId, amount } = orderRes.data;
      const options = {
        key: razorpayKey, amount, currency: 'INR',
        name: 'SoleStep', description: 'Order Payment',
        order_id: orderId,
        handler: async (res) => {
          const api = await axios.post(`${BASE_URL}/payment/verify-payment`, {
            orderId: res.razorpay_order_id, paymentId: res.razorpay_payment_id,
            signature: res.razorpay_signature, amount, orderItems: cart?.items,
            userId: user?._id, userShippingAddress: userAddress,
          });
          if (api.data.success) { clearCart(); toast.success('Payment successful!'); navigate('/orderconfirmation'); }
        },
        prefill: { name: user?.name, email: user?.email, contact: userAddress?.phoneNumber },
        theme: { color: '#2563eb' },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => { toast.error('Payment failed. Try again.'); });
      rzp.open();
    } catch (e) {
      toast.error('Payment initialization failed. Try again.');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: 'var(--bg)', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontWeight: 800, fontSize: 26, marginBottom: 24 }}>Order Summary</h1>

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          {/* Items table */}
          <div style={{ flex: 1 }}>
            <div className="card-surface" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: 15 }}>
                Cart Items ({totalQty})
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style={{ textAlign: 'center' }}>Qty</th>
                    <th style={{ textAlign: 'right' }}>Price</th>
                    <th style={{ textAlign: 'right' }}>Subtotal</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 48, height: 48, background: '#f8fafc', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, flexShrink: 0 }}>
                            <img src={item.productId.image} alt={item.productId.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                          </div>
                          <Link to={`/product/${item.productId._id}`} style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 500, fontSize: 13, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {item.productId.name}
                          </Link>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          <button className="qty-btn" onClick={() => decreaseQuantity(item.productId._id)} style={{ width: 26, height: 26 }}><FaMinus style={{ fontSize: 9 }} /></button>
                          <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                          <button className="qty-btn" onClick={() => addToCart(item.productId._id)} style={{ width: 26, height: 26 }}><FaPlus style={{ fontSize: 9 }} /></button>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', fontSize: 13 }}>₹{Number(item.productId.price).toLocaleString('en-IN')}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{Number(item.totalPrice).toLocaleString('en-IN')}</td>
                      <td>
                        <button className="btn-icon" style={{ color: 'var(--danger)', borderColor: '#fecaca', width: 30, height: 30 }}
                          onClick={() => { if (confirm('Remove?')) removeItem(item.productId._id); }}>
                          <FaTrash style={{ fontSize: 11 }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Address + Totals + Pay */}
          <div style={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Address */}
            <div className="card-surface" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontWeight: 700, fontSize: 15 }}>
                <FaMapMarkerAlt style={{ color: 'var(--primary)' }} /> Delivery Address
              </div>
              {userAddress ? (
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  <p>{userAddress.address}</p>
                  <p>{userAddress.city}, {userAddress.state}</p>
                  <p>{userAddress.country}</p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <FaPhone style={{ fontSize: 11, color: 'var(--primary)' }} /> {userAddress.phoneNumber}
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 10 }}>No address saved</p>
                  <Link to="/address" className="btn-outline" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', padding: '8px' }}>+ Add Address</Link>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="card-surface" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Price Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>MRP ({totalQty} items)</span>
                  <span>₹{Number(totalPrice).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Delivery Charges</span>
                  <span style={{ color: 'var(--success)', fontWeight: 600 }}>Free</span>
                </div>
                <div className="divider" style={{ margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16 }}>
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--primary)' }}>₹{Number(totalPrice).toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button className="btn-accent" style={{ width: '100%', marginTop: 18, padding: '13px', fontSize: 15 }}
                onClick={handlePayment}>
                <FaCreditCard /> Pay Now
              </button>
              <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <FaLock /> Secured by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
