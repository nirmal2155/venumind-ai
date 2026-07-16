import React, { useState } from 'react';
import { Accessibility as AccessibilityIcon, Eye, Volume2, MapPin, Heart, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ACCESSIBLE_ZONES = [
  { id: 'A', name: 'Gate A — Wheelchair Entry', status: 'Open', time: '2 min', color: '#2BFF88', note: 'Elevator & Ramp Access' },
  { id: 'B', name: 'Gate D — Priority Access', status: 'Open', time: '1 min', color: '#2BFF88', note: 'Closest to Section 302–310' },
  { id: 'C', name: 'Gate C — Accessible Toilets', status: 'Open', time: '3 min', color: '#FFDE59', note: '2 accessible stalls available' },
  { id: 'D', name: 'First Aid Post 2 — Medical', status: 'Available', time: '4 min', color: '#00C8FF', note: 'Nurse on duty' },
];

const SENSORY_ZONES = [
  { name: 'Quiet Room 1', location: 'Level 2, Block 208', capacity: '8/15', icon: '🔇' },
  { name: 'Sensory Rest Zone', location: 'Level 1, Near Gate A', capacity: '3/10', icon: '🧘' },
  { name: 'Prayer & Meditation', location: 'Level 3, Block 312', capacity: '12/30', icon: '🕌' },
];

const Accessibility = () => {
  const navigate = useNavigate();
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [audioGuide, setAudioGuide] = useState(false);

  const handleToggleAudioGuide = () => {
    const nextState = !audioGuide;
    setAudioGuide(nextState);
    if (nextState) {
      try {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance("Audio Guide enabled. Calming route directions and priority access notifications will be read aloud. You are currently near Gate A Wheelchair Entry.");
          utterance.lang = 'en-US';
          window.speechSynthesis.speak(utterance);
        }
      } catch {
        console.warn("Speech synthesis not supported or blocked.");
      }
    } else {
      try {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } catch {}
    }
  };
  const [sosTriggered, setSosTriggered] = useState(false);
  const [sosLoading, setSosLoading] = useState(false);
  const [sosDetails, setSosDetails] = useState(null);

  const triggerSos = () => {
    setSosLoading(true);
    setSosTriggered(true);
    setSosDetails(null);
    setTimeout(() => {
      setSosDetails({
        location: 'Level 1, Section 104, Row K, Seat 12',
        guard: 'Security Officer Marcus (20m - Gate A Corridor)',
        ambulance: 'Medical Unit 3 (80m - Gate A Bay)',
        route: 'Reroute via Gate C corridor (Sector 4 bypass)'
      });
      setSosLoading(false);
    }, 1500);
  };

  const cancelSos = () => {
    setSosTriggered(false);
    setSosDetails(null);
    setSosLoading(false);
  };

  const [selectedRoute, setSelectedRoute] = useState(null);
  const [accessAiText, setAccessAiText] = useState('');
  const [accessLoading, setAccessLoading] = useState(false);

  const getAccessibilityAiGuide = async () => {
    setAccessLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Give a sensory guide and calm routing recommendations for a sensory-sensitive fan near Gate A at Level 1, closest quiet zones.' })
      });
      const data = await res.json();
      setAccessAiText(data.reply);
    } catch {
      setAccessAiText('Error generating sensory calming routing directives.');
    }
    setAccessLoading(false);
  };

  const fontSize = largeText ? '1.05rem' : '0.9rem';

  return (
    <div style={{ padding: '1.5rem', paddingBottom: '120px', background: highContrast ? '#000' : 'transparent', minHeight: '100vh', fontSize }}>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ background: 'rgba(0,200,255,0.15)', padding: '10px', borderRadius: '12px' }}>
            <AccessibilityIcon size={28} color="#00C8FF" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontWeight: '900', fontSize: largeText ? '2rem' : '1.6rem', color: highContrast ? '#fff' : '#fff' }}>Accessibility<br/><span style={{ color: '#00C8FF' }}>Hub</span></h1>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>AI-powered accessibility services for every fan at Lusail Stadium.</p>
      </div>

      {/* 🚨 AI Emergency SOS Block */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={triggerSos}
          style={{
            width: '100%',
            padding: '1.25rem',
            borderRadius: '16px',
            background: sosTriggered ? 'rgba(255, 75, 75, 0.1)' : '#FF4B4B',
            border: '2px solid #FF4B4B',
            color: sosTriggered ? '#FF4B4B' : '#fff',
            fontWeight: '900',
            fontSize: largeText ? '1.2rem' : '1.05rem',
            letterSpacing: '1px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: sosTriggered ? 'none' : '0 8px 24px rgba(255,75,75,0.3)',
            transition: 'all 0.3s'
          }}
        >
          <span>🆘</span> {sosTriggered ? 'AI EMERGENCY SOS ACTIVE' : 'AI EMERGENCY HELP / SOS'}
        </button>

        {sosTriggered && (
          <div style={{
            marginTop: '12px',
            background: 'rgba(255, 75, 75, 0.05)',
            border: '1px solid rgba(255, 75, 75, 0.3)',
            borderRadius: '16px',
            padding: '1.25rem',
            boxShadow: '0 8px 32px rgba(255,75,75,0.1)'
          }}>
            {sosLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '1rem' }}>
                <div style={{ width: '32px', height: '32px', border: '3px solid rgba(255,75,75,0.1)', borderTopColor: '#FF4B4B', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <div style={{ fontSize: '0.85rem', color: '#FF4B4B', fontWeight: 'bold', fontFamily: 'monospace' }}>
                  🚨 AI Locating & Dispatching emergency systems...
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '0.9rem', color: '#FF4B4B', fontWeight: 'bold', borderBottom: '1px solid rgba(255,75,75,0.2)', paddingBottom: '6px' }}>
                  🚨 AI DISPATCHED: Help arriving in 2 mins
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 12px', alignItems: 'center', fontSize: '0.9rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>📍</span>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block' }}>EXACT LOCATION</span>
                    <strong style={{ color: '#fff' }}>{sosDetails?.location}</strong>
                  </div>

                  <span style={{ fontSize: '1.1rem' }}>🛡️</span>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block' }}>NEAREST GUARD</span>
                    <strong style={{ color: '#fff' }}>{sosDetails?.guard}</strong>
                  </div>

                  <span style={{ fontSize: '1.1rem' }}>🚑</span>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block' }}>NEAREST AMBULANCE</span>
                    <strong style={{ color: '#fff' }}>{sosDetails?.ambulance}</strong>
                  </div>

                  <span style={{ fontSize: '1.1rem' }}>🗺️</span>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block' }}>SHORTEST SAFE ROUTE</span>
                    <strong style={{ color: '#FF4B4B' }}>{sosDetails?.route}</strong>
                  </div>
                </div>

                <button
                  onClick={cancelSos}
                  style={{
                    marginTop: '8px',
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'var(--text-secondary)',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel Request / Reset SOS
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Visual Accessibility Controls */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 14px 0', fontSize: '0.8rem', letterSpacing: '2px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Eye size={14} /> VISUAL & AUDIO SETTINGS
        </h3>

        {[
          { label: '🔳 High Contrast Mode', desc: 'Black background for better visibility', state: highContrast, toggle: () => setHighContrast(p => !p) },
          { label: '🔤 Large Text Mode', desc: 'Bigger font size throughout the app', state: largeText, toggle: () => setLargeText(p => !p) },
          { label: '🔊 Audio Guide (EN)', desc: 'AI reads out directions & info aloud', state: audioGuide, toggle: handleToggleAudioGuide },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <div style={{ fontWeight: '600', fontSize, color: '#fff' }}>{item.label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.desc}</div>
            </div>
            <button onClick={item.toggle} style={{ width: '52px', height: '28px', borderRadius: '14px', background: item.state ? 'var(--accent-green)' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'all 0.3s' }}>
              <div style={{ position: 'absolute', top: '4px', left: item.state ? '28px' : '4px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', transition: 'all 0.3s' }}></div>
            </button>
          </div>
        ))}
      </div>

      {/* GenAI Sensory rest & Calm path advisor */}
      <div style={{ background: 'linear-gradient(135deg, rgba(0,200,255,0.06), rgba(0,0,0,0.4))', border: '1px solid rgba(0,200,255,0.2)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '0.8rem', letterSpacing: '2px', color: '#00C8FF', display: 'flex', alignItems: 'center', gap: '6px' }}>
          🧘 AI SENSORY GUIDE COORDINATOR
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 12px 0', lineHeight: '1.4' }}>
          Generate quiet path mapping and sensory resting advice for neurodivergent or sensory-sensitive fans.
        </p>
        <button
          onClick={getAccessibilityAiGuide}
          disabled={accessLoading}
          style={{
            width: '100%',
            background: 'rgba(0, 200, 255, 0.1)',
            border: '1px solid rgba(0, 200, 255, 0.3)',
            color: '#00C8FF',
            padding: '10px',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          {accessLoading ? 'Coordinating sensory rest...' : '🤖 AI Sensory Guide Coordinator'}
        </button>
        {accessAiText && (
          <div style={{
            marginTop: '12px',
            background: 'rgba(0, 200, 255, 0.04)',
            border: '1px solid rgba(0, 200, 255, 0.15)',
            padding: '12px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            color: '#fff',
            lineHeight: '1.4',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap'
          }}>
            {accessAiText}
          </div>
        )}
      </div>

      {/* Wheelchair Accessible Routes */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '0.8rem', letterSpacing: '2px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ♿ WHEELCHAIR ACCESSIBLE ROUTES
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {ACCESSIBLE_ZONES.map(zone => (
            <div key={zone.id} onClick={() => setSelectedRoute(zone.id)} style={{ background: selectedRoute === zone.id ? 'rgba(0,200,255,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selectedRoute === zone.id ? '#00C8FF' : zone.color + '44'}`, borderRadius: '12px', padding: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={16} color={zone.color} />
                  <div>
                    <div style={{ fontWeight: '600', color: '#fff', fontSize }}>{zone.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{zone.note}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: zone.color, fontWeight: 'bold', fontSize: '0.85rem' }}>{zone.time} walk</div>
                  <div style={{ fontSize: '0.7rem', color: zone.color, background: zone.color + '22', padding: '2px 8px', borderRadius: '8px', marginTop: '4px' }}>{zone.status}</div>
                </div>
              </div>
              {selectedRoute === zone.id && (
                <button onClick={() => navigate('/maps')} style={{ width: '100%', marginTop: '10px', background: '#00C8FF', border: 'none', color: '#000', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Navigation size={16} /> Show Accessible Route on Map
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sensory Friendly Zones */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '0.8rem', letterSpacing: '2px', color: 'var(--text-secondary)' }}>🧠 SENSORY-FRIENDLY ZONES</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SENSORY_ZONES.map(zone => (
            <div key={zone.name} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '1.8rem' }}>{zone.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#fff', fontSize }}>{zone.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{zone.location}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Capacity</div>
                <div style={{ fontWeight: 'bold', color: 'var(--accent-yellow)', fontSize: '0.9rem' }}>{zone.capacity}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sign Language & Captioning */}
      <div style={{ background: 'rgba(43,255,136,0.05)', border: '1px solid var(--border-green)', borderRadius: '16px', padding: '1.25rem' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '0.8rem', letterSpacing: '2px', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Volume2 size={14} /> LIVE ASSISTANCE SERVICES
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { icon: '🤟', label: 'ASL / Sign Language Interpreter', info: 'Available at Info Desk, Gate A & D' },
            { icon: '📝', label: 'Live AI Captioning', info: 'Enabled in all PA announcements' },
            { icon: '🌍', label: 'Multilingual Audio Descriptions', info: 'EN, AR, ES, FR, PT, DE, JA, HI' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
              <div>
                <div style={{ fontWeight: '600', color: '#fff', fontSize }}>{s.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.info}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', background: 'rgba(43,255,136,0.08)', borderRadius: '10px' }}>
          <Heart size={16} color="var(--accent-green)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-green)' }}>VenueMind AI is monitoring your accessibility needs in real-time.</span>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;
