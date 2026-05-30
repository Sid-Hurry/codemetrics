import React, { useState, useEffect, useCallback } from 'react';
import { Sun, Moon, Github, BarChart3, Users, GitCompare, Info } from 'lucide-react';
import SearchBar from './components/SearchBar';
import ProfileSummary from './components/ProfileSummary';
import ScoreGauge from './components/ScoreGauge';
import RepoHighlights from './components/RepoHighlights';
import HistoryTable from './components/HistoryTable';
import SkeletonLoader from './components/SkeletonLoader';
import VersusMode from './components/VersusMode';
import About from './components/About';
import Toast from './components/Toast';
import { api } from './utils/api';

export default function App() {
  // 1. Theme Configuration
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // 2. Active Tab State ('dashboard', 'compare', or 'about')
  const [activeTab, setActiveTab] = useState('dashboard');

  // 3. Data State
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [historyProfiles, setHistoryProfiles] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]); // Non-paginated list for Versus Mode selection
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });
  
  // 4. Filters and Sorting State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('DESC');
  const [page, setPage] = useState(1);

  // 5. Loading States
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);

  // 6. Toast Overlay List State
  const [toasts, setToasts] = useState([]);

  // Sync theme to DOM element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Helper to add fresh Toast notifications
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch paginated profiles history from backend
  const fetchHistory = useCallback(async () => {
    setIsTableLoading(true);
    try {
      const response = await api.getProfiles({
        page,
        limit: 5, // Keep view clean and concise
        sortBy,
        order,
        search: debouncedSearch
      });
      setHistoryProfiles(response.data);
      setPagination(response.pagination);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsTableLoading(false);
    }
  }, [page, sortBy, order, debouncedSearch, addToast]);

  // Fetch all profiles for comparison list (non-paginated, sorted by username)
  const fetchAllProfilesForComparison = useCallback(async () => {
    try {
      const response = await api.getProfiles({
        page: 1,
        limit: 100, // Fetch up to 100 for selector options
        sortBy: 'username',
        order: 'ASC',
        search: ''
      });
      setAllProfiles(response.data);
    } catch (err) {
      console.error('Failed to load all profiles for comparison:', err);
    }
  }, []);

  // Trigger search term debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset page on fresh search
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Re-fetch historical records when queries change
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Fetch all profiles whenever history is loaded or updated
  useEffect(() => {
    fetchAllProfilesForComparison();
  }, [historyProfiles, fetchAllProfilesForComparison]);

  // Load first record as default view if none selected
  useEffect(() => {
    if (historyProfiles.length > 0 && !selectedProfile && !isLoadingProfile) {
      setSelectedProfile(historyProfiles[0]);
    }
  }, [historyProfiles, selectedProfile, isLoadingProfile]);

  // 7. Event Handlers
  const handleAnalyze = async (username) => {
    setIsLoadingProfile(true);
    addToast(`Analyzing GitHub profile for "${username}"...`, 'success');
    try {
      const response = await api.analyzeProfile(username);
      setSelectedProfile(response.data);
      addToast(`Successfully analyzed "${username}"!`, 'success');
      setPage(1); // Reset to page 1 to see fresh analysis
      fetchHistory(); // Reload table records
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleDelete = async (username) => {
    if (!window.confirm(`Are you sure you want to delete analyzed profile for "${username}"?`)) return;
    
    try {
      await api.deleteProfile(username);
      addToast(`Purged "${username}" from local archives.`, 'success');
      
      // If deleted account was the one currently viewed, reset selector
      if (selectedProfile && selectedProfile.username === username) {
        setSelectedProfile(null);
      }
      
      fetchHistory();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleSelect = (profile) => {
    setSelectedProfile(profile);
    setActiveTab('dashboard'); // Switch back to dashboard to view profile details
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === 'DESC' ? 'ASC' : 'DESC'));
    } else {
      setSortBy(field);
      setOrder('DESC');
    }
    setPage(1);
  };

  return (
    <div className="app-container">
      {/* Visual Toast Alerts */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* Header bar */}
      <header className="app-header">
        <div className="brand-section">
          <h1 className="brand-title">CodeMetrics</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <Users size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Dashboard
            </button>
            <button
              className={`tab-btn ${activeTab === 'compare' ? 'active' : ''}`}
              onClick={() => setActiveTab('compare')}
            >
              <GitCompare size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Versus Mode
            </button>
            <button
              className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              <Info size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              About
            </button>
          </div>

          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Tab Views Routing */}
      {activeTab === 'dashboard' && (
        <div className="dashboard-layout">
          
          {/* Top Search Bar */}
          <div className="top-search-section">
            <SearchBar onSearch={handleAnalyze} isLoading={isLoadingProfile} />
          </div>

          {/* Dashboard Content Panel */}
          {isLoadingProfile ? (
            <SkeletonLoader />
          ) : selectedProfile ? (
            <div className="dashboard-main-content">
              {/* Left Column: Profile & Score */}
              <div className="dashboard-column-left">
                <ProfileSummary profile={selectedProfile} addToast={addToast} />
                <ScoreGauge score={selectedProfile.developer_score} />
              </div>

              {/* Right Column: Insights & History */}
              <div className="dashboard-column-right">
                <RepoHighlights
                  totalStars={selectedProfile.total_stars}
                  totalForks={selectedProfile.total_forks}
                  mostStarredRepo={selectedProfile.most_starred_repo}
                  mostStarredRepoStars={selectedProfile.most_starred_repo_stars}
                  username={selectedProfile.username}
                  publicRepos={selectedProfile.public_repos}
                  publicGists={selectedProfile.public_gists}
                />
                
                <HistoryTable
                  profiles={historyProfiles}
                  pagination={pagination}
                  onPageChange={setPage}
                  onSort={handleSort}
                  onDelete={handleDelete}
                  onSelect={handleSelect}
                  sortBy={sortBy}
                  order={order}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  isTableLoading={isTableLoading}
                />
              </div>
            </div>
          ) : (
            /* Welcome / Empty State with History visible underneath */
            <div className="dashboard-empty-content">
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '260px', textAlign: 'center', padding: '3rem 2rem', marginBottom: '2rem' }}>
                <BarChart3 size={40} style={{ color: 'var(--accent-secondary)', marginBottom: '1.25rem' }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem' }}>Start Analyzing GitHub Profiles</h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', fontSize: '0.9rem' }}>
                  Enter a GitHub username in the search input above to extract custom developer evaluations, aggregate stars and forks count, and fetch visual repository analytics.
                </p>
              </div>

              <HistoryTable
                profiles={historyProfiles}
                pagination={pagination}
                onPageChange={setPage}
                onSort={handleSort}
                onDelete={handleDelete}
                onSelect={handleSelect}
                sortBy={sortBy}
                order={order}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                isTableLoading={isTableLoading}
              />
            </div>
          )}
        </div>
      )}

      {activeTab === 'compare' && (
        <div className="compare-tab-panel">
          <VersusMode profiles={allProfiles} />
          
          <HistoryTable
            profiles={historyProfiles}
            pagination={pagination}
            onPageChange={setPage}
            onSort={handleSort}
            onDelete={handleDelete}
            onSelect={handleSelect}
            sortBy={sortBy}
            order={order}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            isTableLoading={isTableLoading}
          />
        </div>
      )}

      {activeTab === 'about' && (
        <About />
      )}
    </div>
  );
}
