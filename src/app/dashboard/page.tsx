"use client";
import { useEffect, useState } from "react";
import "./dashboard.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSubmissions, Submission, updateSubmissionStatus } from "@/lib/store";
import dynamic from "next/dynamic";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';

const DashboardMap = dynamic(() => import("@/components/Map"), { 
  ssr: false, 
  loading: () => <div className="fake-map-bg" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b'}}>Loading Live Map...</div> 
});

export default function Dashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'overview' | 'analytics'>('overview');
  
  // Auth state
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal state
  const [selectedReport, setSelectedReport] = useState<Submission | null>(null);
  const [responseText, setResponseText] = useState("");

  const refreshData = () => {
    setSubmissions(getSubmissions());
  };

  useEffect(() => {
    // Check Authentication
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('admin_auth');
      if (auth !== 'true') {
        router.push('/login');
        return;
      }
      setIsAuthenticated(true);
    }

    refreshData();
    
    // Listen for custom event from same tab
    window.addEventListener('safeconnect_update', refreshData);
    
    // Listen for localStorage changes from other tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'safeconnect_submissions') refreshData();
    };
    window.addEventListener('storage', handleStorage);

    const interval = setInterval(refreshData, 3000);
    return () => {
      window.removeEventListener('safeconnect_update', refreshData);
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, [router]);

  const handleUpdateStatus = (status: 'Pending' | 'In Progress' | 'Resolved') => {
    if (selectedReport) {
      updateSubmissionStatus(selectedReport.id, status, responseText);
      refreshData();
      setSelectedReport({ ...selectedReport, status, adminResponse: responseText });
    }
  };

  const baseThemes = [
    { id: 'roads', label: 'Roads & Infrastructure' },
    { id: 'water', label: 'Water Supply' },
    { id: 'health', label: 'Healthcare Access' },
    { id: 'waste', label: 'Waste Management' },
    { id: 'lighting', label: 'Public Lighting' },
    { id: 'education', label: 'Education' },
    { id: 'safety', label: 'Public Safety' },
    { id: 'parks', label: 'Parks & Rec' },
  ];

  const dynamicThemes = baseThemes.map(theme => {
    const realCount = submissions.filter(s => s.category === theme.id || (theme.id === 'other' && !baseThemes.find(b => b.id === s.category))).length;
    return {
      ...theme,
      count: realCount,
      trend: realCount > 0 ? `+${realCount}` : '-'
    };
  });

  const otherCount = submissions.filter(s => !baseThemes.find(b => b.id === s.category)).length;
  if (otherCount > 0) {
    dynamicThemes.push({ id: 'other', label: 'Other / Emerging Issues', count: otherCount, trend: `+${otherCount}` });
  }

  dynamicThemes.sort((a, b) => b.count - a.count);
  const topThemes = dynamicThemes.slice(0, 5);
  const maxCount = topThemes[0]?.count || 1;
  const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

  const filteredSubmissions = selectedFilter 
    ? submissions.filter(s => s.category === selectedFilter || (selectedFilter === 'other' && !baseThemes.find(b => b.id === s.category)))
    : submissions;

  // KPI Calculations
  const pendingCount = submissions.filter(s => s.status === 'Pending').length;
  const inProgressCount = submissions.filter(s => s.status === 'In Progress').length;
  const resolvedCount = submissions.filter(s => s.status === 'Resolved').length;
  const todaySolved = submissions.filter(s => s.status === 'Resolved' && new Date(s.timestamp) > new Date(Date.now() - 86400000)).length;
  const resolutionRate = submissions.length > 0 ? Math.round((resolvedCount / submissions.length) * 100) : 0;

  // Analytics Chart Data
  const statusData = [
    { name: 'Pending', value: pendingCount, color: '#ef4444' },
    { name: 'In Progress', value: inProgressCount, color: '#f59e0b' },
    { name: 'Resolved', value: resolvedCount, color: '#10b981' },
  ];

  // Group submissions by day for LineChart (Last 7 days)
  const trendData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const countForDay = submissions.filter(s => {
      const sDate = new Date(s.timestamp);
      return sDate.getDate() === d.getDate() && sDate.getMonth() === d.getMonth();
    }).length;
    trendData.push({ name: dateStr, Reports: countForDay });
  }

  if (!isAuthenticated) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white' }}>Verifying secure connection...</div>;
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div className="logo-icon">C</div>
            <span>Constituency Pulse</span>
          </div>
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            ☰
          </button>
        </div>

        <div className={`sidebar-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className={`menu-item ${currentView === 'overview' && !selectedFilter ? 'active' : ''}`} onClick={() => { setCurrentView('overview'); setSelectedFilter(null); }} style={{ borderLeft: currentView === 'overview' && !selectedFilter ? '3px solid #0d9488' : 'none' }}>
            <span>⊞</span> Overview Dashboard
          </div>
          
          <div className="sidebar-category">Filter by Category</div>
          
          <div className={`menu-item ${selectedFilter === 'water' ? 'active-filter' : ''}`} onClick={() => { setCurrentView('overview'); setSelectedFilter(selectedFilter === 'water' ? null : 'water'); }}>
            <span>🚰</span> Water Supply
            <span className="menu-item-count">({dynamicThemes.find(t => t.id === 'water')?.count || 0})</span>
          </div>
          <div className={`menu-item ${selectedFilter === 'health' ? 'active-filter' : ''}`} onClick={() => { setCurrentView('overview'); setSelectedFilter(selectedFilter === 'health' ? null : 'health'); }}>
            <span>🏥</span> Healthcare
            <span className="menu-item-count">({dynamicThemes.find(t => t.id === 'health')?.count || 0})</span>
          </div>
          <div className={`menu-item ${selectedFilter === 'roads' ? 'active-filter' : ''}`} onClick={() => { setCurrentView('overview'); setSelectedFilter(selectedFilter === 'roads' ? null : 'roads'); }}>
            <span>🛣️</span> Road Repair
            <span className="menu-item-count">({dynamicThemes.find(t => t.id === 'roads')?.count || 0})</span>
          </div>
          <div className={`menu-item ${selectedFilter === 'waste' ? 'active-filter' : ''}`} onClick={() => { setCurrentView('overview'); setSelectedFilter(selectedFilter === 'waste' ? null : 'waste'); }}>
            <span>♻️</span> Waste Mgt.
            <span className="menu-item-count">({dynamicThemes.find(t => t.id === 'waste')?.count || 0})</span>
          </div>
          <div className={`menu-item ${selectedFilter === 'lighting' ? 'active-filter' : ''}`} onClick={() => { setCurrentView('overview'); setSelectedFilter(selectedFilter === 'lighting' ? null : 'lighting'); }}>
            <span>💡</span> Lighting
            <span className="menu-item-count">({dynamicThemes.find(t => t.id === 'lighting')?.count || 0})</span>
          </div>
          <div className={`menu-item ${selectedFilter === 'other' ? 'active-filter' : ''}`} onClick={() => { setCurrentView('overview'); setSelectedFilter(selectedFilter === 'other' ? null : 'other'); }}>
            <span>➕</span> Emerging
            <span className="menu-item-count" style={otherCount > 0 ? { color: '#0d9488', fontWeight: 'bold' } : {}}>({otherCount})</span>
          </div>
          
          <div className="sidebar-category">Tools</div>
          
          <div className={`menu-item ${currentView === 'analytics' ? 'active' : ''}`} onClick={() => { setCurrentView('analytics'); setSelectedFilter(null); }} style={{ borderLeft: currentView === 'analytics' ? '3px solid #0d9488' : 'none' }}>
            <span>📊</span> Analytics
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-title">MP Admin Dashboard</div>
          <div className="topbar-right">
            <div className="search-bar">
              <span>🔍</span>
              <input type="text" placeholder="Search reports..." />
            </div>
            <Link href="/submit" target="_blank" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', border: '1px solid #0f172a', borderRadius: '6px', color: '#0f172a', background: '#f8fafc', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
              >
                + Submit Test Report
              </button>
            </Link>
            <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="avatar">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" alt="Sarah Chen" />
                </div>
                <div className="user-info">
                  <span className="user-name">Sarah Chen</span>
                  <span className="user-role">MP Admin</span>
                </div>
              </div>
              <button 
                onClick={() => { localStorage.removeItem('admin_auth'); router.push('/login'); }}
                style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="dashboard-body">
          <div className="dashboard-header">
            <div>
              <h1 className="page-title">
                {currentView === 'analytics' ? 'Analytics & Insights' : 
                 (selectedFilter ? `Filtered: ${dynamicThemes.find(t => t.id === selectedFilter)?.label || 'Other'}` : 'Constituency Demand Overview')}
              </h1>
              <p className="page-subtitle">Live Data &bull; {submissions.length} Total Reports Displayed</p>
            </div>
            {currentView === 'overview' && (
              <button className="btn-secondary" style={{ color: '#0f172a', borderColor: '#cbd5e1' }} onClick={() => setSelectedFilter(null)}>
                {selectedFilter ? 'Clear Filter ✕' : 'Filter ⌄'}
              </button>
            )}
          </div>

          {/* KPI Row (Only in Overview) */}
          {currentView === 'overview' && !selectedFilter && (
            <div className="kpi-row">
              <div className="kpi-card">
                <div className="kpi-title">Pending Issues</div>
                <div className="kpi-value" style={{ color: '#ef4444' }}>{pendingCount}</div>
                <div className="kpi-sub" style={{ color: '#ef4444' }}>Requires Attention</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-title">In Progress</div>
                <div className="kpi-value" style={{ color: '#f59e0b' }}>{inProgressCount}</div>
                <div className="kpi-sub" style={{ color: '#64748b' }}>Teams deployed</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-title">Today's Solved</div>
                <div className="kpi-value" style={{ color: '#10b981' }}>{todaySolved}</div>
                <div className="kpi-sub" style={{ color: '#10b981' }}>+24% from yesterday</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-title">Resolution Rate</div>
                <div className="kpi-value">{resolutionRate}%</div>
                <div className="kpi-sub" style={{ color: '#64748b' }}>Total Resolved: {resolvedCount}</div>
              </div>
            </div>
          )}

          {currentView === 'overview' ? (
            <div className="dashboard-grid">
              {/* Map Area */}
              <div className="map-container" style={{ position: 'relative', zIndex: 0, overflow: 'hidden', borderRadius: '12px', border: '1px solid #e2e8f0', height: '600px' }}>
                <DashboardMap submissions={filteredSubmissions} />
              </div>

              {/* Stats Sidebar */}
              <div className="stats-sidebar">
                {!selectedFilter && (
                  <div className="stats-card">
                    <div className="stats-card-title">Top Reported Themes</div>
                    <div className="theme-list">
                      {topThemes.map((theme, index) => (
                        <div className="theme-item" key={theme.id}>
                          <div className="theme-header">
                            <div>
                              <div className="theme-name">{index + 1}. {theme.label}</div>
                              <div className="theme-count">{theme.count.toLocaleString()} Reports</div>
                            </div>
                          </div>
                          <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${(theme.count / maxCount) * 100}%`, background: colors[index] }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Real-Time Incoming Feed */}
                <div className="stats-card" style={{ background: '#f8fafc', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className="stats-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', display: 'inline-block', animation: 'pulse-red 1.5s infinite' }}></span>
                    {selectedFilter ? 'Filtered Reports' : 'Live Reports Feed'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem', overflowY: 'auto', maxHeight: selectedFilter ? '700px' : '350px', paddingRight: '5px' }}>
                    {filteredSubmissions.length === 0 ? (
                      <div style={{ color: '#64748b', fontSize: '0.9rem', padding: '1rem', textAlign: 'center', border: '1px dashed #cbd5e1', borderRadius: '6px' }}>
                        No reports found for this category.
                      </div>
                    ) : (
                      filteredSubmissions.map(sub => (
                        <div 
                          key={sub.id} 
                          onClick={() => {
                            setSelectedReport(sub);
                            setResponseText(sub.adminResponse || "");
                          }}
                          style={{ background: '#ffffff', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0d9488'}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', alignItems: 'flex-start' }}>
                            <span style={{ fontWeight: 700, color: '#0f172a' }}>{sub.categoryLabel}</span>
                            <span className={`status-badge status-${sub.status.replace(' ', '').toLowerCase()}`}>
                              {sub.status}
                            </span>
                          </div>
                          <div style={{ color: '#475569', marginBottom: '0.4rem', fontWeight: 500 }}>📍 {sub.location}</div>
                          <div style={{ color: '#64748b', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>"{sub.description}"</div>
                          <div style={{ fontSize: '0.75rem', color: '#0d9488', marginTop: '0.5rem', fontWeight: 600 }}>
                            {sub.mediaType === 'image' ? '📷 Photo Attached' : (sub.mediaType === 'audio' ? '🎙️ Voice Note Attached' : '📝 Text Only')}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Analytics View */
            <div className="analytics-container">
              <div className="chart-card">
                <div className="chart-title">Report Volume by Category</div>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dynamicThemes.filter(t => t.count > 0)}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-title">Resolution Status</div>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                  {statusData.map(d => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#64748b' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: d.color }}></div>
                      {d.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
                <div className="chart-title">Report Trend (Last 7 Days)</div>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                      <Line type="monotone" dataKey="Reports" stroke="#0d9488" strokeWidth={3} dot={{ r: 4, fill: '#0d9488', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Admin Detailed Report Modal */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '4px' }}>Citizen Report Details</h2>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Submitted on {new Date(selectedReport.timestamp).toLocaleString()}</div>
              </div>
              <button className="close-btn" onClick={() => setSelectedReport(null)}>×</button>
            </div>
            
            <div className="modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>{selectedReport.categoryLabel}</div>
                <span className={`status-badge status-${selectedReport.status.replace(' ', '').toLowerCase()}`}>
                  {selectedReport.status}
                </span>
              </div>
              
              <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>📍</span>
                <div>
                  <div style={{ fontWeight: 500, color: '#334155' }}>{selectedReport.location}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>GPS: {selectedReport.lat?.toFixed(4) || 'N/A'}, {selectedReport.lon?.toFixed(4) || 'N/A'}</div>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Citizen Description</h3>
                <p style={{ color: '#1e293b', lineHeight: 1.5, background: '#f8fafc', padding: '1rem', borderRadius: '6px', borderLeft: '3px solid #0d9488' }}>
                  "{selectedReport.description}"
                </p>
              </div>

              {selectedReport.mediaType !== 'none' && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Attached Evidence</h3>
                  <div className="evidence-box">
                    {selectedReport.mediaType === 'image' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '2rem' }}>📷</span>
                        <span style={{ color: '#475569', fontWeight: 500 }}>User Photo Evidence.jpg</span>
                        <div style={{ width: '100%', height: '150px', background: '#e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                          [Simulated Image Preview]
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0d9488', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>▶</button>
                        <div style={{ flexGrow: 1 }}>
                          <div style={{ fontWeight: 500, color: '#475569', marginBottom: '4px' }}>Citizen Voice Note</div>
                          <div style={{ width: '100%', height: '4px', background: '#cbd5e1', borderRadius: '2px' }}>
                            <div style={{ width: '30%', height: '100%', background: '#0d9488', borderRadius: '2px' }}></div>
                          </div>
                        </div>
                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>0:12</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h3 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Admin Response & Action</h3>
                <textarea 
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type an official response or status update to the citizen..."
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', minHeight: '80px', fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                onClick={() => handleUpdateStatus('In Progress')}
                style={{ flex: 1, padding: '0.75rem', background: '#fef3c7', color: '#b45309', border: '1px solid #fcd34d', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              >
                Mark In Progress
              </button>
              <button 
                onClick={() => handleUpdateStatus('Resolved')}
                style={{ flex: 1, padding: '0.75rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}
              >
                Resolve Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
