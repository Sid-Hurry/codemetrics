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
    { label: 'Search', path: '/app', icon: Search },
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
          <div className="sidebar-logo" style={{ marginBottom: '1.5rem', padding: '0.5rem 0.75rem' }}>
            <span className="sidebar-logo-text" style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              CodeMetrics
            </span>
          </div>
          <nav className="sidebar-nav" style={{ marginTop: '1rem' }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === '/app' && location.pathname === '/app/');
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                  style={{ paddingLeft: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                >
                  <Icon 
                    style={{ 
                      width: '16px', 
                      height: '16px', 
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      strokeWidth: 2
                    }} 
                  />
                  {item.label}
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
                src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='8' r='4'/><path d='M18 21a6 6 0 0 0-12 0'/></svg>"
                alt={user.name}
                className="sidebar-user-avatar"
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
