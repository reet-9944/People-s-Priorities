"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSubmissions, Submission } from '@/lib/store';
import './user-dashboard.css';

export default function UserDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPhone, setUserPhone] = useState("");
  const [myReports, setMyReports] = useState<Submission[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('user_auth');
      if (!auth) {
        router.push('/login');
        return;
      }
      setUserPhone(auth);
      setIsAuthenticated(true);

      // Mock getting the user's personal reports. 
      // In a real app, we'd filter by a user ID. For the demo, we'll just grab the 2 most recently submitted items to pretend they are the user's.
      const allSubs = getSubmissions();
      setMyReports(allSubs.slice(0, 2));
    }
  }, [router]);

  if (!isAuthenticated) return null;

  return (
    <div className="user-dash-layout">
      <nav className="user-nav">
        <div style={{ fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#0d9488' }}>🛡️</span> SafeConnect
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Account: {userPhone}</span>
          <button 
            onClick={() => { localStorage.removeItem('user_auth'); router.push('/'); }}
            style={{ padding: '0.4rem 1rem', background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="user-container">
        <div className="user-header">
          <h1 className="user-title">My Citizen Dashboard</h1>
          <p style={{ color: '#64748b' }}>Track your secure submissions and receive official notifications.</p>
        </div>

        <div className="dash-grid">
          {/* Left Column: Reports */}
          <div className="card">
            <div className="card-title">
              Active Submissions
              <Link href="/submit"><button style={{ padding: '0.4rem 1rem', background: '#0d9488', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>+ New Report</button></Link>
            </div>
            
            {myReports.map(report => (
              <div key={report.id} className="ticket-item">
                <div className="ticket-header">
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{report.categoryLabel}</div>
                  <span className={`status-badge status-${report.status.replace(' ', '').toLowerCase()}`} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>
                    {report.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>ID: {report.id} • {new Date(report.timestamp).toLocaleDateString()}</div>
                <div style={{ color: '#475569', fontSize: '0.9rem', fontStyle: 'italic' }}>"{report.description}"</div>
              </div>
            ))}
          </div>

          {/* Right Column: Notifications Inbox */}
          <div className="card" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
            <div className="card-title">
              Inbox Notifications
              <span style={{ background: '#ef4444', color: 'white', fontSize: '0.75rem', padding: '0.1rem 0.5rem', borderRadius: '12px' }}>{myReports.filter(r => r.status !== 'Pending').length} New</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {myReports.filter(r => r.status !== 'Pending').length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                  No new notifications right now.
                </div>
              ) : (
                myReports.map(report => (
                  report.status !== 'Pending' && (
                    <div key={`notif-${report.id}`} className="notification-item">
                      <div className="notif-icon">{report.status === 'Resolved' ? '✅' : '⚠️'}</div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Update on {report.categoryLabel}</div>
                        <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.25rem' }}>
                          Status changed to <strong>{report.status}</strong>. 
                          {report.adminResponse && <span style={{ display: 'block', marginTop: '0.25rem', color: '#0d9488' }}>"{report.adminResponse}"</span>}
                        </div>
                      </div>
                    </div>
                  )
                ))
              )}
              
              <div className="notification-item" style={{ borderLeftColor: '#cbd5e1', background: 'white' }}>
                <div className="notif-icon">👋</div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Welcome to SafeConnect</div>
                  <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.25rem' }}>Thank you for registering. You can securely track your community impact here.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
