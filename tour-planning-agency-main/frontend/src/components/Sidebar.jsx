import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const menuItems = [
  { path: '/admin',          label: 'Dashboard',       icon: '📊', end: true },
  { path: '/admin/packages', label: 'Packages',        icon: '✈️' },
  { path: '/admin/bookings', label: 'Bookings',        icon: '📋' },
  { path: '/admin/users',    label: 'Users',           icon: '👥' },
  { path: '/admin/reviews',  label: 'Reviews',         icon: '⭐' },
  { path: '/admin/messages', label: 'Messages',        icon: '💬' },
  { path: '/admin/settings', label: 'Settings',        icon: '⚙️' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} aria-hidden="true" />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="Admin navigation">
        <div className="sidebar-logo">
          <span>Travel<em>Go</em></span>
          <span className="admin-tag">{user?.role || 'Admin'}</span>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="sidebar-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          className="sidebar-logout"
          onClick={() => { logout(); navigate('/'); }}
          aria-label="Logout"
        >
          <span aria-hidden="true">🚪</span> Logout
        </button>
      </aside>
    </>
  );
}
