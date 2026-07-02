"use client";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { getSubmissions } from '@/lib/store';

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
      <div className="slanted-bottom" style={{ padding: '2rem 5% 10rem', position: 'relative', background: '#faf8f5', backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}>
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
                  <img src="https://img.freepik.com/premium-photo/3d-ai-sentiment-analysis-customer-feedback-icons-ideal-isolated-vector-designs_980716-465713.jpg" style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="AI Sentiment" />
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
        </div>

        <div className="solution-image" style={{ maxWidth: '500px', margin: '4rem auto 0', background: '#ffffff', borderRadius: '24px', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src="https://assets-v2.lottiefiles.com/a/f1e1a7d0-1d3d-11ee-91c5-27c399cace92/2kbrVRXP9B.gif" alt="Security Animation" style={{ width: '100%', height: 'auto', display: 'block' }} />
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
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', zIndex: 10 }}>
          <Link href="/submit"><button className="btn-teal" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Submit Your Need Now</button></Link>
          <button className="btn-secondary" onClick={() => setIsDemoOpen(true)} style={{ padding: '1rem 2rem', fontSize: '1.1rem', background: 'transparent', color: '#fff', borderColor: '#fff' }}>Watch Demo Video</button>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="modern-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <span>SafeConnect</span>
            </div>
            <p className="footer-description">
              Empowering citizens through secure, anonymous, data-driven local development tracking.
            </p>
            <div className="footer-socials">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg></a>
              <a href="https://github.com/reet-9944" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
            </div>
          </div>
          
          <div className="footer-links-group">
            <h4 className="footer-heading">Platform</h4>
            <Link href="#how-it-works">How It Works</Link>
            <Link href="#the-crisis">The Crisis</Link>
            <Link href="#solution">Our Solution</Link>
            <Link href="/public-dashboard">Live Dashboard</Link>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-heading">Legal & Support</h4>
            <Link href="/">Privacy Policy</Link>
            <Link href="/">Terms of Service</Link>
            <Link href="/submit">Submit Issue</Link>
            <Link href="/login" className="admin-link">Admin Portal</Link>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} SafeConnect. All rights reserved.</p>
          <div className="footer-bottom-links">
            <span style={{ color: '#0d9488' }}>Zero-Knowledge Proof Secured</span>
          </div>
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
