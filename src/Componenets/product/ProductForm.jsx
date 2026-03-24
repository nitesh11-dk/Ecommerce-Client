import React, { useContext, useState } from 'react';
import AppContext from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { FaBoxOpen, FaDollarSign, FaImage, FaTag, FaAlignLeft, FaTags, FaPalette, FaCheckCircle, FaUsers } from 'react-icons/fa';
import { SHOE_CATEGORIES, GENDERS, SHOE_SIZES } from '../../constants/config';

function ProductForm() {
  const { addProduct } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', brand: '', description: '', price: '', image: '', category: '', gender: '', color: '' 
  });
  
  // Size stock state: tracking stock for each standard shoe size
  const [sizeStock, setSizeStock] = useState(
    SHOE_SIZES.reduce((acc, size) => ({ ...acc, [size]: '' }), {})
  );

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSizeChange = (size, value) => {
    setSizeStock(prev => ({ ...prev, [size]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Convert sizeStock map to sizes array format expected by backend
    const sizes = Object.entries(sizeStock)
      .map(([size, stock]) => ({ size, stock: parseInt(stock) || 0 }))
      .filter(s => s.stock > 0);

    try {
      if (sizes.length === 0) {
          if (!confirm("No sizes have stock configured. Create out-of-stock product?")) {
              setLoading(false);
              return;
          }
      }
      await addProduct({ ...formData, sizes: JSON.stringify(sizes) });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: 'var(--bg)', padding: '40px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
      <div className="fade-up" style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border)', padding: '36px 40px', width: '100%', maxWidth: 700 }}>
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, var(--primary), #7c3aed)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <FaBoxOpen style={{ color: '#fff', fontSize: 24 }} />
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 24, marginBottom: 8 }}>Add New Shoe</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Add a new product to the SoleStep catalog</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
             {/* General Info */}
             {[
                { name: 'name',   label: 'Product Name', icon: <FaBoxOpen />,    type: 'text',   placeholder: 'Air Max 90' },
                { name: 'brand',  label: 'Brand',        icon: <FaTags />,       type: 'text',   placeholder: 'Nike' },
                { name: 'price',  label: 'Price (₹)',    icon: <FaDollarSign />, type: 'number', placeholder: '4999' },
                { name: 'color',  label: 'Color',        icon: <FaPalette />,    type: 'text',   placeholder: 'Black / Red' },
            ].map(({ name, label, icon, type, placeholder }) => (
                <div key={name}>
                <label className="form-label" htmlFor={name}>{label}</label>
                <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 13 }}>{icon}</span>
                    <input className="form-input" id={name} name={name} type={type} value={formData[name]} onChange={handleChange} placeholder={placeholder} style={{ paddingLeft: 38 }} required={name !== 'color'} />
                </div>
                </div>
            ))}
            
            {/* Category / Gender Selects */}
            <div>
              <label className="form-label" htmlFor="category">Category</label>
              <div style={{ position: 'relative' }}>
                <FaTag style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 13 }} />
                <select className="form-input" id="category" name="category" value={formData.category} onChange={handleChange} style={{ paddingLeft: 38 }} required>
                  <option value="">Select Category</option>
                  {SHOE_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="gender">Gender</label>
              <div style={{ position: 'relative' }}>
                <FaUsers style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 13 }} />
                <select className="form-input" id="gender" name="gender" value={formData.gender} onChange={handleChange} style={{ paddingLeft: 38 }} required>
                  <option value="">Select Gender</option>
                  {GENDERS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'revert', gap: 16 }}>
             {/* Image & Desc */}
             <div>
              <label className="form-label" htmlFor="image">Image URL</label>
              <div style={{ position: 'relative' }}>
                <FaImage style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 13 }} />
                <input className="form-input" id="image" name="image" type="url" value={formData.image} onChange={handleChange} placeholder="https://..." style={{ paddingLeft: 38 }} required />
              </div>
            </div>
            {formData.image && (
              <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', padding: 12, textAlign: 'center', border: '1px solid var(--border)' }}>
                <img src={formData.image} alt="Preview" style={{ maxHeight: 100, maxWidth: '100%', objectFit: 'contain' }} onError={e => e.target.style.display = 'none'} />
              </div>
            )}

            <div>
              <label className="form-label" htmlFor="description">Description</label>
              <div style={{ position: 'relative' }}>
                <FaAlignLeft style={{ position: 'absolute', left: 13, top: 14, color: 'var(--text-muted)', fontSize: 13 }} />
                <textarea className="form-input" id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Features, materials, etc." rows={3} style={{ paddingLeft: 38, resize: 'vertical' }} required />
              </div>
            </div>
          </div>

          <div className="divider" style={{ margin: '8px 0' }} />

          {/* Sizes Stock Grid */}
          <div>
            <div style={{ marginBottom: 12 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700 }}>Size Inventory (Stock Quantity)</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Leave blank for sizes not in stock. Total quantity is auto-calculated.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12 }}>
                {SHOE_SIZES.map(size => (
                    <div key={size} style={{ background: 'var(--surface-2)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Size {size}</label>
                        <input type="number" min="0" placeholder="0" className="form-input" 
                            style={{ height: 32, padding: '0 8px', textAlign: 'center', fontSize: 14 }}
                            value={sizeStock[size]} onChange={e => handleSizeChange(size, e.target.value)} />
                    </div>
                ))}
            </div>
            <div style={{ background: '#eff6ff', color: '#1e40af', padding: '10px 14px', borderRadius: 8, marginTop: 14, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaCheckCircle /> Total calculated stock: {Object.values(sizeStock).reduce((sum, val) => sum + (parseInt(val) || 0), 0)} units
            </div>
          </div>


          <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '14px', fontSize: 16, marginTop: 10, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Adding Product…' : 'Publish Shoe to Store'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
