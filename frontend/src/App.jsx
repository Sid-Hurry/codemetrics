import React, { useState, useEffect, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom';

// Layout & Auth Pages
import SidebarLayout from './pages/Layout/SidebarLayout';
import PublicLayout from './pages/Layout/PublicLayout';
import Landing from './pages/Landing';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AuthCallback from './pages/Auth/AuthCallback';

// Dashboard Views
import Dashboard from './pages/Dashboard';
import SearchPage from './pages/Search';
import HistoryPage from './pages/History';
import Favorites from './pages/Favorites';
import Compare from './pages/Compare';
import Settings from './pages/Settings';


// Toast Notifications
import Toast from './components/Toast';
import ScrollToTop from './components/ScrollToTop';
import { api } from './utils/api';

// Route protection wrapper
function ProtectedRoute({ user, loading, children }) {
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-app)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%', margin: '0 auto 1rem auto' }}></div>
          <p style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>Verifying credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Toast notifier helper
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Re-authenticate session on page reload/load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getMe()
        .then((data) => {
          setUser(data.user);
        })
        .catch((err) => {
          console.warn('Session expired. Cleaning tokens.');
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <ScrollToTop />
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
        {/* Toast alerts layer */}
        <div className="toast-container" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>

        <Routes>
          {/* Public Pages Layout Group */}
          <Route element={<PublicLayout user={user} />}>
            <Route path="/" element={<Landing user={user} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact addToast={addToast} />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Route>

          {/* Public Authentication Routes */}
          <Route
            path="/login"
            element={
              user ? <Navigate to="/app" replace /> : <Login onLoginSuccess={setUser} addToast={addToast} />
            }
          />
          <Route
            path="/register"
            element={
              user ? <Navigate to="/app" replace /> : <Register onRegisterSuccess={setUser} addToast={addToast} />
            }
          />
          <Route
            path="/auth/callback"
            element={
              <AuthCallback onLoginSuccess={setUser} addToast={addToast} />
            }
          />

          {/* Protected Workspace Layout Routes under /app */}
          <Route
            path="/app"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <SidebarLayout user={user} onLogout={handleLogout} addToast={addToast} />
              </ProtectedRoute>
            }
          >
            <Route index element={<SearchPage addToast={addToast} />} />
            <Route path="dashboard" element={<Dashboard addToast={addToast} />} />
            <Route path="history" element={<HistoryPage addToast={addToast} />} />
            <Route path="favorites" element={<Favorites addToast={addToast} />} />
            <Route path="compare" element={<Compare addToast={addToast} />} />
            <Route path="settings" element={<Settings user={user} />} />
          </Route>

          {/* Fallback Redirection */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
