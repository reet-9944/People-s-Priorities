"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from 'react';
import { getSubmissions } from '@/lib/store';
import CanvasParticles from '@/components/CanvasParticles';

// Modern Tri-color Brand Logo
const BrandLogo = ({ showText = true, isDark = false }: { showText?: boolean, isDark?: boolean }) => {
  const textColor = isDark ? '#ffffff' : '#0f172a';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <svg viewBox="0 0 100 100" style={{ width: '42px', height: '42px', flexShrink: 0 }}>
        <path d="M 25 25 Q 25 15 35 20 L 75 40 Q 85 45 85 50 L 55 50 L 35 35 Z" fill="#f97316" />
        <path d="M 85 50 Q 85 55 75 60 L 35 80 Q 25 85 25 75 L 35 65 L 55 50 Z" fill="#dc2626" />
        <path d="M 25 25 L 35 35 L 35 65 L 25 75 Z" fill={isDark ? '#e0e7ff' : '#032b5e'} />
        <path d="M 25 25 Q 25 15 35 20 L 35 35 L 25 35 Z" fill={isDark ? '#e0e7ff' : '#032b5e'} />
        <path d="M 25 75 Q 25 85 35 80 L 35 65 L 25 65 Z" fill={isDark ? '#e0e7ff' : '#032b5e'} />
      </svg>
      {showText && (
        <div style={{ borderLeft: '2px solid #f97316', paddingLeft: '0.75rem', display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ color: textColor, fontWeight: 900, fontSize: '0.95rem', letterSpacing: '0.5px' }}>SAFE</span>
          <span style={{ color: textColor, fontWeight: 900, fontSize: '0.95rem', letterSpacing: '0.5px' }}>PROUD</span>
          <span style={{ color: textColor, fontWeight: 900, fontSize: '0.95rem', letterSpacing: '0.5px' }}>CONNECTED</span>
        </div>
      )}
    </div>
  );
};

const AnimatedCounter = ({ end, duration = 2500, suffix = "" }: { end: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };
    
    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
};

