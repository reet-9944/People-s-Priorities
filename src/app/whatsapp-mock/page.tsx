"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function WhatsAppMock() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am the SafeConnect Anonymous Bot. 🛡️\n\nYour phone number is HIDDEN from the government through our privacy proxy.\n\nWhat issue would you like to report today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      if (currentInput.toLowerCase().includes('water') || currentInput.toLowerCase().includes('leak')) {
        setMessages(prev => [...prev, { sender: 'bot', text: 'I have categorized this as a Water Supply issue. 🚰\n\nCould you provide a rough location (e.g., Sector 4) or send a photo?' }]);
      } else if (currentInput.toLowerCase().includes('road') || currentInput.toLowerCase().includes('pothole')) {
        setMessages(prev => [...prev, { sender: 'bot', text: 'I have categorized this as a Road Repair issue. 🛣️\n\nCould you provide a rough location (e.g., Market Road) or send a photo?' }]);
      } else if (messages.length > 2) {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Thank you! Your report has been securely and anonymously submitted to the MP Dashboard. ✅\n\nYour anonymous tracking ID is: WA-992-XYZ' }]);
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Got it. Could you provide a rough location or send a photo of the issue?' }]);
      }
    }, 1500);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#ece5dd', fontFamily: 'sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '400px', height: '100vh', maxHeight: '800px', background: '#e5ddd5', display: 'flex', flexDirection: 'column', boxShadow: '0 0 20px rgba(0,0,0,0.1)' }}>
        {/* WhatsApp Header */}
        <div style={{ background: '#075e54', color: 'white', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px', zIndex: 10 }}>
          <Link href="/submit" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem' }}>←</Link>
          <div style={{ width: '40px', height: '40px', background: '#128c7e', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>🛡️</div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>SafeConnect Govt Bot</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>End-to-End Anonymous</div>
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' }}>
          
          <div style={{ background: '#dcf8c6', padding: '10px', borderRadius: '10px', fontSize: '0.85rem', textAlign: 'center', margin: '0 auto 10px', maxWidth: '80%', color: '#4a4a4a', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
            🔒 Messages and calls are end-to-end encrypted. Our proxy ensures your phone number is never shared with the receiving server.
          </div>

          {messages.map((msg, i) => (
            <div key={i} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', background: msg.sender === 'user' ? '#dcf8c6' : 'white', padding: '10px 15px', borderRadius: '10px', maxWidth: '80%', boxShadow: '0 1px 1px rgba(0,0,0,0.1)', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div style={{ alignSelf: 'flex-start', background: 'white', padding: '10px 15px', borderRadius: '10px', maxWidth: '80%', boxShadow: '0 1px 1px rgba(0,0,0,0.1)', color: '#666', fontStyle: 'italic' }}>
              Bot is typing...
            </div>
          )}
        </div>

        {/* Input Area */}
        <div style={{ background: '#f0f0f0', padding: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ flex: 1, background: 'white', borderRadius: '25px', padding: '10px 20px', display: 'flex' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..." 
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem' }}
            />
          </div>
          <button 
            onClick={handleSend}
            style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#128c7e', color: 'white', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontSize: '1.2rem' }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
