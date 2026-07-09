import React, { useState, useEffect } from 'react';
import { Navigation, Users, Bot, CheckCircle2, Info, Timer, AlertTriangle, Target, ShieldCheck, Accessibility as AccessibilityIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMatchTimer } from '../hooks/useMatchTimer';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLiveNavigating, setIsLiveNavigating] = useState(false);
  
  // Dynamic Rerouting State
  const [routeGate, setRouteGate] = useState('GATE B');
  const [notification, setNotification] = useState(null);

  const simulateReroute = () => {
    // Step 1: Red Alert
    setNotification({ type: 'danger', message: '🚨 LIVE ALERT: Gate B is crowded (15m wait). Recalculating...' });
    
    // Step 2: Green Resolution
    setTimeout(() => {
      setRouteGate('GATE C');
      setNotification({ type: 'success', message: '✅ REROUTED: Proceed to Gate C (2m wait). Time saved: 13 mins!' });
      
      // Step 3: Hide Notification
      setTimeout(() => setNotification(null), 5000);
    }, 2500);
  };

  // Dynamic Match Timer Hook
  const { timerValues } = useMatchTimer();
  
  return (
    <div style={{ padding: '0', paddingBottom: '120px', zIndex: 1, position: 'relative' }}>
      
      {/* Global Reroute Notification Overlay */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '400px',
          background: notification.type === 'danger' ? 'rgba(255, 75, 75, 0.95)' : 'rgba(43, 255, 136, 0.95)',
          color: notification.type === 'danger' ? '#fff' : '#000',
          padding: '1rem',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'slideDown 0.3s ease-out'
        }}>
          {notification.type === 'danger' ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
          <span style={{ fontWeight: 'bold', fontSize: '0.95rem', lineHeight: '1.4' }}>{notification.message}</span>
        </div>
      )}

      {/* Top AI Agent Banner */}
      <div style={{ background: '#0a101d', padding: '10px 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', background: 'var(--accent-green)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-green)' }}></div>
          <span style={{ color: 'var(--accent-green)', fontWeight: '800', fontSize: '0.65rem', letterSpacing: '1px', fontFamily: 'monospace' }}>AI AGENT ACTIVE: OPTIMIZING CROWD FLOW</span>
        </div>
        <span style={{ color: '#fff', fontSize: '0.65rem', fontWeight: 'bold', fontFamily: 'monospace' }}>CONFIDENCE: 98.4%</span>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {/* Header Text */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ color: 'var(--accent-green)', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px' }}>DOHA, QATAR | MATCHDAY 14</p>
            <h1 style={{ fontSize: '2.5rem', margin: '0', lineHeight: '1.1', fontWeight: '400', color: '#fff' }}>
              Welcome to <span style={{ color: 'var(--accent-yellow)', fontWeight: 'bold' }}>Lusail<br/>Stadium</span>
            </h1>
          </div>
          {/* Hidden Demo Trigger */}
          <button onClick={simulateReroute} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
            <Target size={20} color="var(--accent-yellow)" />
          </button>
        </div>
        
        <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '0', marginBottom: '1.5rem', fontSize: '1rem', lineHeight: '1.5' }}>
          Experience the FIFA World Cup 2026 through the lens of artificial intelligence. Your journey to Section 204 starts here.
        </p>

        {/* Match Kickoff Countdown */}
        <div style={{ border: '1px solid rgba(255,222,89,0.3)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', background: 'rgba(255,222,89,0.02)' }}>
          <div className="flex-row justify-between" style={{ marginBottom: '1rem' }}>
            <span style={{ color: 'var(--accent-yellow)', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px' }}>MATCH KICKOFF</span>
            <Timer size={18} color="var(--accent-yellow)" />
          </div>
          <div className="flex-row gap-4">
            <div className="flex-col gap-1"><span style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: '1'}}>{timerValues.hrs}</span><span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '1px' }}>HRS</span></div>
            <div className="flex-col gap-1"><span style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: '1'}}>{timerValues.mins}</span><span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '1px' }}>MIN</span></div>
            <div className="flex-col gap-1"><span style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: '1'}}>{timerValues.secs}</span><span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '1px' }}>SEC</span></div>
          </div>
        </div>

        {/* 🌡️ Live Weather & Heat Index Alert */}
        <div style={{ background: 'linear-gradient(135deg, rgba(255,75,75,0.12), rgba(255,140,0,0.08))', border: '1px solid rgba(255,140,0,0.4)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div className="flex-row justify-between" style={{ marginBottom: '12px', alignItems: 'center' }}>
            <div className="flex-row gap-2" style={{ alignItems: 'center' }}>
              <span style={{ fontSize: '1.4rem' }}>🌡️</span>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#fff' }}>Weather & Heat Alert</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,140,0,0.9)', fontFamily: 'monospace', letterSpacing: '1px' }}>AI HEALTH MONITORING ACTIVE</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#FF6B35', lineHeight: '1' }}>39°C</div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>Lusail, Qatar</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            {[
              { label: 'Heat Index', value: 'EXTREME', color: '#FF4B4B' },
              { label: 'UV Level', value: 'HIGH 8', color: '#FFDE59' },
              { label: 'Humidity', value: '62%', color: '#00C8FF' },
            ].map(w => (
              <div key={w.label} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>{w.label}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: w.color }}>{w.value}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(255,75,75,0.1)', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.1rem' }}>💧</span>
            <span style={{ fontSize: '0.82rem', color: '#fff', lineHeight: '1.4' }}>
              <strong style={{ color: '#FF6B35' }}>AI Alert:</strong> Extreme heat detected. Drink water every 20 mins. Shade zones: Gates A & D, Level 1.
            </span>
          </div>
        </div>

        {/* 🔍 Lost & Found AI Quick Card */}
        <div style={{ background: '#121621', border: '1px solid rgba(0,200,255,0.15)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', background: 'rgba(0,200,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.4rem' }}>
            🔍
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#fff', marginBottom: '2px' }}>Lost & Found AI</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Describe your item — AI will locate it</div>
          </div>
          <button onClick={() => navigate('/concierge')} style={{ background: '#00C8FF', border: 'none', color: '#000', padding: '8px 14px', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Report
          </button>
        </div>

        {/* Smart Navigation Card */}
        <div style={{ background: '#121621', border: '1px solid rgba(43,255,136,0.2)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem', transition: 'all 0.5s', boxShadow: routeGate === 'GATE C' ? '0 0 20px rgba(43,255,136,0.2)' : 'none' }}>
          <div className="flex-row gap-3" style={{ alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ background: 'rgba(43,255,136,0.1)', padding: '8px', borderRadius: '8px' }}>
              <Navigation color="var(--accent-green)" size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Smart Navigation</h3>
            {routeGate === 'GATE C' && <span style={{ background: 'var(--accent-green)', color: '#000', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold', marginLeft: 'auto' }}>REROUTED</span>}
          </div>
          
          <div style={{ position: 'relative', height: '180px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem', background: '#0a0d14' }}>
            <img src="/images/stadium_isometric.png" alt="Map" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--accent-green)', color: '#000', padding: '8px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', whiteSpace: 'nowrap', transition: 'all 0.5s' }}>
              FASTEST ROUTE: {routeGate}
            </div>
          </div>

          <div className="flex-row justify-between" style={{ alignItems: 'center' }}>
            <div className="flex-col">
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px' }}>ESTIMATED TIME</span>
              <span style={{ color: 'var(--accent-green)', fontSize: '1.2rem', fontWeight: '800', lineHeight: '1.1' }}>{routeGate === 'GATE C' ? '7 MINS TO' : '8 MINS TO'}<br/>SEAT</span>
            </div>
            <button 
              onClick={() => { setIsLiveNavigating(true); }}
              style={{ background: 'var(--accent-yellow)', border: 'none', color: '#000', padding: '12px 20px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', textAlign: 'center' }}>
              START<br/>GUIDANCE
            </button>
          </div>
        </div>

        {/* System Modules Grid */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="section-label">SYSTEM MODULES</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { icon: Users, label: 'Crowd AI', path: '/crowd', color: '#B48EFF', bg: 'rgba(180,142,255,0.1)' },
              { icon: ShieldCheck, label: 'Staff Hub', path: '/staff', color: '#FFDE59', bg: 'rgba(255,222,89,0.1)' },
              { icon: AccessibilityIcon, label: 'Accessibility', path: '/access', color: '#00C8FF', bg: 'rgba(0,200,255,0.1)' },
            ].map(mod => {
              const Icon = mod.icon;
              return (
                <div key={mod.label} onClick={() => navigate(mod.path)} className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ background: mod.bg, padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={24} color={mod.color} />
                  </div>
                  <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>{mod.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Heatmap Card */}
        <div style={{ background: '#121621', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div className="flex-row justify-between" style={{ alignItems: 'center', marginBottom: '1.25rem' }}>
            <div className="flex-row gap-3" style={{ alignItems: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px' }}>
                <Users color="#fff" size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Live Heatmap</h3>
            </div>
            <span style={{ color: 'var(--accent-green)', fontWeight: 'bold', fontSize: '0.7rem', letterSpacing: '1px' }}>LIVE 1:1</span>
          </div>

          <div style={{ position: 'relative', height: '160px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem', background: '#000' }}>
            <img src="/images/stadium_heatmap.png" alt="Heatmap" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
            
            {/* Overlay Labels */}
            <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(10,13,20,0.85)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
               <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem', fontWeight: 'bold', marginBottom: '2px' }}>ZONE A (FAN ZONE)</div>
               <div style={{ color: '#FF4B4B', fontSize: '0.9rem', fontWeight: 'bold' }}>CROWDED (92%)</div>
            </div>
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(10,13,20,0.85)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
               <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem', fontWeight: 'bold', marginBottom: '2px' }}>ZONE B (ENTRY)</div>
               <div style={{ color: routeGate === 'GATE C' ? '#FF4B4B' : 'var(--accent-green)', fontSize: '0.9rem', fontWeight: 'bold', transition: 'all 0.5s' }}>
                 {routeGate === 'GATE C' ? 'SPIKE (85%)' : 'CLEAR (14%)'}
               </div>
            </div>
          </div>

          <div className="flex-row gap-3">
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', transition: 'all 0.5s' }}>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem', fontWeight: 'bold', marginBottom: '4px' }}>GATE B TRAFFIC</div>
              <div style={{ color: routeGate === 'GATE C' ? '#FF4B4B' : 'var(--accent-green)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                {routeGate === 'GATE C' ? 'SEVERE' : 'LOW'}
              </div>
            </div>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem', fontWeight: 'bold', marginBottom: '4px' }}>CONCESSION 12</div>
              <div style={{ color: 'var(--accent-yellow)', fontSize: '0.9rem', fontWeight: 'bold' }}>MODERATE</div>
            </div>
          </div>
        </div>

        {/* AI Concierge Card */}
        <div style={{ background: '#121621', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--accent-yellow)' }}>
          <div className="flex-row gap-3" style={{ alignItems: 'flex-start' }}>
            <div style={{ background: 'var(--accent-yellow)', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot color="#000" size={24} />
            </div>
            <div className="flex-col" style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: '600' }}>AI Concierge</h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.4' }}>
                "Where is the nearest official merchandise stand with the Brazil jersey?"
              </p>
              <button 
                onClick={() => navigate('/concierge')}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-yellow)', fontWeight: 'bold', fontSize: '0.8rem', padding: 0, display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '1px', cursor: 'pointer' }}>
                ASK SOMETHING →
              </button>
            </div>
          </div>
        </div>

        {/* Gate Status Card */}
        <div style={{ background: '#121621', borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.5s' }}>
          <div style={{ width: '40px', height: '40px', background: routeGate === 'GATE C' ? 'rgba(255, 75, 75, 0.15)' : 'rgba(43,255,136,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {routeGate === 'GATE C' ? <AlertTriangle color="#FF4B4B" size={20} /> : <CheckCircle2 color="var(--accent-green)" size={20} />}
          </div>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px' }}>GATE B STATUS</div>
            <div style={{ color: '#fff', fontSize: '0.95rem' }}>
              {routeGate === 'GATE C' ? 'High Traffic - 15m wait' : 'Low Traffic - 2m wait'}
            </div>
          </div>
        </div>

        {/* Smart Transportation Card */}
        <div style={{ background: '#121621', border: '1px solid rgba(0, 200, 255, 0.2)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div className="flex-row justify-between" style={{ marginBottom: '1rem', alignItems: 'center' }}>
            <div className="flex-row gap-3" style={{ alignItems: 'center' }}>
              <div style={{ background: 'rgba(0, 200, 255, 0.1)', padding: '8px', borderRadius: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C8FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v16"/><path d="M8 19v2"/><path d="M16 19v2"/></svg>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>AI Transit Dispatch</h3>
            </div>
            <span style={{ color: '#00C8FF', fontWeight: 'bold', fontSize: '0.7rem', letterSpacing: '1px' }}>AI RECOMMENDED</span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 1rem 0', lineHeight: '1.4' }}>
            "Uber/Careem zone is highly congested (35m delay). Take the <strong>Lusail Metro (Red Line)</strong>—departing every 2 mins with zero queues."
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>LUSAIL METRO</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--accent-green)', fontWeight: 'bold' }}>2m Wait (Clear)</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>SHUTTLE BUS D</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--accent-yellow)', fontWeight: 'bold' }}>8m Wait (Normal)</div>
            </div>
          </div>
        </div>

        {/* Seating Alert Card */}
        <div style={{ background: '#121621', borderRadius: '16px', padding: '1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', background: 'rgba(255,222,89,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Info color="var(--accent-yellow)" size={20} />
          </div>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px' }}>SEATING ALERT</div>
            <div style={{ color: '#fff', fontSize: '0.95rem' }}>Section 204 - Escalator Active</div>
          </div>
        </div>

      </div>

      {/* Floating AI Assistant Button */}
      <button 
        onClick={() => navigate('/concierge')}
        style={{ position: 'fixed', bottom: '100px', right: '20px', height: '60px', padding: '0 24px', background: 'var(--accent-yellow)', borderRadius: '30px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(255,222,89,0.3)', cursor: 'pointer', zIndex: 200 }}>
        <Bot color="#000" size={24} />
        <span style={{ color: '#000', fontWeight: 'bold', fontSize: '1rem', whiteSpace: 'nowrap' }}>AI Assistant</span>
      </button>

      {/* Live Navigation Popup Overlay */}
      {isLiveNavigating && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: '#050A14', display: 'flex', flexDirection: 'column' }}>
          
          {/* Turn-by-Turn Header */}
          <div style={{ background: 'var(--accent-green)', padding: '2rem 1.5rem 1.5rem 1.5rem', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 10px 30px rgba(43,255,136,0.2)', zIndex: 2010 }}>
            <div style={{ width: '50px', height: '50px', background: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M12 5L5 12M12 5l7 7"/></svg>
            </div>
            <div>
              <h2 style={{ color: '#000', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Head straight</h2>
              <p style={{ color: 'rgba(0,0,0,0.7)', margin: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>for 50 meters, then turn left.</p>
            </div>
          </div>

          {/* Full Screen Live Map */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <img src="/images/stadium_isometric.png" alt="Live Map" style={{ position: 'absolute', width: '150%', height: '150%', objectFit: 'cover', top: '-25%', left: '-25%', filter: 'brightness(0.7)' }} />
            
            {/* Pulsing Animated SVG Path for Popup */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
              <path 
                d="M100,900 L400,600 L600,600 L900,300" 
                fill="none" 
                stroke="var(--accent-yellow)" 
                strokeWidth="12" 
                strokeDasharray="25, 20" 
                style={{ animation: 'dash 1.5s linear infinite', filter: 'drop-shadow(0 0 20px var(--accent-yellow))' }} 
              />
              <circle cx="100" cy="900" r="20" fill="var(--accent-yellow)" style={{ animation: 'pulse 1s infinite' }} />
              <circle cx="900" cy="300" r="25" fill="#000" stroke="var(--accent-yellow)" strokeWidth="8" />
            </svg>

            {/* Current Location Dot */}
            <div style={{ position: 'absolute', top: '70%', left: '30%', width: '30px', height: '30px', background: '#00C8FF', borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 0 20px #00C8FF', zIndex: 2, transform: 'translate(-50%, -50%)' }}>
              <div style={{ position: 'absolute', inset: '-20px', borderRadius: '50%', border: '2px solid #00C8FF', animation: 'pulse 2s infinite' }}></div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '2rem 1.5rem', background: 'linear-gradient(transparent, #050A14 30%)', zIndex: 2010 }}>
            <div className="flex-row justify-between" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '1rem', borderRadius: '16px', alignItems: 'center' }}>
              <div className="flex-col">
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>4 min</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>340m • {routeGate}</span>
              </div>
              <button 
                onClick={() => setIsLiveNavigating(false)}
                style={{ background: '#FF4B4B', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { top: -100px; opacity: 0; }
          to { top: 20px; opacity: 1; }
        }
        @keyframes dash {
          to { stroke-dashoffset: -45; }
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
