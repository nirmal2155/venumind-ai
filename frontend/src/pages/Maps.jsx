import React, { useState, useEffect } from 'react';
import { Navigation, CheckCircle2, Timer, AlertTriangle, Target, Users, Bot, Info, Camera, Tv, Maximize2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMatchTimer } from '../hooks/useMatchTimer';

const Maps = () => {
  const navigate = useNavigate();
  const [isLiveNavigating, setIsLiveNavigating] = useState(false);
  
  // Dynamic Rerouting State
  const [routeGate, setRouteGate] = useState('GATE B');
  const [notification, setNotification] = useState(null);

  // --- 3D Seat Preview States ---
  const [selectedSector, setSelectedSector] = useState('vip');
  const [activeOverlay, setActiveOverlay] = useState('normal');
  const [zoomLevel, setZoomLevel] = useState(1);

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
          <button onClick={simulateReroute} aria-label="Trigger AI route optimization recalculation" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
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
            <img src="/images/stadium_isometric.png" alt="Stadium Seating Isometric map navigation overview" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
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
              onClick={() => setIsLiveNavigating(true)}
              style={{ background: 'var(--accent-yellow)', border: 'none', color: '#000', padding: '12px 20px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', textAlign: 'center' }}>
              START<br/>GUIDANCE
            </button>
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
            <img src="/images/stadium_heatmap.png" alt="Live Crowd Occupancy Heatmap of Sector A and B" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
            
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

        {/* 🏟️ Interactive AI Seat Angle Previewer */}
        <div style={{ background: '#121621', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid rgba(0, 200, 255, 0.15)' }}>
          <div className="flex-row justify-between" style={{ alignItems: 'center', marginBottom: '1.25rem' }}>
            <div className="flex-row gap-3" style={{ alignItems: 'center' }}>
              <div style={{ background: 'rgba(0, 200, 255, 0.1)', padding: '8px', borderRadius: '8px' }}>
                <Camera color="#00C8FF" size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>AI Seat Angle Preview</h3>
            </div>
            <span style={{ color: '#00C8FF', fontWeight: 'bold', fontSize: '0.7rem', letterSpacing: '1px' }}>3D TACTICAL VIEW</span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 1.25rem 0', lineHeight: '1.4' }}>
            Simulate the precise visual angle of the pitch from different seating sections of the Lusail Stadium.
          </p>

          {/* Sector Select Dropdown / Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1rem' }}>
            {[
              { id: 'vip', label: 'VIP Suite (Midfield)' },
              { id: 'east', label: 'East Stand (Close)' },
              { id: 'west', label: 'West Curve (Goal)' },
              { id: 'presidential', label: 'Presidential Box' }
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedSector(s.id)}
                style={{
                  background: selectedSector === s.id ? '#00C8FF' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selectedSector === s.id ? '#00C8FF' : 'rgba(255,255,255,0.1)'}`,
                  color: selectedSector === s.id ? '#000' : '#fff',
                  padding: '8px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}>
                {s.label}
              </button>
            ))}
          </div>

          {/* 3D Simulated Pitch Field Render */}
          {(() => {
            let fieldTransform = `perspective(700px) rotateX(55deg) scale(${zoomLevel})`;
            if (selectedSector === 'east') {
              fieldTransform = `perspective(700px) rotateX(65deg) translateY(-10px) scale(${zoomLevel * 1.15})`;
            } else if (selectedSector === 'west') {
              fieldTransform = `perspective(700px) rotateX(60deg) rotateZ(90deg) scale(${zoomLevel})`;
            } else if (selectedSector === 'presidential') {
              fieldTransform = `perspective(700px) rotateX(40deg) scale(${zoomLevel * 0.85})`;
            }

            return (
              <div style={{
                position: 'relative',
                height: '240px',
                background: '#04070c',
                borderRadius: '12px',
                border: '1px solid rgba(0, 200, 255, 0.2)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8)',
                marginBottom: '1rem'
              }}>
                {/* HUD Info Overlay */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '2px', background: 'rgba(5, 10, 20, 0.8)', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(0, 200, 255, 0.2)' }}>
                  <span style={{ fontSize: '0.6rem', color: '#00C8FF', fontFamily: 'monospace', fontWeight: 'bold' }}>CAM ANGLE: {selectedSector === 'vip' ? '35.4°' : selectedSector === 'east' ? '18.2°' : selectedSector === 'west' ? '42.1°' : '55.0°'}</span>
                  <span style={{ fontSize: '0.6rem', color: '#00C8FF', fontFamily: 'monospace', fontWeight: 'bold' }}>DISTANCE: {selectedSector === 'vip' ? '68m' : selectedSector === 'east' ? '45m' : selectedSector === 'west' ? '92m' : '110m'}</span>
                </div>

                {/* View Zoom Control Overlay */}
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex: 10, display: 'flex', gap: '6px' }}>
                  <button onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 1.5))} aria-label="Zoom In Seating View" style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}>+</button>
                  <button onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.8))} aria-label="Zoom Out Seating View" style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}>-</button>
                </div>

                {/* 3D Perspective Pitch Container */}
                <div style={{
                  width: '280px',
                  height: '180px',
                  background: activeOverlay === 'thermal' ? 'radial-gradient(circle, #3a0000 20%, #150000 70%)' : 'linear-gradient(135deg, #1b4d22 0%, #143518 100%)',
                  border: '3px solid rgba(255,255,255,0.4)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
                  transform: fieldTransform,
                  transition: 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  position: 'relative'
                }}>
                  {/* Field Markings */}
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '2px', background: 'rgba(255,255,255,0.4)', transform: 'translateX(-50%)' }} />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', width: '50px', height: '50px', border: '2px solid rgba(255,255,255,0.4)', borderRadius: '50%', transform: 'translate(-50%, -50%)' }} />
                  <div style={{ position: 'absolute', left: 0, top: '25%', bottom: '25%', width: '40px', border: '2px solid rgba(255,255,255,0.4)', borderLeft: 'none' }} />
                  <div style={{ position: 'absolute', right: 0, top: '25%', bottom: '25%', width: '40px', border: '2px solid rgba(255,255,255,0.4)', borderRight: 'none' }} />

                  {/* Tactical Players dots overlay */}
                  <div style={{ position: 'absolute', inset: 0 }}>
                    <div style={{ position: 'absolute', left: '20%', top: '50%', width: '8px', height: '8px', background: '#00C8FF', borderRadius: '50%', boxShadow: '0 0 8px #00C8FF' }} />
                    <div style={{ position: 'absolute', left: '40%', top: '30%', width: '8px', height: '8px', background: '#00C8FF', borderRadius: '50%', boxShadow: '0 0 8px #00C8FF' }} />
                    <div style={{ position: 'absolute', left: '40%', top: '70%', width: '8px', height: '8px', background: '#00C8FF', borderRadius: '50%', boxShadow: '0 0 8px #00C8FF' }} />
                    <div style={{ position: 'absolute', left: '60%', top: '45%', width: '8px', height: '8px', background: '#00C8FF', borderRadius: '50%', boxShadow: '0 0 8px #00C8FF' }} />

                    <div style={{ position: 'absolute', right: '20%', top: '50%', width: '8px', height: '8px', background: '#FF4B4B', borderRadius: '50%', boxShadow: '0 0 8px #FF4B4B' }} />
                    <div style={{ position: 'absolute', right: '40%', top: '25%', width: '8px', height: '8px', background: '#FF4B4B', borderRadius: '50%', boxShadow: '0 0 8px #FF4B4B' }} />
                    <div style={{ position: 'absolute', right: '40%', top: '75%', width: '8px', height: '8px', background: '#FF4B4B', borderRadius: '50%', boxShadow: '0 0 8px #FF4B4B' }} />
                    <div style={{ position: 'absolute', right: '55%', top: '55%', width: '8px', height: '8px', background: '#FF4B4B', borderRadius: '50%', boxShadow: '0 0 8px #FF4B4B' }} />
                  </div>

                  {/* TACTICAL OVERLAY */}
                  {activeOverlay === 'tactical' && (
                    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                      <line x1="20%" y1="50%" x2="40%" y2="30%" stroke="var(--accent-yellow)" strokeWidth="2" strokeDasharray="3, 3" />
                      <line x1="40%" y1="30%" x2="60%" y2="45%" stroke="var(--accent-yellow)" strokeWidth="2" strokeDasharray="3, 3" />
                      <line x1="60%" y1="45%" x2="80%" y2="50%" stroke="var(--accent-green)" strokeWidth="3" />
                      <circle cx="80%" cy="50%" r="5" fill="var(--accent-green)" />
                    </svg>
                  )}

                  {/* THERMAL OVERLAY */}
                  {activeOverlay === 'thermal' && (
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 30%, rgba(255,75,75,0.6) 0%, rgba(255,222,89,0.3) 40%, transparent 70%), radial-gradient(circle at 30% 70%, rgba(255,75,75,0.5) 0%, rgba(255,222,89,0.2) 40%, transparent 70%)', pointerEvents: 'none' }} />
                  )}
                </div>

                {/* Grid scanning effect */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0, 200, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 200, 255, 0.05) 1px, transparent 1px)', backgroundSize: '15px 15px', pointerEvents: 'none' }} />
              </div>
            );
          })()}

          {/* View Overlay Toggle */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'normal', label: 'Tactical View', icon: Tv },
              { id: 'tactical', label: 'Pass Map', icon: Maximize2 },
              { id: 'thermal', label: 'Occupancy Heat', icon: Eye }
            ].map(o => {
              const Icon = o.icon;
              return (
                <button
                  key={o.id}
                  onClick={() => setActiveOverlay(o.id)}
                  style={{
                    flex: 1,
                    background: activeOverlay === o.id ? 'rgba(0, 200, 255, 0.1)' : 'transparent',
                    border: `1px solid ${activeOverlay === o.id ? '#00C8FF' : 'rgba(255,255,255,0.1)'}`,
                    color: activeOverlay === o.id ? '#00C8FF' : '#fff',
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transition: 'all 0.3s'
                  }}>
                  <Icon size={12} /> {o.label}
                </button>
              );
            })}
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

        {/* Smart Parking Intelligence Card */}
        <div style={{ background: '#121621', border: '1px solid rgba(255,222,89,0.2)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div className="flex-row justify-between" style={{ marginBottom: '1rem', alignItems: 'center' }}>
            <div className="flex-row gap-3" style={{ alignItems: 'center' }}>
              <div style={{ background: 'rgba(255,222,89,0.1)', padding: '8px', borderRadius: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-yellow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Smart Parking AI</h3>
            </div>
            <span style={{ color: 'var(--accent-yellow)', fontWeight: 'bold', fontSize: '0.7rem', letterSpacing: '1px' }}>LIVE TRACKING</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1rem' }}>
            {[
              { zone: 'P1 — North', pct: 92, color: '#FF4B4B', status: 'FULL' },
              { zone: 'P2 — East', pct: 68, color: 'var(--accent-yellow)', status: 'BUSY' },
              { zone: 'P3 — South ★', pct: 23, color: 'var(--accent-green)', status: 'CLEAR' },
              { zone: 'P4 — VIP', pct: 45, color: 'var(--accent-green)', status: 'OPEN' },
            ].map(p => (
              <div key={p.zone} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: `1px solid ${p.color}33` }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{p.zone}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: p.color, marginBottom: '6px' }}>{p.pct}% Full</div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                  <div style={{ width: `${p.pct}%`, height: '100%', background: p.color, borderRadius: '2px', transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(43,255,136,0.08)', border: '1px solid var(--border-green)', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--accent-green)', fontWeight: 'bold', letterSpacing: '1px' }}>🤖 AI RECOMMENDATION</div>
              <div style={{ fontSize: '0.85rem', color: '#fff', marginTop: '2px' }}>Use <strong>P3 South</strong> — 8 min shuttle to Gate A</div>
            </div>
            <button style={{ background: 'var(--accent-green)', border: 'none', color: '#000', padding: '8px 14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Book Shuttle
            </button>
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
        style={{ position: 'fixed', bottom: '100px', right: '20px', height: '60px', padding: '0 24px', background: 'var(--accent-yellow)', borderRadius: '30px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(255,222,89,0.3)', cursor: 'pointer', zIndex: 100 }}>
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

export default Maps;
