"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './login.css';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'citizen' | 'official'>('citizen');
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'official') {
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem('admin_auth', 'true');
        
        // Record admin login
        const usersStr = localStorage.getItem('registered_users');
        const users = usersStr ? JSON.parse(usersStr) : [];
        if (!users.find((u: any) => u.phone === 'admin')) {
          localStorage.setItem('registered_users', JSON.stringify([...users, { phone: 'admin', role: 'admin', lastLogin: new Date().toISOString() }]));
        }

        router.push('/dashboard');
      } else {
        setError('Invalid admin credentials. (Hint: use admin / admin)');
      }
    } else {
      // Citizen Login Mock
      if (username.length > 5) {
        localStorage.setItem('user_auth', username);
        
        // Record citizen login
        const usersStr = localStorage.getItem('registered_users');
        const users = usersStr ? JSON.parse(usersStr) : [];
        if (!users.find((u: any) => u.phone === username)) {
          localStorage.setItem('registered_users', JSON.stringify([...users, { phone: username, role: 'citizen', lastLogin: new Date().toISOString() }]));
        }

        router.push('/user-dashboard');
      } else {
        setError('Please enter a valid phone number (e.g. 555-0198)');
      }
    }
  };

  return (
    <div className="login-layout">
      <button onClick={() => router.push('/')} style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'none', border: 'none', color: '#0d9488', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>
        ← Back to Home
      </button>

      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🛡️</div>
          <h1 className="login-title">SafeConnect Portal</h1>
          <p className="login-subtitle">Select your portal to continue</p>
        </div>

        <div className="auth-tabs">
          <div 
            className={`auth-tab ${activeTab === 'citizen' ? 'active' : ''}`}
            onClick={() => { setActiveTab('citizen'); setError(''); setUsername(''); setPassword(''); }}
          >
            👤 Citizen
          </div>
          <div 
            className={`auth-tab ${activeTab === 'official' ? 'active' : ''}`}
            onClick={() => { setActiveTab('official'); setError(''); setUsername(''); setPassword(''); }}
          >
            🏛️ Official
          </div>
        </div>
        
        <form onSubmit={handleLogin}>
          {error && <div className="error-message">{error}</div>}
          
          {activeTab === 'citizen' ? (
            <>
              <div className="form-group">
                <label className="form-label">Phone Number (For Notifications)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g., 555-0198"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Secure PIN (Optional for Demo)</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••"
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Govt ID / Username</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g., admin"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Master Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </>
          )}
          
          <button type="submit" className="login-btn">
            {activeTab === 'citizen' ? 'Access My Reports' : 'Secure Admin Login'}
          </button>
        </form>

        <div className="login-footer">
          {activeTab === 'citizen' ? 'Your identity remains anonymous to officials.' : 'Authorized Personnel Only • End-to-End Encrypted'}
        </div>
      </div>
    </div>
  );
}
