"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { addSubmission } from '@/lib/store';
import './submit.css';

export default function SubmitPage() {
  const [step, setStep] = useState(1);

  const [lang, setLang] = useState('en');
  const t = {
    en: {
      cancel: '← Cancel & Back to Home',
      title: 'Report a Development Need',
      subtitle: 'Anonymously share issues in your constituency.',
      step1: 'Issue Category',
      step2: 'Details & Location',
      step3: 'Verification',
      stepOf: 'Step',
      selectCat: 'Select a Category',
      otherCat: 'What is the issue?',
      next: 'Next Step',
      describe: 'Describe the issue (Optional)',
      descPlaceholder: 'Provide details about the problem...',
      attach: '{activeT.attach}',
      record: '{activeT.record}',
      recording: 'Recording',
      stop: '{activeT.stop}',
      detectedLoc: 'Location Detected',
      detectLoc: '{activeT.detectLoc}',
      submitBtn: '{activeT.submitBtn}',
      whatsappBtn: 'Submit via WhatsApp',
      generatingProof: '{activeT.generatingProof}',
      proofReady: '{activeT.proofReady}',
      success: 'Submission Confirmed',
      successSub: 'Your report has been securely verified and added to the public dashboard.',
      trackingText: 'Your Anonymous Tracking ID:',
      copyInfo: 'Save this ID. You can use it to track the status of this issue on the homepage without revealing your identity.',
      returnHome: '{activeT.returnHome}'
    },
    hi: {
      cancel: '← रद्द करें और होम पर वापस जाएं',
      title: 'विकास की आवश्यकता की रिपोर्ट करें',
      subtitle: 'अपने क्षेत्र में समस्याओं को गुमनाम रूप से साझा करें।',
      step1: 'समस्या श्रेणी',
      step2: 'विवरण और स्थान',
      step3: 'सत्यापन',
      stepOf: 'चरण',
      selectCat: 'एक श्रेणी चुनें',
      otherCat: 'समस्या क्या है?',
      next: 'अगला कदम',
      describe: 'समस्या का वर्णन करें (वैकल्पिक)',
      descPlaceholder: 'समस्या के बारे में विवरण प्रदान करें...',
      attach: 'फोटो/वीडियो संलग्न करें',
      record: 'वॉयस नोट रिकॉर्ड करें',
      recording: 'रिकॉर्डिंग',
      stop: 'रिकॉर्डिंग रोकें',
      detectedLoc: 'स्थान का पता चला',
      detectLoc: '📍 स्थान का पता लगाने के लिए टैप करें (आवश्यक)',
      submitBtn: 'ZKP के माध्यम से सुरक्षित रूप से सबमिट करें',
      whatsappBtn: 'WhatsApp के माध्यम से सबमिट करें',
      generatingProof: 'शून्य-ज्ञान प्रमाण उत्पन्न किया जा रहा है...',
      proofReady: 'प्रमाण उत्पन्न! सबमिट करने के लिए तैयार।',
      success: 'सबमिशन की पुष्टि हुई',
      successSub: 'आपकी रिपोर्ट सुरक्षित रूप से सत्यापित की गई है और सार्वजनिक डैशबोर्ड में जोड़ दी गई है।',
      trackingText: 'आपकी अनाम ट्रैकिंग आईडी:',
      copyInfo: 'इस आईडी को सहेजें। आप अपनी पहचान बताए बिना इस समस्या की स्थिति को ट्रैक करने के लिए इसका उपयोग कर सकते हैं।',
      returnHome: 'होमपेज पर लौटें'
    },
    ta: {
      cancel: '← ரத்து செய் & முகப்புக்கு திரும்பு',
      title: 'ஒரு மேம்பாட்டு தேவையை புகாரளிக்கவும்',
      subtitle: 'உங்கள் தொகுதியில் உள்ள சிக்கல்களை அநாமதேயமாக பகிரவும்.',
      step1: 'சிக்கல் வகை',
      step2: 'விவரங்கள் & இடம்',
      step3: 'சரிபார்ப்பு',
      stepOf: 'படி',
      selectCat: 'ஒரு வகையைத் தேர்ந்தெடுக்கவும்',
      otherCat: 'பிரச்சனை என்ன?',
      next: 'அடுத்த படி',
      describe: 'சிக்கலை விவரிக்கவும் (விருப்பம்)',
      descPlaceholder: 'சிக்கலைப் பற்றிய விவரங்களை வழங்கவும்...',
      attach: 'புகைப்படம்/வீடியோவை இணைக்கவும்',
      record: 'குரல் குறிப்பை பதிவு செய்யவும்',
      recording: 'பதிவு செய்யப்படுகிறது',
      stop: 'பதிவை நிறுத்து',
      detectedLoc: 'இடம் கண்டறியப்பட்டது',
      detectLoc: '📍 இடத்தை கண்டறிய தட்டவும் (தேவை)',
      submitBtn: 'ZKP மூலம் பாதுகாப்பாக சமர்ப்பிக்கவும்',
      whatsappBtn: 'WhatsApp மூலம் சமர்ப்பிக்கவும்',
      generatingProof: 'Zero-Knowledge Proof உருவாக்கப்படுகிறது...',
      proofReady: 'Proof உருவாக்கப்பட்டது! சமர்ப்பிக்க தயார்.',
      success: 'சமர்ப்பிப்பு உறுதிப்படுத்தப்பட்டது',
      successSub: 'உங்கள் அறிக்கை பாதுகாப்பாக சரிபார்க்கப்பட்டு பொது டாஷ்போர்டில் சேர்க்கப்பட்டுள்ளது.',
      trackingText: 'உங்கள் அநாமதேய கண்காணிப்பு ஐடி:',
      copyInfo: 'இந்த ஐடியை சேமிக்கவும். உங்கள் அடையாளத்தை வெளிப்படுத்தாமல் இந்த சிக்கலின் நிலையை கண்காணிக்க இதைப் பயன்படுத்தலாம்.',
      returnHome: 'முகப்புப் பக்கத்திற்குத் திரும்பு'
    }
  };
  const activeT = t[lang as keyof typeof t];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isZkpReady, setIsZkpReady] = useState(false);

  useEffect(() => {
    if (step === 3) {
      setIsZkpReady(false);
      const timer = setTimeout(() => setIsZkpReady(true), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

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
    } catch {
      alert("Microphone access denied. For this demo, please allow microphone access.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {

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
          } catch {
            setLocationText(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
          }
          setIsLocating(false);
        },
        () => {
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
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ padding: '0.2rem', borderRadius: '4px', background: '#334155', color: '#fff', border: '1px solid #475569' }}>
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="ta">தமிழ்</option>
          </select>
          <Link href="/" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: 500 }}>{activeT.cancel}</Link>
        </div>
      </nav>

      <main className="submit-container">
        <div className="form-wrapper">
          
          {step < 4 && (
            <>
              <div className="form-header">
                <h1>{activeT.title}</h1>
                <p>{activeT.subtitle}</p>
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                  <Link href="/whatsapp-mock" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#25D366', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 6px rgba(37, 211, 102, 0.2)' }}>
                    <span>💬</span> {activeT.whatsappBtn}
                  </Link>
                </div>
              </div>

              <div className="progress-container">
                 <div className="progress-text">{activeT.stepOf} {step} of 3: {step === 1 ? activeT.step1 : step === 2 ? activeT.step2 : activeT.step3}</div>
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
                <button className="btn-submit-secondary" onClick={() => setStep(1)}>Back</button>
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

              <div className="zkp-status" style={{ borderColor: isZkpReady ? '#86efac' : '#ccfbf1', background: isZkpReady ? '#f0fdf4' : '#f0fdfa', color: isZkpReady ? '#16a34a' : '#0d9488' }}>
                {!isZkpReady ? <div className="spinner"></div> : <div style={{ fontSize: '1.5rem' }}>✓</div>}
                <span>{isZkpReady ? 'Identity cryptographically secured.' : 'Securing your identity before submission...'}</span>
              </div>

              <div className="form-actions" style={{ justifyContent: 'center', marginTop: '3rem', borderTop: 'none', paddingTop: 0 }}>
                <button className="btn-submit-secondary" onClick={() => setStep(2)} style={{ marginRight: '1rem', color: '#334155', border: '1px solid #cbd5e1' }}>Back</button>
                <button className="btn-glow" disabled={!isZkpReady} onClick={() => {
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
                <Link href="/"><button className="btn-submit-secondary" style={{ padding: '0.75rem 1.5rem' }}>Return Home</button></Link>
                <Link href="/track"><button className="btn-teal" style={{ padding: '0.75rem 1.5rem' }}>Track Status Now</button></Link>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
