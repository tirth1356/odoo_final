import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './Dashboard';
import Environmental from './Environmental';
import Social from './Social';
import Governance from './Governance';
import Gamification from './Gamification';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Settings from './Settings';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api';

const SUB_MODULES = {
  dashboard: {
    title: 'ESG Sub-Modules',
    items: [
      { id: 'overview', label: 'Overview', icon: 'analytics' },
      { id: 'metrics', label: 'Metrics', icon: 'monitoring' },
      { id: 'csr', label: 'CSR Activities', icon: 'volunteer_activism' },
      { id: 'goals', label: 'Goals', icon: 'track_changes' },
      { id: 'audit', label: 'Audit Trail', icon: 'history' }
    ]
  },
  environmental: {
    title: 'Environmental Sub-Modules',
    items: [
      { id: 'overview', label: 'Overview', icon: 'analytics' },
      { id: 'factors', label: 'Emission Factors', icon: 'settings_suggest' },
      { id: 'tracking', label: 'Carbon Tracking', icon: 'monitoring' },
      { id: 'goals', label: 'Goals', icon: 'track_changes' },
      { id: 'profiles', label: 'Product Profiles', icon: 'inventory_2' }
    ]
  },
  social: {
    title: 'Social Sub-Modules',
    items: [
      { id: 'overview', label: 'Overview', icon: 'analytics' },
      { id: 'metrics', label: 'Metrics', icon: 'diversity_3' },
      { id: 'csr', label: 'CSR Activities', icon: 'volunteer_activism' },
      { id: 'participation', label: 'Participation', icon: 'fact_check' },
      { id: 'audit', label: 'Audit Trail', icon: 'history' }
    ]
  },
  governance: {
    title: 'Governance Sub-Modules',
    items: [
      { id: 'overview', label: 'Overview', icon: 'analytics' },
      { id: 'metrics', label: 'Metrics', icon: 'monitoring' },
      { id: 'risk', label: 'Risk Assessment', icon: 'warning' },
      { id: 'audit', label: 'Audit Trail', icon: 'history' },
      { id: 'documents', label: 'Documents', icon: 'description' }
    ]
  },
  gaming: {
    title: 'Gamification Sub-Modules',
    items: [
      { id: 'overview', label: 'Overview', icon: 'analytics' },
      { id: 'metrics', label: 'Metrics', icon: 'bar_chart' },
      { id: 'risk', label: 'Risk Assessment', icon: 'warning' },
      { id: 'audit', label: 'Audit Trail', icon: 'history' },
      { id: 'documents', label: 'Documents', icon: 'description' }
    ]
  }
};

