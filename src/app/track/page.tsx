"use client";
import { useState } from 'react';
import Link from 'next/link';
import { getSubmissions, Submission } from '@/lib/store';
import './track.css';

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState('');
  const [result, setResult] = useState<Submission | null>(null);
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!trackingId.trim()) {
      setError('Please enter a Tracking ID');
      setResult(null);
      return;
    }

    const submissions = getSubmissions();
    const found = submissions.find(s => s.id.toUpperCase() === trackingId.toUpperCase());
    
    if (found) {
      setResult(found);
    } else {
      setResult(null);
      setError('No report found with that ID. Please check and try again.');
    }
  };

  return (
    <div className="track-layout">
      <Link href="/" style={{ position: 'absolute', top: '2rem', left: '2rem', textDecoration: 'none', color: '#0d9488', fontWeight: 600 }}>
        ← Back to Home
      </Link>
      
      <div className="track-container">
        <div className="track-header">
          <h1 className="track-title">Track Your Report</h1>
          <p className="track-subtitle">Enter your anonymous Tracking ID to view the status</p>
        </div>

        <div className="search-card">
          <form onSubmit={handleSearch} className="search-input-group">
            <input 
              type="text" 
              className="search-input"
              placeholder="e.g. A8F9B"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
            />
            <button type="submit" className="search-btn">Check Status</button>
          </form>
          {error && <div className="error-msg">{error}</div>}
        </div>

        {result && (
          <div className="result-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Report ID: {result.id}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>{result.categoryLabel}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Submitted</div>
                <div style={{ fontWeight: 500, color: '#0f172a' }}>{new Date(result.timestamp).toLocaleDateString()}</div>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ color: '#475569' }}>Location:</strong> <span style={{ color: '#0f172a' }}>{result.location}</span>
            </div>
            
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', color: '#475569', fontStyle: 'italic', marginBottom: '2rem' }}>
              "{result.description}"
            </div>

            <h3 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '1rem' }}>Resolution Timeline</h3>
            <div className="timeline">
              <div className={`timeline-step ${result.status === 'Pending' || result.status === 'In Progress' || result.status === 'Resolved' ? 'completed' : ''}`}>
                <div className="step-circle"></div>
                <div className="step-label">Submitted</div>
              </div>
              <div className={`timeline-step ${result.status === 'In Progress' ? 'active' : ''} ${result.status === 'Resolved' ? 'completed' : ''}`}>
                <div className="step-circle"></div>
                <div className="step-label">In Progress</div>
              </div>
              <div className={`timeline-step ${result.status === 'Resolved' ? 'completed' : ''}`}>
                <div className="step-circle"></div>
                <div className="step-label">Resolved</div>
              </div>
            </div>

            {result.adminResponse && (
              <div className="admin-response">
                <div className="admin-label">Official Govt Response</div>
                <div style={{ color: '#1e293b', lineHeight: 1.6 }}>{result.adminResponse}</div>
              </div>
            )}
            
            {!result.adminResponse && result.status !== 'Pending' && (
               <div className="admin-response" style={{ background: '#f1f5f9', borderLeftColor: '#94a3b8' }}>
                <div className="admin-label" style={{ color: '#64748b' }}>Status Update</div>
                <div style={{ color: '#475569' }}>This issue is currently being investigated by local authorities. Please check back later for official comments.</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