export default function Home() {
  const [stats, setStats] = useState({ total: 0, resolved: 0, inProgress: 0 });
  const [lang, setLang] = useState('en');
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <Link href="/" className="nav-brand" style={{ textDecoration: 'none' }}>
          <BrandLogo isDark={true} />
        </Link>
        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
             <line x1="3" y1="12" x2="21" y2="12"></line>
             <line x1="3" y1="6" x2="21" y2="6"></line>
             <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <select value={lang} onChange={(e) => setLang(e.target.value)} className="lang-select">
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="ta">தமிழ்</option>
          </select>
          <Link href="#how-it-works" className="nav-link">{t.howItWorks}</Link>
          <Link href="#the-problem" className="nav-link">{t.crisis}</Link>
          <Link href="#the-solution" className="nav-link">{t.solution}</Link>
          <Link href="/login"><button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Login Portal</button></Link>
          <Link href="/submit"><button className="btn-primary" style={{ padding: '0.5rem 1.2rem' }}>{t.submitBtn}</button></Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" style={{ position: 'relative' }}>
        <img 
          src="/images/hero.png" 
          alt="Citizens discussing with official" 
          className="hero-bg-image"
        />
        <div className="hero-overlay"></div>
        <div className="hero-content" style={{ paddingBottom: '6rem' }}>
          <h1 className="hero-title">{t.heroTitle}</h1>
          <p className="hero-subtitle">
            {t.heroSubtitle}
          </p>
          <div className="hero-buttons">
            <Link href="/submit"><button className="btn-teal">{t.submitBtn} (Anonymous)</button></Link>
            <Link href="/track"><button className="btn-secondary">{t.trackBtn}</button></Link>
            <button className="btn-secondary" onClick={() => setIsDemoOpen(true)}>Watch Demo</button>
          </div>
        </div>
        {/* Animated Wavy Divider */}
        <div style={{ position: 'absolute', bottom: '-1px', left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, zIndex: 10 }}>
          <svg className="parallax-waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1px)', height: '120px' }}>
            <defs>
              <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g className="parallax-wave-group">
              <use href="#gentle-wave" x="48" y="0" fill="rgba(250, 248, 245, 0.7)" />
              <use href="#gentle-wave" x="48" y="3" fill="rgba(250, 248, 245, 0.5)" />
              <use href="#gentle-wave" x="48" y="5" fill="rgba(250, 248, 245, 0.3)" />
              <use href="#gentle-wave" x="48" y="7" fill="#faf8f5" />
            </g>
          </svg>
        </div>
      </section>

      {/* Confidence Metrics Section */}
      <div className="slanted-bottom confidence-section" style={{ position: 'relative', background: '#faf8f5', backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}>
        <div className="content-section" style={{ background: 'transparent', padding: '0', maxWidth: '1200px', margin: '0 auto' }}>
          <div className="content-text">
            <h2 className="content-heading" style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: 1.1, color: '#0f172a' }}>Confidence in<br/>Your Impact</h2>
            <p className="content-paragraph" style={{ maxWidth: '400px', color: '#475569' }}>
              Real-time transparency into how citizen voices are shaping local development securely.
            </p>
          </div>
          <div className="content-image-container" style={{ background: 'transparent', boxShadow: 'none', display: 'flex', justifyContent: 'center' }}>
            <div className="staggered-metrics-container">
              <div className="metric-square ms-1">
                <div className="metric-label">Engaged</div>
                <div className="metric-value"><AnimatedCounter end={stats.total > 0 ? stats.total : 38} suffix="k+" /></div>
              </div>
              <div className="metric-square ms-2">
                <div className="metric-label">Projects</div>
                <div className="metric-value"><AnimatedCounter end={stats.inProgress > 0 ? stats.inProgress : 12} suffix="+" /></div>
              </div>
              <div className="metric-square ms-3">
                <div className="metric-label">Resolved</div>
                <div className="metric-value"><AnimatedCounter end={stats.resolved > 0 ? stats.resolved : 7} suffix="k+" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
           <Link href="/public-dashboard">
             <button className="btn-teal" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>View Live Dashboard Demo</button>
           </Link>
        </div>
      </section>

      {/* The Problem Section */}
      <div className="bg-slate-dark slanted-both" style={{ padding: '6rem 0 10rem', position: 'relative' }}>
        <section id="the-problem" className="content-section dark-text" style={{ background: 'transparent' }}>
          <div className="content-text">
            <h2 className="content-heading">The Problem: Fragmented Voices</h2>
            <p className="content-paragraph">
              MPs lack a structured system to consolidate feedback, leading to chaotic and biased development planning.
            </p>
            <ul className="highlight-list">
              <li>
                <div className="highlight-icon" style={{ background: 'rgba(241, 245, 249, 0.1)', color: '#f8fafc' }}>⚠️</div>
                <div className="highlight-text">
                  <h4>Fear of Retaliation</h4>
                  <p>Lack of true anonymity silences citizens.</p>
                </div>
              </li>
              <li>
                <div className="highlight-icon" style={{ background: 'rgba(241, 245, 249, 0.1)', color: '#f8fafc' }}>📉</div>
                <div className="highlight-text">
                  <h4>Influence Over Need</h4>
                  <p>Loudest voices win; marginalized areas are left behind.</p>
                </div>
              </li>
              <li>
                <div className="highlight-icon" style={{ background: 'rgba(241, 245, 249, 0.1)', color: '#f8fafc' }}>📄</div>
                <div className="highlight-text">
                  <h4>Information Overload</h4>
                  <p>Thousands of raw complaints are impossible to process manually.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="content-image-container" style={{ border: 'none' }}>
            <img src="/images/problem.png" alt="Bureaucratic Chaos" className="content-image" style={{ borderRadius: '24px' }} />
          </div>
        </section>
      </div>

      {/* The Solution Section (3 Easy Steps layout) */}
      <div className="content-wrapper" style={{ background: '#f8fafc', padding: '6rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="content-heading" style={{ fontSize: '2.5rem', textTransform: 'uppercase' }}>3 Easy Steps to Secure Governance</h2>
          <p className="content-paragraph" style={{ maxWidth: '700px', margin: '0 auto' }}>
            We replace guesswork with data. A secure, AI-driven pipeline from citizens to decision-makers.
          </p>
        </div>
        
        <div className="steps-grid" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5%' }}>
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-content">
                <div className="step-icon-wrapper">
                  <img src="https://th.bing.com/th/id/OIP.ndthhKCe5zuw6vkZVGK0TwHaHa?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3" style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Verified" />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Verified Anonymity</h4>
                <p style={{ color: '#64748b' }}>Zero-Knowledge Proofs (ZKP) ensure your identity is never stored.</p>
              </div>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-content">
                <div className="step-icon-wrapper">
                  <img src="https://calln.com/wp-content/uploads/2019/10/Sentiment-Analysis-Infographic-860x600-860x600.png" style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="AI Sentiment" />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>AI Sentiment</h4>
                <p style={{ color: '#64748b' }}>Gemini AI turns unstructured complaints into actionable Demand Heatmaps.</p>
              </div>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-content">
                <div className="step-icon-wrapper">
                  <img src="https://cdn-icons-png.flaticon.com/512/13079/13079943.png" style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Data-Driven" />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Data-Driven</h4>
                <p style={{ color: '#64748b' }}>Politicians get objective justifications for project approvals and funding.</p>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-content">
                <div className="step-icon-wrapper">
                  <img src="https://tse2.mm.bing.net/th/id/OIP.jtO3Zv4Bh17Rfs-zYdtpygHaHk?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Transparent Tracking" />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Transparent Tracking</h4>
                <p style={{ color: '#64748b' }}>Citizens track development progress live on a verified, public dashboard.</p>
              </div>
            </div>
        </div>

        <div className="solution-image-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '700px', margin: '4rem auto 0' }}>
          <div className="solution-image" style={{ background: '#ffffff', borderRadius: '24px', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', width: '100%', marginBottom: '2rem' }}>
            <img src="https://assets-v2.lottiefiles.com/a/f1e1a7d0-1d3d-11ee-91c5-27c399cace92/2kbrVRXP9B.gif" alt="Security Animation" style={{ width: '100%', height: 'auto', display: 'block', maxWidth: '400px', margin: '0 auto' }} />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', textAlign: 'center' }}>Military-Grade Security Architecture</h3>
          <p style={{ color: '#64748b', textAlign: 'center', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '600px' }}>
            Every interaction on our platform is protected by advanced AES-256 encryption. We utilize cryptographic Zero-Knowledge Proofs (ZKPs) to verify your constituency and eligibility without ever revealing your personal identity, device information, or IP address.
          </p>
        </div>
      </div>

      {/* Testimonial / Quote Section */}
      <section style={{ padding: '6rem 5%', background: '#ffffff', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '15rem', color: 'rgba(226, 232, 240, 0.4)', fontFamily: 'Georgia, serif', zIndex: 0, lineHeight: 1 }}>
          "
        </div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: '2rem' }}>
            "A true democracy thrives only when every citizen's voice is not just heard, but mathematically acted upon."
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>
            - The SafeConnect Vision
          </p>
        </div>
      </section>

      {/* Join the Movement CTA */}
      <section className="bg-slate-dark slanted-top dark-text" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '12rem 5% 6rem', maxWidth: '100%', borderTop: 'none', position: 'relative' }}>
        <h2 className="content-heading" style={{ fontSize: '2.8rem', margin: '0 0 1rem', color: '#fff' }}>Ready to shape your constituency?</h2>
        <p className="content-paragraph" style={{ maxWidth: '600px', margin: '0 auto 2.5rem', color: '#cbd5e1' }}>
          Join thousands of citizens making their voices heard securely and anonymously. Be a part of data-driven local development.
        </p>
        <div className="footer-cta-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', zIndex: 10, width: '100%', maxWidth: '400px', margin: '0 auto' }}>
          <Link href="/submit" style={{ width: '100%' }}><button className="btn-teal" style={{ padding: '1rem 2rem', fontSize: '1.1rem', width: '100%' }}>Submit Your Need Now</button></Link>
          <button className="btn-secondary" onClick={() => setIsDemoOpen(true)} style={{ padding: '1rem 2rem', fontSize: '1.1rem', background: 'transparent', color: '#fff', borderColor: '#fff', width: '100%' }}>Watch Demo Video</button>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="modern-footer">
        <CanvasParticles />
        <div className="footer-top-grid">
          <div className="footer-column">
            <h4 className="footer-title">Company</h4>
            <div className="footer-contact-info">
              <p>📍 123 Secure Building, New Delhi, IN</p>
              <p>📧 contact@safeconnect.gov.in</p>
              <p>📞 +91 1800 123 4567</p>
            </div>
          </div>
          <div className="footer-column">
            <h4 className="footer-title">Service</h4>
            <Link href="#how-it-works">Product Resolution</Link>
            <Link href="#how-it-works">How we deliver</Link>
            <Link href="#how-it-works">How it works</Link>
            <Link href="#the-solution">Customers</Link>
          </div>
          <div className="footer-column">
            <h4 className="footer-title">Platform</h4>
            <Link href="/submit">Submit Issue</Link>
            <Link href="/track">Track Status</Link>
            <Link href="/public-dashboard">Live Dashboard</Link>
            <Link href="/login" className="admin-link">Admin Portal</Link>
          </div>
          <div className="footer-column">
            <h4 className="footer-title">Resources</h4>
            <Link href="#">Careers</Link>
            <Link href="#">Customer portal</Link>
            <Link href="#">Sustainability</Link>
            <Link href="#">Press/Media</Link>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-social-row">
          <div className="footer-social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg></a>
          </div>
        </div>
        
        <div className="footer-bottom-info">
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} SafeConnect. All Rights Reserved.
          </div>
          <div className="footer-legal-links">
            <Link href="#">Term of use</Link>
            <Link href="#">Privacy policy</Link>
            <Link href="#">Cookies setting</Link>
          </div>
        </div>
        
        <div className="footer-huge-logo">
          SAFECONNECT
        </div>
      </footer>

      {/* Video Demo Modal */}
      {isDemoOpen && (
        <div className="video-modal-overlay" onClick={() => setIsDemoOpen(false)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setIsDemoOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="video-wrapper">
              {/* Concept Demo Video using a high-tech data visualization stock video */}
              <video autoPlay loop controls playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}>
                <source src="https://assets.mixkit.co/videos/preview/mixkit-map-of-the-world-with-network-connections-31802-large.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="video-overlay-text">SafeConnect Concept Demo</div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