const Toast = ({ message, type, onClose }) => (
  <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 border-2 border-on-surface brutalist-shadow text-sm font-bold uppercase transition-all flex items-center justify-between min-w-[300px] ${type === 'error' ? 'bg-error text-white' : 'bg-secondary text-on-secondary'}`}>
    <span>{message}</span>
    <button onClick={onClose} className="ml-4 hover:opacity-70"><span className="material-symbols-outlined text-sm">close</span></button>
  </div>
);

function MainApp() {
  const [currentPage, setCurrentPage] = useState('dashboard'); // dashboard, environmental, social, gaming, reports
  const [currentSubPage, setCurrentSubPage] = useState('overview');
  const [bellOpen, setBellOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [autoEmission, setAutoEmission] = useState(true);
  const [evidenceReq, setEvidenceReq] = useState(true);
  const [badgeAuto, setBadgeAuto] = useState(true);
  const [notifSettings, setNotifSettings] = useState({
    compliance: true,
    csr: true,
    reminders: true,
    badges: true
  });
  
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const [notifications, setNotifications] = useState([
    { id: 1, message: "CRITICAL WARNING: Compliance issue 'Hazardous Batteries Disposal Proof' is overdue!", created_at: "2026-07-12T11:45:00Z" }
  ]);
  const [userProfile, setUserProfile] = useState({ username: "johngreen", points: 120, xp: 350 });
  const [challenges, setChallenges] = useState([
    { id: 1, title: "Bicycle Commute Week", xp: 100, difficulty: "Medium", deadline: "2026-07-31" },
    { id: 2, title: "Meatless Mondays", xp: 50, difficulty: "Easy", deadline: "2026-07-31" }
  ]);
  const [rewards, setRewards] = useState([
    { id: 1, name: "Eco Thermos Flask", points_required: 60, stock: 8 },
    { id: 2, name: "Carbon Offset Certificate", points_required: 100, stock: 99 },
    { id: 3, name: "Organic Tote Bag", points_required: 30, stock: 25 }
  ]);
  
  // Reports
  const [reportFilters, setReportFilters] = useState({ department: '', module: 'environmental', format: 'csv' });
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchGlobalData();
  }, []);

  useEffect(() => {
    setCurrentSubPage('overview');
  }, [currentPage]);

  const fetchGlobalData = async () => {
    try {
      const [resDepts, resRewards, resCh, resDash, resProfile, resConfig] = await Promise.all([
        axios.get(`${API_BASE}/departments/`),
        axios.get(`${API_BASE}/rewards/`),
        axios.get(`${API_BASE}/challenges/`),
        axios.get(`${API_BASE}/system/dashboard/`),
        axios.get(`${API_BASE}/employee-profiles/current/`),
        axios.get(`${API_BASE}/system/config/`)
      ]);
      setDepartments(resDepts.data);
      setRewards(resRewards.data);
      setChallenges(resCh.data);
      
      const dash = resDash.data;
      setNotifications(dash.notifications);
      
      const p = resProfile.data;
      setUserProfile({
        username: p.user?.username || "user",
        points: p.points,
        xp: p.xp
      });

      const cfg = resConfig.data;
      setAutoEmission(cfg.auto_emission_calculation);
      setEvidenceReq(cfg.evidence_requirement);
      setBadgeAuto(cfg.badge_auto_award);
      setNotifSettings({
        compliance: cfg.notify_new_compliance,
        csr: cfg.notify_csr_approval,
        reminders: cfg.notify_policy_reminders,
        badges: cfg.notify_badge_unlocks
      });
    } catch (e) {
      console.warn("Failed to fetch global data:", e);
    }
  };

  const handleRecalculate = async () => {
    try {
      await axios.post(`${API_BASE}/system/calculate-scores/`);
      showToast("ESG scores recalculated successfully!", 'success');
      fetchGlobalData();
    } catch (e) {
      showToast("Simulation: scores recalculated.", 'success');
    }
  };

  const redeemReward = (rewardId) => {
    const r = rewards.find(rw => rw.id === rewardId);
    if (r.stock <= 0) {
      showToast("Out of stock!", 'error');
      return;
    }
    if (userProfile.points < r.points_required) {
      showToast("Insufficient points!", 'error');
      return;
    }
    showToast(`Voucher redeemed: ${r.name} unlocked!`, 'success');
    setUserProfile(prev => ({ ...prev, points: prev.points - r.points_required }));
    setRewards(prev => prev.map(rw => rw.id === rewardId ? { ...rw, stock: rw.stock - 1 } : rw));
  };

  const triggerExport = () => {
    const params = {
      department: reportFilters.department,
      module: reportFilters.module,
      export_format: reportFilters.format
    };
    const query = new URLSearchParams(params).toString();
    showToast(`Generating ${reportFilters.format.toUpperCase()} report for ${reportFilters.module}...`, 'info');
    window.open(`${API_BASE}/system/export-report/?${query}`, '_blank');
  };

  const activeModule = SUB_MODULES[currentPage] || SUB_MODULES['dashboard'];

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md flex flex-col">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-surface border-b-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center px-margin-desktop">
        <div className="font-headline-lg text-headline-lg uppercase tracking-tighter text-on-surface cursor-pointer" onClick={() => setCurrentPage('dashboard')}>
          ESG INTELLIGENCE
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => setCurrentPage('dashboard')} 
            className={`font-bold uppercase px-2 py-1 transition-all ${
              currentPage === 'dashboard' 
                ? 'text-secondary border-b-4 border-secondary' 
                : 'text-on-surface-variant hover:bg-secondary-fixed'
            }`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setCurrentPage('environmental')} 
            className={`font-bold uppercase px-2 py-1 transition-all ${
              currentPage === 'environmental' 
                ? 'text-secondary border-b-4 border-secondary' 
                : 'text-on-surface-variant hover:bg-secondary-fixed'
            }`}
          >
            Environmental
          </button>
          <button 
            onClick={() => setCurrentPage('social')} 
            className={`font-bold uppercase px-2 py-1 transition-all ${
              currentPage === 'social' 
                ? 'text-secondary border-b-4 border-secondary' 
                : 'text-on-surface-variant hover:bg-secondary-fixed'
            }`}
          >
            Social
          </button>
          <button 
            onClick={() => setCurrentPage('governance')} 
            className={`font-bold uppercase px-2 py-1 transition-all ${
              currentPage === 'governance' 
                ? 'text-secondary border-b-4 border-secondary' 
                : 'text-on-surface-variant hover:bg-secondary-fixed'
            }`}
          >
            Governance
          </button>
          <button 
            onClick={() => setCurrentPage('gaming')} 
            className={`font-bold uppercase px-2 py-1 transition-all ${
              currentPage === 'gaming' 
                ? 'text-secondary border-b-4 border-secondary' 
                : 'text-on-surface-variant hover:bg-secondary-fixed'
            }`}
          >
            Gamification
          </button>
          <button 
            onClick={() => setCurrentPage('reports')} 
            className={`font-bold uppercase px-2 py-1 transition-all ${
              currentPage === 'reports' 
                ? 'text-secondary border-b-4 border-secondary' 
                : 'text-on-surface-variant hover:bg-secondary-fixed'
            }`}
          >
            Reports
          </button>
        </nav>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setBellOpen(!bellOpen)} 
            className="p-2 border-2 border-on-surface hover:bg-secondary-fixed transition-all relative"
          >
            <span className="material-symbols-outlined">notifications</span>
            {notifications && notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-error text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-on-surface">{notifications.length}</span>
            )}
          </button>
          <button 
            onClick={() => setSettingsOpen(true)} 
            className="p-2 border-2 border-on-surface hover:bg-secondary-fixed transition-all"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </header>

      {bellOpen && (
        <div className="fixed right-6 top-24 z-50 w-80 bg-white border-4 border-on-surface p-4 brutalist-shadow">
          <h4 className="font-label-bold text-label-bold text-error uppercase mb-2">System Alerts</h4>
          <div className="space-y-2">
            {notifications && notifications.length > 0 ? (
              notifications.map(n => (
                <div key={n.id} className="p-2 bg-error-container border border-on-surface text-[11px] font-bold">
                  {n.message}
                </div>
              ))
            ) : (
              <p className="text-[11px] text-on-surface-variant uppercase">All clear. No notifications.</p>
            )}
          </div>
        </div>
      )}

      {/* Sidebar + Main Content Layout Grid */}
      <div className="flex flex-grow pt-20">
        
        {/* Left Sidebar */}
        <aside className="fixed left-0 top-20 h-[calc(100vh-80px)] w-64 bg-surface-container flex flex-col p-4 space-y-4 border-r-2 border-on-surface sidebar-shadow overflow-y-auto z-40 select-none">
          
          {/* Logo Brand Header */}
          <div className="flex items-center space-x-3 mb-6 p-2 border-2 border-on-surface bg-surface">
            <div className="w-10 h-10 border-2 border-on-surface overflow-hidden">
              <img 
                className="w-full h-full object-cover" 
                alt="Institutional ESG Logo" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4Dc2XsMEY7XIBm1p_UINAVq6_Q_hKl7_YyWp3s9VmiEvWqHBm3S0S9KAq4y19mPkItsoWE3i-Z1jaw4eqjqLjkpy1ouCmJGqQEBOZvr8Q9cKu_cQF3dVhC4fc7Nu3u8lGbUUYyJBbxFwtqKUNXxrqo188wlfj2BKHxyY3o7AeIX0N9xmibDelt1f4hls6twiNolRUwh-n-SyWkI7DvoWo0xtbs9jdX6OYk9cjhqha79AcAGuRhpAI0g" 
              />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface leading-none">Institutional ESG</h3>
              <p className="font-label-bold text-[10px] text-on-surface-variant uppercase">Verified Portfolio</p>
            </div>
          </div>

          {/* Dynamic Module Sidebar Items */}
          <div className="space-y-2 flex-grow">
            {currentPage === 'governance' ? (
              <>
                <div className="text-label-bold uppercase px-2 text-on-surface-variant opacity-60 mb-2">
                  {activeModule.title}
                </div>
                {activeModule.items.map(item => {
                  const isActive = currentSubPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentSubPage(item.id)}
                      className={`flex items-center space-x-3 p-3 font-label-bold text-label-bold uppercase transition-all w-full text-left ${
                        isActive 
                          ? 'active-sidebar-btn bg-secondary-container text-on-secondary-container' 
                          : 'text-on-surface-variant hover:bg-primary-fixed'
                      }`}
                    >
                      <span className="material-symbols-outlined">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </>
            ) : (
              <>
                <div className="text-label-bold uppercase px-2 text-on-surface-variant opacity-60 mb-2">
                  {activeModule.title}
                </div>
                {activeModule.items.map(item => {
                  const isActive = currentSubPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentSubPage(item.id)}
                      className={`flex items-center space-x-3 p-3 font-label-bold text-label-bold uppercase transition-all w-full text-left ${
                        isActive 
                          ? 'active-sidebar-btn bg-secondary-container text-on-secondary-container' 
                          : 'text-on-surface-variant hover:bg-primary-fixed'
                      }`}
                    >
                      <span className="material-symbols-outlined">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </>
            )}

            {/* Recalculate Impact */}
            <button 
              onClick={handleRecalculate} 
              className="brutalist-button bg-secondary-fixed text-on-secondary-fixed py-3 px-4 flex items-center justify-center space-x-2 w-full mt-6"
            >
              <span className="material-symbols-outlined">refresh</span>
              <span>Recalculate Impact</span>
            </button>
          </div>

          {/* Help & Logout */}
          <div className="pt-4 border-t-2 border-on-surface space-y-1 mt-auto">
            <button
              className="flex items-center space-x-3 p-2 font-label-bold text-label-bold uppercase text-on-surface-variant hover:text-error w-full text-left"
              onClick={() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/';
              }}
            >
              <span className="material-symbols-outlined">logout</span>
              <span>Log Out</span>
            </button>
          </div>

          {/* User Widget */}
          <button
            onClick={() => setCurrentPage('gaming')}
            className="border-t-2 border-on-surface pt-6 flex items-center gap-4 text-left w-full hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 border-2 border-on-surface bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
              {userProfile.username[0].toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-xs">@{userProfile.username}</div>
              <div className="text-[10px] font-label-bold text-secondary uppercase">{userProfile.points} Points | {userProfile.xp} XP</div>
            </div>
          </button>
        </aside>

        {/* Dynamic View Canvas */}
        <main className="lg:ml-64 flex-grow p-6 md:p-10 max-w-6xl mx-auto w-full pb-24">
          {currentPage === 'dashboard' && <Dashboard subPage={currentSubPage} onNavigate={setCurrentPage} showToast={showToast} />}
          {currentPage === 'environmental' && <Environmental subPage={currentSubPage} setSubPage={setCurrentSubPage} onNavigate={setCurrentPage} showToast={showToast} autoEmission={autoEmission} />}
          {currentPage === 'social' && <Social subPage={currentSubPage} setSubPage={setCurrentSubPage} onNavigate={setCurrentPage} showToast={showToast} evidenceReq={evidenceReq} badgeAuto={badgeAuto} notifSettings={notifSettings} />}
          {currentPage === 'governance' && <Governance subPage={currentSubPage} setSubPage={setCurrentSubPage} onNavigate={setCurrentPage} showToast={showToast} onExport={triggerExport} />}

          {currentPage === 'gaming' && (
            <Gamification 
              subPage={currentSubPage} 
              setSubPage={setCurrentSubPage} 
              onNavigate={setCurrentPage} 
              showToast={showToast} 
              badgeAuto={badgeAuto} 
              notifSettings={notifSettings}
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              notifications={notifications}
              setNotifications={setNotifications}
              rewards={rewards}
              setRewards={setRewards}
            />
          )}

          {currentPage === 'reports' && (
            <div className="max-w-2xl mx-auto bg-white border-4 border-on-surface p-8 brutalist-shadow">
              <h3 className="font-headline-md text-headline-md uppercase mb-2">EXPORT SYSTEM DATA</h3>
              <p className="font-body-md text-on-surface-variant mb-6 uppercase text-xs">Download authorized ESG audits in CSV/Excel sheets</p>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block font-label-bold text-xs uppercase">Target Domain Module</label>
                  <select value={reportFilters.module} onChange={e => setReportFilters({...reportFilters, module: e.target.value})} className="w-full bg-surface-container border-2 border-on-surface p-3 text-xs" required>
                    <option value="environmental">Environmental Pillar</option>
                    <option value="social">Social & CSR Pillar</option>
                    <option value="governance">Governance Compliance Pillar</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-label-bold text-xs uppercase">Filter Department</label>
                    <select value={reportFilters.department} onChange={e => setReportFilters({...reportFilters, department: e.target.value})} className="w-full bg-surface-container border-2 border-on-surface p-3 text-xs">
                      <option value="">All Departments</option>
                      {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block font-label-bold text-xs uppercase">Export Format</label>
                    <select value={reportFilters.format} onChange={e => setReportFilters({...reportFilters, format: e.target.value})} className="w-full bg-surface-container border-2 border-on-surface p-3 text-xs">
                      <option value="csv">CSV File</option>
                      <option value="excel">Excel (CSV-comp)</option>
                      <option value="pdf">PDF Preview (HTML)</option>
                    </select>
                  </div>
                </div>

                <button className="w-full mt-6 bg-secondary text-on-secondary font-headline-md text-headline-md py-4 border-2 border-on-surface brutalist-shadow brutalist-shadow-active brutalist-shadow-hover uppercase" onClick={triggerExport}>
                  DOWNLOAD ESG REPORT
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Bottom Navigation Bar (Mobile Viewports Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-surface border-t-2 border-on-background">
        <div onClick={() => setCurrentPage('dashboard')} className={`flex flex-col items-center justify-center p-1 cursor-pointer ${currentPage === 'dashboard' ? 'bg-secondary-container text-on-secondary-container border-2 border-on-background shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg scale-95' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-label-bold uppercase">Overview</span>
        </div>
        <div onClick={() => setCurrentPage('environmental')} className={`flex flex-col items-center justify-center p-1 cursor-pointer ${currentPage === 'environmental' ? 'bg-secondary-container text-on-secondary-container border-2 border-on-background shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg scale-95' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined">eco</span>
          <span className="text-[10px] font-label-bold uppercase">Eco</span>
        </div>
        <div onClick={() => setCurrentPage('social')} className={`flex flex-col items-center justify-center p-1 cursor-pointer ${currentPage === 'social' ? 'bg-secondary-container text-on-secondary-container border-2 border-on-background shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg scale-95' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined">groups</span>
          <span className="text-[10px] font-label-bold uppercase">Social</span>
        </div>
        <div onClick={() => setCurrentPage('gaming')} className={`flex flex-col items-center justify-center p-1 cursor-pointer ${currentPage === 'gaming' ? 'bg-secondary-container text-on-secondary-container border-2 border-on-background shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg scale-95' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined">military_tech</span>
          <span className="text-[10px] font-label-bold uppercase">Gaming</span>
        </div>
      </nav>

      <Settings 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
        autoEmission={autoEmission} 
        setAutoEmission={setAutoEmission} 
        evidenceReq={evidenceReq} 
        setEvidenceReq={setEvidenceReq} 
        badgeAuto={badgeAuto} 
        setBadgeAuto={setBadgeAuto} 
        notifSettings={notifSettings} 
        setNotifSettings={setNotifSettings} 
        showToast={showToast} 
      />
    </div>
  );
}

export default function App() {

  return (
    <Router>
      <Routes>
        {/* We can make a separate Dashboard page later, for now landing page is the "home" */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/app/*" element={<MainApp />} />
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
