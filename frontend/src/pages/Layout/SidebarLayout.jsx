import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  Search, 
  LayoutDashboard, 
  History, 
  Bookmark, 
  GitCompare, 
  Settings 
} from 'lucide-react';
import { api } from '../../utils/api';

export default function SidebarLayout({ user, onLogout, addToast }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.logout();
      onLogout();
      addToast('Logged out successfully.', 'success');
      navigate('/login');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const navItems = [
    { label: 'Search', path: '/app/search', icon: Search },
    { label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { label: 'History', path: '/app/history', icon: History },
    { label: 'Favorites', path: '/app/favorites', icon: Bookmark },
    { label: 'Compare', path: '/app/compare', icon: GitCompare },
    { label: 'Settings', path: '/app/settings', icon: Settings },
  ];

  return (
    <div className="app-layout">
      {/* Sidebar navigation */}
      <aside className="sidebar">
        <div>
          <div className="sidebar-logo">
            <span className="sidebar-logo-text">CodeMetrics</span>
          </div>

          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <IconComponent size={16} style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' }} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile section at the bottom */}
        {user && (
          <div className="sidebar-user">
            <div className="sidebar-user-info">
              <img
                src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=32&h=32&q=80'}
                alt={user.name}
                className="sidebar-user-avatar"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=32&h=32&q=80';
                }}
              />
              <div className="sidebar-user-name" title={user.name || user.email}>
                {user.name || user.email.split('@')[0]}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="sidebar-logout-btn"
              style={{ fontSize: '0.8rem', fontWeight: '600', border: 'none', background: 'none', cursor: 'pointer' }}
            >
              Sign Out
            </button>
          </div>
        )}
      </aside>

      {/* Main page content slot */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
