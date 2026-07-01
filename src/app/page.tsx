"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { getSubmissions } from '@/lib/store';

export default function Home() {
  const [stats, setStats] = useState({ total: 0, resolved: 0, inProgress: 0 });
  const [lang, setLang] = useState('en');

  const translations = {
    en: {
      heroTitle: "Your Voice, Securely Heard. AI-Powered Constituency Development Planning.",
      heroSubtitle: "Anonymously share your needs and track development in your area. Government action, driven by real citizen data.",
      submitBtn: "Share Your Need",
      trackBtn: "Track a Project",
      howItWorks: "How It Works",
      crisis: "The Crisis",
      solution: "Our Solution"
    },
    hi: {
      heroTitle: "आपकी आवाज़ सुरक्षित रूप से सुनी गई। एआई-संचालित निर्वाचन क्षेत्र विकास योजना।",
      heroSubtitle: "अपनी ज़रूरतों को गुमनाम रूप से साझा करें। वास्तविक नागरिक डेटा द्वारा संचालित सरकारी कार्रवाई।",
      submitBtn: "अपनी समस्या साझा करें",
      trackBtn: "प्रोजेक्ट ट्रैक करें",
      howItWorks: "यह कैसे काम करता है",
      crisis: "संकट",
      solution: "हमारा समाधान"
    },
    ta: {
      heroTitle: "உங்கள் குரல் பாதுகாப்பாக கேட்கப்பட்டது. AI-ஆதரவு தொகுதி மேம்பாட்டு திட்டம்.",
      heroSubtitle: "உங்கள் தேவைகளை அநாமதேயமாக பகிரவும். உண்மையான குடிமக்கள் தரவு மூலம் இயக்கப்படும் அரசு நடவடிக்கை.",
      submitBtn: "உங்கள் தேவையை பகிரவும்",
      trackBtn: "திட்டத்தை கண்காணிக்கவும்",
      howItWorks: "எப்படி செயல்படுகிறது",
      crisis: "நெருக்கடி",
      solution: "எங்கள் தீர்வு"
    }
  };
  const t = translations[lang as keyof typeof translations];

  useEffect(() => {
    const subs = getSubmissions();
    setStats({
      total: subs.length,
      resolved: subs.filter(s => s.status === 'Resolved').length,
      inProgress: subs.filter(s => s.status === 'In Progress').length
    });
  }, []);
  return (
    <main>
      {/* Navigation */}
      <nav className="glass-nav">
        <div style={{ fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#0d9488' }}>🛡️</span> SafeConnect
        </div>
        <div className="nav-links">
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '0.4rem', borderRadius: '4px', outline: 'none', cursor: 'pointer' }}
          >
            <option value="en" style={{ color: '#0f172a' }}>English</option>
            <option value="hi" style={{ color: '#0f172a' }}>हिन्दी (Hindi)</option>
            <option value="ta" style={{ color: '#0f172a' }}>தமிழ் (Tamil)</option>
          </select>
          <Link href="#how-it-works" className="nav-link">{t.howItWorks}</Link>
          <Link href="#the-problem" className="nav-link">{t.crisis}</Link>
          <Link href="#the-solution" className="nav-link">{t.solution}</Link>
          <Link href="/login"><button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Login Portal</button></Link>
          <Link href="/submit"><button className="btn-primary" style={{ padding: '0.5rem 1.2rem' }}>{t.submitBtn}</button></Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <img 
          src="/images/hero.png" 
          alt="Citizens discussing with official" 
          className="hero-bg-image"
        />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">{t.heroTitle}</h1>
          <p className="hero-subtitle">
            {t.heroSubtitle}
          </p>
          <div className="hero-buttons">
            <Link href="/submit"><button className="btn-teal">{t.submitBtn} (Anonymous)</button></Link>
            <Link href="/track"><button className="btn-secondary">{t.trackBtn}</button></Link>
          </div>
        </div>
      </section>

      {/* Live Impact Stats */}
      <section style={{ background: 'white', padding: '3rem 5%', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0d9488' }}>{stats.total > 0 ? stats.total : '35+'}</div>
          <div style={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.85rem' }}>Citizens Engaged</div>
        </div>
        <div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f59e0b' }}>{stats.inProgress > 0 ? stats.inProgress : '12'}</div>
          <div style={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.85rem' }}>Active Community Projects</div>
        </div>
        <div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981' }}>{stats.resolved > 0 ? stats.resolved : '8'}</div>
          <div style={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.85rem' }}>Issues Successfully Resolved</div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="features-section animated-mesh-bg">
        <h2 className="section-title">How SafeConnect Works</h2>
        
        <div className="flowchart-container">
          <div className="flow-card">
            <img src="/images/icon_voice.png" alt="Voice Input" className="flow-icon" />
            <div className="flow-title">1. Speak Up</div>
          </div>
          <div className="flow-arrow">➔</div>
          
          <div className="flow-card">
            <img src="/images/icon_filter.png" alt="AI Filters" className="flow-icon" />
            <div className="flow-title">2. AI Filters</div>
          </div>
          <div className="flow-arrow">➔</div>

          <div className="flow-card">
            <img src="/images/icon_brain.png" alt="Deep Analysis" className="flow-icon" />
            <div className="flow-title">3. Deep Analysis</div>
          </div>
          <div className="flow-arrow">➔</div>

          <div className="flow-card">
            <img src="/images/icon_map.png" alt="Mapped for Action" className="flow-icon" />
            <div className="flow-title">4. Mapped for Action</div>
          </div>
        </div>
        
        <div style={{ marginTop: '4rem' }}>
           <Link href="/dashboard">
             <button className="btn-teal" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>View Live Dashboard Demo</button>
           </Link>
        </div>
      </section>

      {/* The Problem Section */}
      <div className="content-wrapper">
        <section id="the-problem" className="content-section">
          <div className="content-text">
            <h2 className="content-heading">The Problem: Fragmented Voices</h2>
            <p className="content-paragraph">
              MPs lack a structured system to consolidate feedback, leading to chaotic and biased development planning.
            </p>
            <ul className="highlight-list">
              <li>
                <div className="highlight-icon">⚠️</div>
                <div className="highlight-text">
                  <h4>Fear of Retaliation</h4>
                  <p>Lack of true anonymity silences citizens.</p>
                </div>
              </li>
              <li>
                <div className="highlight-icon">📉</div>
                <div className="highlight-text">
                  <h4>Influence Over Need</h4>
                  <p>Loudest voices win; marginalized areas are left behind.</p>
                </div>
              </li>
              <li>
                <div className="highlight-icon">📄</div>
                <div className="highlight-text">
                  <h4>Information Overload</h4>
                  <p>Thousands of raw complaints are impossible to process manually.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="content-image-container">
            <img src="/images/problem.png" alt="Bureaucratic Chaos" className="content-image" />
          </div>
        </section>
      </div>

      {/* The Solution Section */}
      <section id="the-solution" className="content-section alt-bg reverse">
        <div className="content-text" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 className="content-heading">The SafeConnect Solution</h2>
          <p className="content-paragraph">
            We replace guesswork with data. A secure, AI-driven pipeline from citizens to decision-makers.
          </p>
          <ul className="highlight-list">
            <li>
              <div className="highlight-icon green">🛡️</div>
              <div className="highlight-text">
                <h4>Verified Anonymity</h4>
                <p>Zero-Knowledge Proofs (ZKP) ensure your identity is never stored.</p>
              </div>
            </li>
            <li>
              <div className="highlight-icon green">🧠</div>
              <div className="highlight-text">
                <h4>AI Sentiment Mapping</h4>
                <p>Gemini AI turns unstructured complaints into actionable Demand Heatmaps.</p>
              </div>
            </li>
            <li>
              <div className="highlight-icon green">⚖️</div>
              <div className="highlight-text">
                <h4>Data-Driven Decisions</h4>
                <p>Politicians get objective justifications for project approvals.</p>
              </div>
            </li>
          </ul>
        </div>
        <div className="content-image-container" style={{ maxWidth: '500px' }}>
          <img src="/images/solution.png" alt="Tech Solution" className="content-image" />
        </div>
      </section>

      {/* Join the Movement CTA */}
      <section className="content-section minimal-grid-bg" style={{ flexDirection: 'column', textAlign: 'center', padding: '6rem 5%', maxWidth: '100%', borderTop: '1px solid #e2e8f0' }}>
        <h2 className="content-heading text-gradient" style={{ fontSize: '2.8rem', margin: '0 0 1rem' }}>Ready to shape your constituency?</h2>
        <p className="content-paragraph" style={{ maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          Join thousands of citizens making their voices heard securely and anonymously. Be a part of data-driven local development.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/submit"><button className="btn-teal" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Submit Your Need Now</button></Link>
          <button className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', color: '#0f172a', borderColor: '#cbd5e1' }}>Watch Demo Video</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Terms of Service</Link>
          <Link href="/login" style={{ color: '#0d9488', fontWeight: 600 }}>Admin Login</Link>
        </div>
        <div>
          Contact Service for Support
        </div>
      </footer>
    </main>
  );
}
