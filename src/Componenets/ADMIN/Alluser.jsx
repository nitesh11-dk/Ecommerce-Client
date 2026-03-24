import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/config';
import AppContext from '../../context/AppContext';
import { toast } from 'react-toastify';
import { FaShieldAlt, FaTrash, FaUser } from 'react-icons/fa';

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toggleAdminStatus, user: currentUser } = useContext(AppContext);

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get(`${BASE_URL}/user/all`, { headers: { Auth: token }, withCredentials: true });
      setUsers(res.data.users);
    } catch (e) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (userId) => {
    const newStatus = await toggleAdminStatus(userId);
    if (newStatus !== false) {
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isAdmin: newStatus } : u));
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`${BASE_URL}/user/${userId}`, { headers: { Auth: token }, withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        setUsers(prev => prev.filter(u => u._id !== userId));
      }
    } catch { toast.error('Delete failed'); }
  };

  useEffect(() => { fetchAllUsers(); }, []);

  if (loading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
      {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 160, borderRadius: 'var(--radius-lg)' }} />)}
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="section-title">All Users</h1>
          <p className="section-subtitle">{users.length} registered users</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {users.filter(u => u._id !== currentUser?._id).map((u) => {
          const isCurrentUser = currentUser?._id === u._id;
          return (
            <div key={u._id} className="card-surface fade-up" style={{
              padding: '20px', position: 'relative',
              borderLeft: isCurrentUser ? '3px solid var(--primary)' : '1px solid var(--border)',
            }}>
              {/* Badges */}
              <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6 }}>
                {u.isAdmin && <span className="badge badge-primary"><FaShieldAlt style={{ fontSize: 9 }} /> Admin</span>}
                {isCurrentUser && <span className="badge badge-success">You</span>}
              </div>

              {/* Avatar & info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: 16, flexShrink: 0,
                }}>
                  {u.name?.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</p>
                </div>
              </div>

              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
                Joined {new Date(u.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </div>

              {!isCurrentUser && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleToggleAdmin(u._id)}
                    className={u.isAdmin ? 'btn-outline' : 'btn-primary'}
                    style={{ flex: 1, fontSize: 12, padding: '6px 8px' }}>
                    {u.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                  </button>
                  <button className="btn-icon" onClick={() => handleDelete(u._id)}
                    style={{ color: 'var(--danger)', borderColor: '#fecaca' }} title="Delete">
                    <FaTrash style={{ fontSize: 13 }} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AllUsers;
