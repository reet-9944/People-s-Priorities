"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getSubmissions, Submission, supportSubmission, unsupportSubmission } from '@/lib/store';
import './public-dashboard.css';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function PublicDashboardPage() {
  const [issues, setIssues] = useState<Submission[]>([]);
  const [supportedIds, setSupportedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setIssues(getSubmissions());
  }, []);

  const handleSupport = (id: string) => {
    if (supportedIds.has(id)) {
      unsupportSubmission(id);
      const newIds = new Set(supportedIds);
      newIds.delete(id);
      setSupportedIds(newIds);
    } else {
      supportSubmission(id);
      setSupportedIds(new Set([...supportedIds, id]));
    }
    setIssues(getSubmissions());
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Resolved': return '#10b981';
      case 'In Progress': return '#f59e0b';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="public-dash-layout">
      <header className="public-header">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div className="public-title">SafeConnect <span style={{ color: '#0d9488' }}>Live</span></div>
        </Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/submit"><button className="dash-header-btn active">Report Issue</button></Link>
          <Link href="/login"><button className="dash-header-btn outline">Official Login</button></Link>
        </div>
      </header>

      <main className="public-content">
        {/* Left Column: Community Feed */}
        <div className="feed-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Community Feed</h2>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{issues.length} Active Issues</div>
          </div>
          
          {issues.map(issue => (
            <div key={issue.id} className="feed-card">
              <div className="feed-cat">{issue.categoryLabel} • {issue.location}</div>
              <p className="feed-desc">{issue.description}</p>
              
              <div className="feed-footer">
                <button 
                  className={`support-btn ${supportedIds.has(issue.id) ? 'supported' : ''}`}
                  onClick={() => handleSupport(issue.id)}
                >
                  <span className="support-icon">{supportedIds.has(issue.id) ? '❤️' : '🤍'}</span>
                  {issue.supports || 0} Supporters
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: getStatusColor(issue.status) }}></div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    {issue.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Live Map */}
        <div className="map-container">
          <Map submissions={issues} />
        </div>
      </main>
    </div>
  );
}
