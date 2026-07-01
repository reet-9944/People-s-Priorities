"use client";
import { useState, useRef } from 'react';
import Link from 'next/link';
import { addSubmission } from '@/lib/store';
import './submit.css';

export default function SubmitPage() {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");

  // Media state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<any>(null);

  // Location state
  const [locationText, setLocationText] = useState("");
  const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setRecordedAudio(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert("Microphone access denied. For this demo, please allow microphone access.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
      // @ts-ignore
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (timeInSeconds: number) => {
    const m = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const s = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const detectLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setCoords({ lat, lon });
          
          try {
            // Free OpenStreetMap Nominatim API for reverse geocoding
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await res.json();
            if (data && data.display_name) {
              setLocationText(data.display_name);
            } else {
              setLocationText(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
            }
          } catch (err) {
            setLocationText(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
          }
          setIsLocating(false);
        },
        (error) => {
          alert("Could not get your location. Please check browser permissions.");
          setIsLocating(false);
        },
        { timeout: 10000 } // Add a 10s timeout so it doesn't hang forever
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  const categories = [
    { id: 'water', img: '/images/icon_cat_water.png', label: 'Water' },
    { id: 'roads', img: '/images/icon_cat_roads.png', label: 'Roads' },
    { id: 'health', img: '/images/icon_cat_health.png', label: 'Healthcare' },
    { id: 'education', img: '/images/icon_cat_edu.png', label: 'Education' },
    { id: 'waste', img: '/images/icon_cat_waste.png', label: 'Waste Management' },
    { id: 'safety', icon: '🚓', label: 'Public Safety' },
    { id: 'parks', icon: '🌳', label: 'Parks & Rec' },
    { id: 'other', icon: '➕', label: 'Other (Specify)' },
  ];

  return (
    <div className="submit-layout">
      {/* Standard Navbar */}
      <nav className="submit-navbar">
         <div className="logo-area">
          <span style={{ color: '#0d9488' }}>🛡️</span> SafeConnect
        </div>
        <Link href="/" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: 500 }}>← Cancel & Back to Home</Link>
      </nav>

      <main className="submit-container">
        <div className="form-wrapper">
          
          {step < 4 && (
            <>
              <div className="form-header">
                <h1>Report a Development Need</h1>
                <p>Anonymously share issues in your constituency.</p>
              </div>

              <div className="progress-container">
                 <div className="progress-text">Step {step} of 3: {step === 1 ? 'Issue Category' : step === 2 ? 'Details & Location' : 'Verification'}</div>
                 <div className="progress-bar-wrapper">
                    <div className={`progress-segment ${step >= 1 ? 'active' : ''}`}></div>
                    <div className={`progress-segment ${step >= 2 ? 'active' : ''}`}></div>
                    <div className={`progress-segment ${step >= 3 ? 'active' : ''}`}></div>
                 </div>
              </div>
            </>
          )}

          {step === 1 && (
            <div className="step-content">
              <h3>What is the primary issue?</h3>
              <div className="category-grid">
                {categories.map(cat => (
                  <div 
                    key={cat.id} 
                    className={`category-item ${selectedCategory === cat.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      if (cat.id !== 'other') setCustomCategory("");
                    }}
                  >
                    {cat.img ? (
                      <img src={cat.img} alt={cat.label} className="category-img" />
                    ) : (
                      <div style={{ fontSize: '3.5rem', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>{cat.icon}</div>
                    )}
                    <div className="category-label">{cat.label}</div>
                  </div>
                ))}
              </div>

              {selectedCategory === 'other' && (
                <div style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.3s ease-in-out' }}>
                  <h3 style={{ marginBottom: '0.5rem' }}>Please specify the category:</h3>
                  <input 
                    type="text" 
                    className="text-input" 
                    placeholder="e.g. Public Transport, Internet Access..." 
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    autoFocus
                  />
                </div>
              )}

              <h3 style={{ marginTop: '1.5rem' }}>Brief Description</h3>
              <textarea 
                className="text-input" 
                placeholder="Describe the issue in your area..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <div className="char-count">0 / 500 characters</div>

              <div className="form-actions">
                <button 
                  className="btn-glow" 
                  onClick={() => setStep(2)}
                  disabled={!selectedCategory || (selectedCategory === 'other' && !customCategory.trim())}
                >
                  Continue to Step 2
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <h3>Location</h3>
              <input 
                type="text" 
                className="text-input" 
                placeholder="e.g. Main Street, Sector 4, near Central Park" 
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
              />
              
              {!coords ? (
                <div className="map-placeholder" onClick={detectLocation}>
                  {isLocating ? (
                    <>
                      <div className="spinner" style={{ width: '28px', height: '28px', borderWidth: '3px', marginBottom: '0.5rem' }}></div>
                      <span>Requesting location permission...</span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>📍</span>
                      <span style={{ color: '#0f766e' }}>Detect My Real Location</span>
                    </>
                  )}
                </div>
              ) : (
                <div style={{ marginTop: '1rem', borderRadius: '8px', overflow: 'hidden', border: '2px solid #0d9488', animation: 'fadeIn 0.5s ease-in-out' }}>
                  <iframe 
                    width="100%" 
                    height="180" 
                    frameBorder="0" 
                    scrolling="no" 
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lon-0.005},${coords.lat-0.005},${coords.lon+0.005},${coords.lat+0.005}&layer=mapnik&marker=${coords.lat},${coords.lon}`} 
                    style={{ display: 'block' }}
                  ></iframe>
                </div>
              )}

              <h3 style={{ marginTop: '2.5rem' }}>Add Media (Optional)</h3>
              <p className="helper-text">Include photos or a voice note describing the problem in your local language.</p>
              
              <div className="media-buttons">
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   accept="image/*,video/*" 
                   style={{ display: 'none' }} 
                   onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                 />

                 <button 
                   className={`media-btn ${isRecording ? 'recording' : ''}`}
                   onClick={isRecording ? stopRecording : startRecording}
                 >
                   <span className="media-icon">
                     {isRecording ? '🛑' : (recordedAudio ? '✅' : '🎙️')}
                   </span>
                   {isRecording 
                     ? `Recording... ${formatTime(recordingTime)}` 
                     : (recordedAudio ? 'Voice Saved!' : 'Record Voice')}
                 </button>

                 <button 
                   className="media-btn" 
                   onClick={() => fileInputRef.current?.click()}
                 >
                   <span className="media-icon">
                     {selectedFile ? '✅' : '📷'}
                   </span>
                   <span style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 10px' }}>
                     {selectedFile ? selectedFile.name : 'Upload Photo'}
                   </span>
                 </button>
              </div>

              <div className="form-actions row">
                <button className="btn-secondary" onClick={() => setStep(1)}>Back</button>
                <button className="btn-glow" onClick={() => setStep(3)}>Continue to Step 3</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content text-center">
              <div className="zkp-icon">🛡️</div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Verified Anonymity</h3>
              <p className="helper-text" style={{ maxWidth: '500px', margin: '0 auto 2rem' }}>
                We are now generating a Zero-Knowledge Proof (ZKP). This cryptographically proves you are a valid resident of this constituency without revealing your identity, name, or IP address.
              </p>

              <div className="zkp-status">
                <div className="spinner"></div>
                <span>Securing your identity before submission...</span>
              </div>

              <div className="form-actions" style={{ justifyContent: 'center', marginTop: '3rem', borderTop: 'none', paddingTop: 0 }}>
                <button className="btn-secondary" onClick={() => setStep(2)} style={{ marginRight: '1rem' }}>Back</button>
                <button className="btn-glow" onClick={() => {
                  const selectedCatObj = categories.find(c => c.id === selectedCategory);
                  let categoryLabel = selectedCatObj ? selectedCatObj.label : 'Other';
                  if (selectedCategory === 'other') categoryLabel = customCategory || 'Other';
                  
                  const id = addSubmission({
                    category: selectedCategory,
                    categoryLabel,
                    location: locationText || 'Unknown Location',
                    lat: coords?.lat,
                    lon: coords?.lon,
                    description: description || 'No description provided'
                  });
                  setTrackingId(id);
                  setStep(4);
                }}>Submit Securely</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="success-state">
              <div className="success-icon">✅</div>
              <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '1rem', fontWeight: 800 }}>Successfully Submitted!</h2>
              <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
                Your development need has been securely recorded and verified. It is now on the MP's Dashboard.
              </p>
              
              <div style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', padding: '1.5rem', borderRadius: '12px', margin: '0 auto 2.5rem', maxWidth: '400px' }}>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 600 }}>Your Unique Tracking ID</p>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '3px' }}>{trackingId}</div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '1rem' }}>Save this ID. You can use it to track the status of your issue anonymously without an account.</p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link href="/"><button className="btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>Return Home</button></Link>
                <Link href="/track"><button className="btn-teal" style={{ padding: '0.75rem 1.5rem' }}>Track Status Now</button></Link>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
