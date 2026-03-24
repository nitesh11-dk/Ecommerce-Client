import { useContext, useState } from 'react';
import AppContext from '../../context/AppContext';
import Cards from './Cards';
import { FaSearch, FaSlidersH } from 'react-icons/fa';
import { SHOE_CATEGORIES, GENDERS, BRAND_NAME, BRAND_TAGLINE } from '../../constants/config';
import { Navigate } from 'react-router-dom';

const ShowProduct = () => {
  const { products, searchFilter, isAdmin } = useContext(AppContext);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeGender, setActiveGender] = useState('all');

  if (isAdmin) return <Navigate to="/adminpanel" />;

  const filtered = products?.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchFilter.toLowerCase());
    const matchCat = activeCategory === 'all' || p.category?.toLowerCase() === activeCategory;
    const matchGender = activeGender === 'all' || p.gender?.toLowerCase() === activeGender;
    return matchSearch && matchCat && matchGender;
  }) ?? [];

  return (
    <div style={{ background: 'var(--bg)', minHeight: 'calc(100vh - 64px)' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #4f46e5 100%)',
        padding: '48px 24px 40px', textAlign: 'center', color: '#fff',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', top: -100, right: -80 }} />
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', bottom: -60, left: -40 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>👟</div>
          <h1 style={{ fontWeight: 900, fontSize: 36, marginBottom: 10, letterSpacing: '-0.03em' }}>
            {BRAND_NAME}
          </h1>
          <p style={{ opacity: 0.75, fontSize: 16, maxWidth: 440, margin: '0 auto' }}>
            {BRAND_TAGLINE}
          </p>

          {/* Gender quick links */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
            {['all', ...GENDERS].map(g => (
              <button key={g} onClick={() => setActiveGender(g)}
                style={{
                  padding: '8px 20px', borderRadius: 99,
                  border: '1.5px solid rgba(255,255,255,0.3)',
                  background: activeGender === g ? '#fff' : 'rgba(255,255,255,0.1)',
                  color: activeGender === g ? '#1e40af' : '#fff',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  textTransform: 'capitalize', transition: 'all 0.18s',
                }}>
                {g === 'all' ? 'All' : g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category filter bar */}
      <div style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 10, overflowX: 'auto',
      }}>
        <FaSlidersH style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        {['all', ...SHOE_CATEGORIES].map(cat => (
          <button key={cat}
            className={`category-pill${activeCategory === cat ? ' active' : ''}`}
            onClick={() => setActiveCategory(cat)}>
            {cat === 'all' ? '👟 All' :
              cat === 'sneakers' ? '🏃 Sneakers' :
              cat === 'formal' ? '👞 Formal' :
              cat === 'sandals' ? '🩴 Sandals' :
              cat === 'sports' ? '⚽ Sports' :
              cat === 'boots' ? '🥾 Boots' :
              cat === 'casual' ? '😎 Casual' : cat}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-muted)', flexShrink: 0, whiteSpace: 'nowrap' }}>
          {filtered.length} item{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Products grid */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 24px' }}>
        {!products ? (
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 360, borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }} className="fade-up">
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>No shoes found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Try a different category, gender, or search term.
            </p>
            <button className="btn-outline" style={{ marginTop: 16 }}
              onClick={() => { setActiveCategory('all'); setActiveGender('all'); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="fade-up">
            <Cards products={filtered} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowProduct;
