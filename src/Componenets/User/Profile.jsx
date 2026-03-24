import { useContext, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaCalendar, FaIdCard, FaEdit, FaTrash, FaShieldAlt, FaBoxOpen } from 'react-icons/fa';

const Profile = () => {
  const { user, userProfile, handleDeleteUser, logoutUser, isAdmin } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => { userProfile(); }, []);

  if (!user) {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="skeleton" style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 16px' }} />
          <div className="skeleton" style={{ width: 160, height: 20, margin: '0 auto 8px' }} />
          <div className="skeleton" style={{ width: 120, height: 16, margin: '0 auto' }} />
        </div>
      </div>
    );
  }

   const initials = user.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
   const joined = new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
   const displayName = user.name?.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ');

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: 'var(--bg)', padding: '40px 24px' }}>
      <div className="fade-up" style={{ maxWidth: 520, margin: '0 auto' }}>
        {/* Card */}
        <div style={{
          background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border)',
          overflow: 'hidden',
        }}>
          {/* Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #1e40af, #4f46e5, #7c3aed)',
            height: 100, position: 'relative',
          }} />

          {/* Avatar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -44, paddingBottom: 32, padding: '0 32px 32px' }}>
            <div style={{
              width: 80, height: 80,
              background: 'linear-gradient(135deg, var(--primary), #7c3aed)',
              borderRadius: '50%', border: '4px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, fontWeight: 800, color: '#fff',
              boxShadow: 'var(--shadow-lg)',
            }}>
              {initials}
            </div>

             <div style={{ marginTop: 14, textAlign: 'center' }}>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                 <h1 style={{ fontWeight: 800, fontSize: 24, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{displayName}</h1>
                 {isAdmin && (
                   <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                     <FaShieldAlt style={{ fontSize: 9 }} /> Admin
                   </span>
                 )}
               </div>
               <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4, opacity: 0.8 }}>{user.email}</p>
             </div>

            {/* Info rows */}
            <div style={{ width: '100%', marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
               {[
                 { icon: <FaUser />, label: 'Profile Name', value: displayName },
                 { icon: <FaEnvelope />, label: 'Email Address', value: user.email },
                 { icon: <FaCalendar />, label: 'Member Since', value: joined },
                 { icon: <FaIdCard />, label: 'Unique ID', value: user._id },
               ].map(({ icon, label, value }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '12px 14px', background: 'var(--surface-2)',
                  borderRadius: 'var(--radius-md)', border: '1px solid var(--border)',
                }}>
                  <span style={{ color: 'var(--primary)', marginTop: 2, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', marginTop: 2, wordBreak: 'break-all' }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24, width: '100%' }}>
              <Link to="/orders" className="btn-primary" style={{ width: '100%', textDecoration: 'none', justifyContent: 'center', padding: '14px', fontSize: 15 }}>
                <FaBoxOpen /> View My Orders
              </Link>
              
              <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                <Link to="/edituser" className="btn-outline" style={{ flex: 1, textDecoration: 'none', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FaEdit /> Edit Profile
                </Link>
                <button className="btn-danger" style={{ flex: 1 }} onClick={() => {
                if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  handleDeleteUser(user._id);
                  logoutUser();
                  navigate('/');
                }
              }}>
                <FaTrash /> Delete Account
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;