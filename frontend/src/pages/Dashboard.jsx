import React, { useState, useEffect } from 'react';
import { Navigation, Users, Bot, CheckCircle2, Timer, AlertTriangle, Target, ShieldCheck, Accessibility as AccessibilityIcon, Cpu, CloudRain, Activity, Thermometer, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMatchTimer } from '../hooks/useMatchTimer';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLiveNavigating, setIsLiveNavigating] = useState(false);
  
  // Dynamic Rerouting State
  const [routeGate, setRouteGate] = useState('GATE B');
  const [notification, setNotification] = useState(null);
  const [transitAdvisorText, setTransitAdvisorText] = useState('');
  const [transitLoading, setTransitLoading] = useState(false);
  const [activeSimulationPreset, setActiveSimulationPreset] = useState('Standard');

  const applyPreset = (presetName) => {
    setActiveSimulationPreset(presetName);
    if (presetName === 'Emergency') {
      setRouteGate('GATE C');
      setNotification({ type: 'danger', message: '🚨 EMERGENCY ACTIVE: Gate B capacity surge. Mist fans activated, stewards redeployed.' });
      setSystemLogs(prev => [
        `[PRESET] Applied: Emergency Crowd Surge Mode`,
        `[ALERT] Outer Barrier Tier 1: Sector 4 perimeter warning`,
        ...prev.slice(0, 5)
      ]);
    } else if (presetName === 'Eco') {
      setRouteGate('GATE B');
      setNotification({ type: 'success', message: '🌱 ECO PRESET ACTIVE: Grid load reduced by 14.2%, solar optimization enabled.' });
      setSystemLogs(prev => [
        `[PRESET] Applied: Sustainable Eco Match Day`,
        `[SOLAR] Grid efficiency set to optimum 87%`,
        ...prev.slice(0, 5)
      ]);
    } else {
      setRouteGate('GATE B');
      setNotification({ type: 'success', message: '⚽ Standard Mode: इसके तहत पूरा स्टेडियम सामान्य रूप से संचालित होता है और एआई सोलर ग्रिड 87% दक्षता पर काम करता है।' });
      setSystemLogs(prev => [
        `[PRESET] Applied: Standard Tournament Mode`,
        `[SYS_INFO] Uptime normal, 98.4% system reliability`,
        ...prev.slice(0, 5)
      ]);
    }
  };

  const consultTransitAdvisor = async () => {
    setTransitLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Give me real-time transport options from Lusail Stadium to Doha Downtown given the taxi loop delay is 35 minutes and Metro is active.' })
      });
      const data = await res.json();
      setTransitAdvisorText(data.reply);
    } catch {
      setTransitAdvisorText('Error connecting to GenAI transit node.');
    }
    setTransitLoading(false);
  };

  const [systemLogs, setSystemLogs] = useState([
    "SYS_INIT: VenueMind Core Kernel v1.3.0 loaded",
    "NETWORK: Encrypted connection to Lusail Grid established",
    "CROWD_TELEMETRY: Gate B capacity stable at 45/min"
  ]);

  const simulateReroute = () => {
    // Step 1: Red Alert
    setNotification({ type: 'danger', message: '🚨 LIVE ALERT: Gate B capacity spike (15m wait). Recalculating path...' });
    setSystemLogs(prev => [
      `[ALERT] Crowd density at Gate B reached 92%. Rerouting fans...`,
      ...prev.slice(0, 5)
    ]);
    
    // Step 2: Green Resolution
    setTimeout(() => {
      setRouteGate('GATE C');
      setNotification({ type: 'success', message: '✅ REROUTED: Proceed to Gate C (2m wait). Time saved: 13 mins!' });
      setSystemLogs(prev => [
        `[RESOLVED] Rerouted via Gate C. Sector A bottleneck neutralized.`,
        ...prev.slice(0, 5)
      ]);
      
      // Step 3: Hide Notification
      setTimeout(() => setNotification(null), 5000);
    }, 2500);
  };

  // Auto system logs simulation to make the HUD feel alive
  useEffect(() => {
    const logPool = [
      "AI: Recalculating crowd vectors in Sector 3...",
      "WEATHER: HVAC cooling adjusted to 21°C in Sector A",
      "SYS: Lidar sensor calibration complete across 1,400 CCTV nodes",
      "TRANSIT: Metro dispatch frequency optimized (2 min wait)",
      "STAFF: Dispatched AI sanitation unit to Concession 12",
      "SOLAR: Photovoltaic grid efficiency stable at 87%",
      "CROWD: High flow rate detected near Gate 4 escalator"
    ];
    let i = 0;
    const interval = setInterval(() => {
      setSystemLogs(prev => [logPool[i], ...prev.slice(0, 4)]);
      i = (i + 1) % logPool.length;
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Dynamic Match Timer Hook
  const { timerValues } = useMatchTimer();
  
  return (
    <div style={{ padding: '0', paddingBottom: '120px', zIndex: 1, position: 'relative', background: '#030712', minHeight: '100vh', color: '#fff' }}>
      
      {/* Global Reroute Notification Overlay */}
      {notification && (
        <div className="cyber-glow-border" style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '420px',
          background: notification.type === 'danger' ? 'rgba(255, 30, 30, 0.95)' : 'rgba(0, 240, 120, 0.95)',
          color: notification.type === 'danger' ? '#fff' : '#000',
          padding: '1.2rem',
          borderRadius: '16px',
          boxShadow: notification.type === 'danger' ? '0 15px 40px rgba(255, 0, 0, 0.4)' : '0 15px 40px rgba(0, 240, 120, 0.4)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backdropFilter: 'blur(10px)',
          border: notification.type === 'danger' ? '1px solid #ff4b4b' : '1px solid #00f078',
          animation: 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {notification.type === 'danger' ? <AlertTriangle size={24} className="pulse-fast" /> : <CheckCircle2 size={24} />}
          <span style={{ fontWeight: 'bold', fontSize: '0.95rem', lineHeight: '1.4', fontFamily: 'system-ui, -apple-system' }}>{notification.message}</span>
        </div>
      )}

      {/* Top AI HUD Active Bar */}
      <div style={{
        background: 'linear-gradient(90deg, #09101d, #050b14)',
        padding: '12px 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(0, 200, 255, 0.15)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
        position: 'sticky',
        top: '68px',
        zIndex: 90
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cpu size={16} className="pulse-neon-green" style={{ color: 'var(--accent-green)' }} />
          <span style={{ color: 'var(--accent-green)', fontWeight: '800', fontSize: '0.7rem', letterSpacing: '2px', fontFamily: 'monospace' }}>AI AGENT: MONIT_FLOW_ACTIVE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#00C8FF', fontSize: '0.65rem', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '1px' }}>SYS_CONF: 98.4%</span>
          <div className="telemetry-ping"></div>
        </div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        
        {/* Futuristic Dashboard Header */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span className="live-badge">LIVE</span>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '2px', margin: 0, fontFamily: 'monospace' }}>LUSAIL STADIUM | DAY 14</p>
            </div>
            <h1 style={{ fontSize: '2.8rem', margin: '0', lineHeight: '1.05', fontWeight: '800', letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #fff 60%, rgba(255,255,255,0.3))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Stadium <span style={{ color: 'var(--accent-yellow)', textShadow: '0 0 25px rgba(255,222,89,0.3)' }}>Portal</span>
            </h1>
          </div>
          {/* AI Trigger button - designed like a scan target */}
          <button 
            onClick={simulateReroute} 
            className="target-glow-btn"
            title="Simulate AI Flow Adjustment"
            style={{
              background: 'rgba(255, 222, 89, 0.08)',
              border: '1px solid var(--accent-yellow)',
              padding: '12px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}>
            <Target size={22} color="var(--accent-yellow)" />
          </button>
        </div>

        {/* GenAI Simulator Preset Selector */}
        <div style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '1rem',
          scrollbarWidth: 'none',
          marginBottom: '1rem'
        }}>
          {[
            { id: 'Standard', label: '⚽ Standard Mode', color: 'var(--accent-green)' },
            { id: 'Emergency', label: '🚨 Crowd Surge Mode', color: '#ff4b4b' },
            { id: 'Eco', label: '🌱 Eco Match Mode', color: '#00c8ff' }
          ].map(preset => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              style={{
                background: activeSimulationPreset === preset.id ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${activeSimulationPreset === preset.id ? preset.color : 'rgba(255,255,255,0.08)'}`,
                color: activeSimulationPreset === preset.id ? preset.color : 'var(--text-secondary)',
                borderRadius: '12px',
                padding: '8px 16px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s'
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* ⏱️ Match Kickoff Countdown HUD Card */}
        <div className="cyber-hud-card" style={{
          border: '1px solid rgba(255, 222, 89, 0.25)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, rgba(255, 222, 89, 0.03), rgba(0,0,0,0.4))',
          boxShadow: '0 8px 32px rgba(255, 222, 89, 0.04)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle tech lines decoration */}
          <div className="tech-corner-top-right"></div>
          
          <div className="flex-row justify-between" style={{ marginBottom: '1.25rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Timer size={16} color="var(--accent-yellow)" />
              <span style={{ color: 'var(--accent-yellow)', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px', fontFamily: 'monospace' }}>KICKOFF COUNTDOWN</span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontFamily: 'monospace' }}>UTC+3</span>
          </div>

          <div className="flex-row gap-6" style={{ alignItems: 'center' }}>
            <div className="countdown-group">
              <span className="countdown-time">{timerValues.hrs}</span>
              <span className="countdown-label">HOURS</span>
            </div>
            <span className="countdown-separator">:</span>
            <div className="countdown-group">
              <span className="countdown-time">{timerValues.mins}</span>
              <span className="countdown-label">MINUTES</span>
            </div>
            <span className="countdown-separator">:</span>
            <div className="countdown-group">
              <span className="countdown-time-active">{timerValues.secs}</span>
              <span className="countdown-label">SECONDS</span>
            </div>
          </div>
        </div>

        {/* 🌡️ Live Weather & Heat Alert HUD (Extreme Heat mitigation design) */}
        <div className="cyber-hud-card" style={{
          border: '1px solid rgba(255, 107, 53, 0.35)',
          borderRadius: '20px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.06), rgba(0,0,0,0.55))',
          boxShadow: '0 8px 32px rgba(255, 107, 53, 0.05)'
        }}>
          <div className="flex-row justify-between" style={{ marginBottom: '1.25rem', alignItems: 'center' }}>
            <div className="flex-row gap-3" style={{ alignItems: 'center' }}>
              <div style={{ width: '42px', height: '42px', background: 'rgba(255, 107, 53, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Thermometer size={22} color="#FF6B35" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#fff' }}>Atmosphere Metric</h3>
                <span style={{ fontSize: '0.65rem', color: '#FF6B35', fontFamily: 'monospace', letterSpacing: '1px' }}>AI HVAC MITIGATION ON</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#FF6B35', lineHeight: '1', fontFamily: 'monospace' }}>39°C</div>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>OUTDOOR AIR</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '1rem' }}>
            {[
              { label: 'Heat Index', value: 'EXTREME', color: '#FF4B4B', icon: AlertTriangle },
              { label: 'UV Radiation', value: 'HIGH 8', color: '#FFDE59', icon: Sun },
              { label: 'Air Humidity', value: '62%', color: '#00C8FF', icon: CloudRain },
            ].map(w => {
              const WIcon = w.icon;
              return (
                <div key={w.label} style={{ background: 'rgba(0,0,0,0.35)', borderRadius: '10px', padding: '10px 8px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '6px' }}>
                    <WIcon size={12} color="rgba(255,255,255,0.5)" />
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>{w.label}</span>
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '900', color: w.color, fontFamily: 'monospace' }}>{w.value}</div>
                </div>
              );
            })}
          </div>

          <div style={{
            background: 'rgba(255, 107, 53, 0.08)',
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            border: '1px solid rgba(255,107,53,0.15)'
          }}>
            <span style={{ fontSize: '1.2rem', marginTop: '-2px' }}>💧</span>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: '1.45' }}>
              <strong style={{ color: '#FF6B35' }}>HYDRATION ALERT:</strong> Extreme climate matrix detected. Rehydration mandatory every 20 minutes. Shaded zones deployed at Gates A & D.
            </p>
          </div>
        </div>

        {/* 🤖 Multilingual AI Concierge Quick Panel */}
        <div className="cyber-hud-card" style={{
          background: 'linear-gradient(135deg, #131a26, #0c1017)',
          border: '1px solid rgba(255,222,89,0.2)',
          borderRadius: '20px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Cyber decoration line */}
          <div style={{ position: 'absolute', top: 0, left: 0, height: '4px', width: '60px', background: 'var(--accent-yellow)' }}></div>

          <div className="flex-row gap-4" style={{ alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--accent-yellow)', padding: '12px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 20px rgba(255,222,89,0.2)' }}>
              <Bot color="#000" size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>Multilingual AI Assistant</h3>
              <span style={{ fontSize: '0.65rem', color: 'var(--accent-yellow)', fontFamily: 'monospace', letterSpacing: '1px', fontWeight: 'bold' }}>8 LANGUAGES AVAILABLE</span>
            </div>
          </div>
          
          <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.75)', margin: '0 0 1.25rem 0', lineHeight: '1.5', fontStyle: 'italic', paddingLeft: '8px', borderLeft: '2px solid rgba(255,222,89,0.3)' }}>
            "Where is the nearest official merchandise stand with the Brazil jersey?"
          </p>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => navigate('/concierge')}
              className="cyber-action-btn"
              style={{
                flex: 1,
                background: 'var(--accent-yellow)',
                border: 'none',
                color: '#000',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 5px 15px rgba(255,222,89,0.1)'
              }}>
              LAUNCH CHAT
            </button>
            <button 
              onClick={() => navigate('/concierge')}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                cursor: 'pointer',
                width: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              🔍
            </button>
          </div>
        </div>

        {/* 🗺️ Interactive Holographic Navigation Card */}
        <div className="cyber-hud-card" style={{
          background: 'linear-gradient(135deg, #0f172a, #0b0f19)',
          border: '1px solid rgba(43,255,136,0.25)',
          borderRadius: '20px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          position: 'relative',
          transition: 'all 0.5s',
          boxShadow: routeGate === 'GATE C' ? '0 0 30px rgba(43,255,136,0.15)' : 'none'
        }}>
          {routeGate === 'GATE C' && (
            <div className="neon-status-badge">AI ROUTING ACTIVE</div>
          )}

          <div className="flex-row gap-3" style={{ alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ background: 'rgba(43,255,136,0.1)', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Navigation color="var(--accent-green)" size={20} className="pulse-slow" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>Holographic Routing</h3>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>DYNAMIC LIDAR PATHWAYS</span>
            </div>
          </div>
          
          {/* Hologram visual simulation */}
          <div className="hologram-container" style={{ position: 'relative', height: '190px', borderRadius: '14px', overflow: 'hidden', marginBottom: '1.25rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            <img src="/images/stadium_isometric.png" alt="Stadium Map" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
            
            {/* Pulsing Lidar scanline */}
            <div className="lidar-scanline"></div>
            
            <div className="hologram-overlay-card">
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: 'bold', marginBottom: '2px', fontFamily: 'monospace' }}>TARGET DEPT</div>
              <div style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--accent-green)' }}>{routeGate}</div>
            </div>
          </div>

          <div className="flex-row justify-between" style={{ alignItems: 'center' }}>
            <div className="flex-col">
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px', fontFamily: 'monospace' }}>EST. TRAVEL TIME</span>
              <span style={{ color: 'var(--accent-green)', fontSize: '1.3rem', fontWeight: '900', lineHeight: '1.2', fontFamily: 'monospace' }}>
                {routeGate === 'GATE C' ? '7 MIN' : '8 MIN'}<br/>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>TO SECTOR 204</span>
              </span>
            </div>
            <button 
              onClick={() => setIsLiveNavigating(true)}
              className="cyber-glow-btn"
              style={{
                background: 'var(--accent-green)',
                border: 'none',
                color: '#000',
                padding: '14px 24px',
                borderRadius: '12px',
                fontWeight: '900',
                fontSize: '0.85rem',
                letterSpacing: '1px',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(43,255,136,0.25)'
              }}>
              LAUNCH HUD
            </button>
          </div>
        </div>

        {/* 📡 Live System Telemetry Logs Feed (New CTO component to look alive) */}
        <div className="cyber-hud-card" style={{
          background: '#070b13',
          border: '1px solid rgba(0,200,255,0.2)',
          borderRadius: '16px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          fontFamily: 'monospace'
        }}>
          <div className="flex-row justify-between" style={{ marginBottom: '10px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} color="#00C8FF" className="pulse-fast" />
              <span style={{ color: '#00C8FF', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px' }}>LIVE TELEMETRY TICKER</span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>SYNC: ONLINE</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '100px', overflowY: 'hidden' }}>
            {systemLogs.map((log, idx) => (
              <div key={idx} style={{ fontSize: '0.72rem', color: idx === 0 ? 'var(--accent-green)' : 'rgba(255,255,255,0.55)', transition: 'all 0.3s' }}>
                &gt; {log}
              </div>
            ))}
          </div>
        </div>

        {/* Gate Status Card */}
        <div className="cyber-hud-card" style={{
          background: 'linear-gradient(135deg, #111827, #0b0f19)',
          borderRadius: '16px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          border: routeGate === 'GATE C' ? '1px solid rgba(255,75,75,0.25)' : '1px solid rgba(43,255,136,0.2)'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            background: routeGate === 'GATE C' ? 'rgba(255, 75, 75, 0.15)' : 'rgba(43,255,136,0.12)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {routeGate === 'GATE C' ? <AlertTriangle color="#FF4B4B" size={22} className="pulse-fast" /> : <CheckCircle2 color="var(--accent-green)" size={22} />}
          </div>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px', fontFamily: 'monospace' }}>GATE B CAPACITY INDEX</span>
            <div style={{ color: '#fff', fontSize: '1rem', fontWeight: '600', marginTop: '2px' }}>
              {routeGate === 'GATE C' ? (
                <span style={{ color: '#FF4B4B' }}>SPIKE: Severe Overload (15m delay)</span>
              ) : (
                <span style={{ color: 'var(--accent-green)' }}>CLEAR: Optimal Flow (2m delay)</span>
              )}
            </div>
          </div>
        </div>

        {/* System Modules Grid */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="section-label" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', letterSpacing: '2px', fontSize: '0.75rem', marginBottom: '10px' }}>SYSTEM CHANNELS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            {[
              { icon: Users, label: 'Crowd AI', path: '/crowd', color: '#B48EFF', bg: 'rgba(180,142,255,0.06)', border: 'rgba(180,142,255,0.15)' },
              { icon: ShieldCheck, label: 'Staff Hub', path: '/staff', color: '#FFDE59', bg: 'rgba(255,222,89,0.06)', border: 'rgba(255,222,89,0.15)' },
              { icon: AccessibilityIcon, label: 'Accessibility', path: '/access', color: '#00C8FF', bg: 'rgba(0,200,255,0.06)', border: 'rgba(0,200,255,0.15)' },
            ].map(mod => {
              const Icon = mod.icon;
              return (
                <div 
                  key={mod.label} 
                  onClick={() => navigate(mod.path)} 
                  className="cyber-grid-btn"
                  style={{
                    background: mod.bg,
                    border: `1px solid ${mod.border}`,
                    borderRadius: '14px',
                    padding: '1.2rem 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}>
                  <Icon size={24} color={mod.color} />
                  <span style={{ fontWeight: '700', fontSize: '0.8rem', color: '#fff' }}>{mod.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Heatmap Card */}
        <div className="cyber-hud-card" style={{ background: 'linear-gradient(135deg, #111625, #080b12)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="flex-row justify-between" style={{ alignItems: 'center', marginBottom: '1.25rem' }}>
            <div className="flex-row gap-3" style={{ alignItems: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '10px' }}>
                <Users color="#fff" size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>Thermal Crowd Density</h3>
                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>CCTV INTELLIGENCE GRIDS</span>
              </div>
            </div>
            <span className="telemetry-live-tag">LIVE STREAMS</span>
          </div>

          <div style={{ position: 'relative', height: '170px', borderRadius: '14px', overflow: 'hidden', marginBottom: '1.25rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            <img src="/images/stadium_heatmap.png" alt="Crowd Heatmap" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
            
            {/* Scanner line animation overlay */}
            <div className="lidar-scanline"></div>

            {/* Overlay Labels */}
            <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(10,13,20,0.9)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
               <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.62rem', fontWeight: 'bold', marginBottom: '2px', fontFamily: 'monospace' }}>ZONE A: CONCOURSE</div>
               <div style={{ color: '#FF4B4B', fontSize: '0.85rem', fontWeight: '900', fontFamily: 'monospace' }}>CROWDED (92%)</div>
            </div>
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(10,13,20,0.9)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
               <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.62rem', fontWeight: 'bold', marginBottom: '2px', fontFamily: 'monospace' }}>ZONE B: ENTRANCE</div>
               <div style={{ color: routeGate === 'GATE C' ? '#FF4B4B' : 'var(--accent-green)', fontSize: '0.85rem', fontWeight: '900', fontFamily: 'monospace', transition: 'all 0.5s' }}>
                 {routeGate === 'GATE C' ? 'ALERT (85%)' : 'CLEAR (14%)'}
               </div>
            </div>
          </div>

          <div className="flex-row gap-3">
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.5s' }}>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', fontWeight: 'bold', marginBottom: '4px', fontFamily: 'monospace' }}>GATE B LOAD</div>
              <div style={{ color: routeGate === 'GATE C' ? '#FF4B4B' : 'var(--accent-green)', fontSize: '0.95rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                {routeGate === 'GATE C' ? 'CRITICAL' : 'OPTIMAL'}
              </div>
            </div>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', fontWeight: 'bold', marginBottom: '4px', fontFamily: 'monospace' }}>CONCESSION 12</div>
              <div style={{ color: 'var(--accent-yellow)', fontSize: '0.95rem', fontWeight: 'bold', fontFamily: 'monospace' }}>MODERATE</div>
            </div>
          </div>
        </div>

        {/* Smart Transportation Card */}
        <div className="cyber-hud-card" style={{ background: 'linear-gradient(135deg, #0a1120, #060b14)', border: '1px solid rgba(0, 200, 255, 0.25)', borderRadius: '20px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="flex-row justify-between" style={{ marginBottom: '1.25rem', alignItems: 'center' }}>
            <div className="flex-row gap-3" style={{ alignItems: 'center' }}>
              <div style={{ background: 'rgba(0, 200, 255, 0.1)', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C8FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v16"/><path d="M8 19v2"/><path d="M16 19v2"/></svg>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>Transit Dispatch</h3>
                <span style={{ fontSize: '0.65rem', color: '#00C8FF', fontFamily: 'monospace' }}>METROPOLITAN MOBILITY ROUTING</span>
              </div>
            </div>
            <span style={{ color: '#00C8FF', fontWeight: 'bold', fontSize: '0.65rem', letterSpacing: '1.5px', fontFamily: 'monospace' }}>AI RECOMMENDED</span>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.82)', margin: '0 0 1.25rem 0', lineHeight: '1.55' }}>
            "Taxi & Careem loops are heavily congested (35m delay). Proceed to <strong>Lusail Metro (Red Line)</strong> — high frequency trains active with zero queues."
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'rgba(0, 200, 255, 0.04)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(0, 200, 255, 0.15)' }}>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', marginBottom: '2px' }}>LUSAIL METRO</div>
              <div style={{ fontSize: '0.95rem', color: 'var(--accent-green)', fontWeight: 'bold', fontFamily: 'monospace' }}>2m Wait (Clear)</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', marginBottom: '2px' }}>SHUTTLE BUS D</div>
              <div style={{ fontSize: '0.95rem', color: 'var(--accent-yellow)', fontWeight: 'bold', fontFamily: 'monospace' }}>8m Wait (Normal)</div>
            </div>
          </div>
          <button 
            onClick={consultTransitAdvisor} 
            disabled={transitLoading}
            style={{
              width: '100%',
              marginTop: '15px',
              background: 'rgba(0, 200, 255, 0.1)',
              border: '1px solid rgba(0, 200, 255, 0.3)',
              color: '#00C8FF',
              padding: '10px',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {transitLoading ? 'Analyzing Options...' : '🤖 Consult GenAI Transit Advisor'}
          </button>
          {transitAdvisorText && (
            <div style={{
              marginTop: '12px',
              background: 'rgba(0, 200, 255, 0.05)',
              border: '1px solid rgba(0, 200, 255, 0.15)',
              padding: '12px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              color: '#fff',
              lineHeight: '1.4',
              fontFamily: 'monospace'
            }}>
              {transitAdvisorText}
            </div>
          )}
        </div>

      </div>



      {/* Live HUD Navigation Screen Overlay */}
      {isLiveNavigating && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: '#030712', display: 'flex', flexDirection: 'column' }}>
          
          {/* Turn-by-Turn Header */}
          <div style={{ background: 'var(--accent-green)', padding: '2rem 1.5rem 1.5rem 1.5rem', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 10px 30px rgba(43,255,136,0.3)', zIndex: 2010 }}>
            <div style={{ width: '52px', height: '52px', background: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(0,0,0,0.5)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M12 5L5 12M12 5l7 7"/></svg>
            </div>
            <div>
              <h2 style={{ color: '#000', margin: 0, fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.5px' }}>Head Straight</h2>
              <p style={{ color: 'rgba(0,0,0,0.7)', margin: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>Proceed for 50 meters, then turn left.</p>
            </div>
          </div>

          {/* Full Screen Live Map */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <img src="/images/stadium_isometric.png" alt="Live Map" style={{ position: 'absolute', width: '150%', height: '150%', objectFit: 'cover', top: '-25%', left: '-25%', filter: 'brightness(0.55) contrast(1.1) hue-rotate(180deg)' }} />
            
            {/* HUD Scanline */}
            <div className="hud-scanner-overlay"></div>

            {/* Pulsing Animated HUD Path */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
              <path 
                d="M100,900 L400,600 L600,600 L900,300" 
                fill="none" 
                stroke="var(--accent-yellow)" 
                strokeWidth="14" 
                strokeDasharray="25, 20" 
                style={{ animation: 'dash 1.5s linear infinite', filter: 'drop-shadow(0 0 15px var(--accent-yellow))' }} 
              />
              <circle cx="100" cy="900" r="22" fill="var(--accent-yellow)" style={{ animation: 'pulse 1s infinite' }} />
              <circle cx="900" cy="300" r="25" fill="#000" stroke="var(--accent-yellow)" strokeWidth="8" />
            </svg>

            {/* User Indicator dot */}
            <div style={{ position: 'absolute', top: '70%', left: '30%', width: '32px', height: '32px', background: '#00C8FF', borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 0 25px #00C8FF', zIndex: 2, transform: 'translate(-50%, -50%)' }}>
              <div style={{ position: 'absolute', inset: '-24px', borderRadius: '50%', border: '2px solid #00C8FF', animation: 'pulse 2s infinite' }}></div>
            </div>
          </div>

          {/* Bottom HUD readout panel */}
          <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '2rem 1.5rem', background: 'linear-gradient(transparent, #030712 40%)', zIndex: 2010 }}>
            <div className="flex-row justify-between" style={{ background: 'rgba(10,17,32,0.95)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(15px)', padding: '1.25rem', borderRadius: '20px', alignItems: 'center', boxShadow: '0 15px 40px rgba(0,0,0,0.6)' }}>
              <div className="flex-col">
                <span style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--accent-yellow)', fontFamily: 'monospace' }}>4 MIN</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'monospace' }}>340M • TARGET: {routeGate}</span>
              </div>
              <button 
                onClick={() => setIsLiveNavigating(false)}
                className="exit-hud-btn"
                style={{
                  background: '#FF4B4B',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 28px',
                  borderRadius: '24px',
                  fontWeight: '900',
                  fontSize: '0.95rem',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  boxShadow: '0 5px 15px rgba(255,75,75,0.3)'
                }}>
                ABORT HUD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS HUD rules */}
      <style>{`
        /* Scanline animations */
        .lidar-scanline {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 10px;
          background: linear-gradient(180deg, transparent, rgba(43,255,136,0.35), transparent);
          animation: scan 4s linear infinite;
          pointer-events: none;
          z-index: 10;
        }

        .hud-scanner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 4px, 6px 100%;
          pointer-events: none;
        }

        /* Countdown layouts */
        .countdown-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        
        .countdown-time {
          font-size: 2.5rem;
          font-weight: 900;
          line-height: 1;
          color: #fff;
          font-family: monospace;
          text-shadow: 0 0 10px rgba(255,255,255,0.1);
        }

        .countdown-time-active {
          font-size: 2.5rem;
          font-weight: 900;
          line-height: 1;
          color: var(--accent-yellow);
          font-family: monospace;
          text-shadow: 0 0 20px rgba(255,222,89,0.5);
          animation: heartBeat 1s infinite;
        }

        .countdown-label {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.45);
          letter-spacing: 2px;
          font-weight: bold;
          font-family: monospace;
        }

        .countdown-separator {
          font-size: 2.2rem;
          font-weight: 900;
          color: rgba(255,255,255,0.25);
          line-height: 1;
          margin-top: -12px;
          animation: pulse 1s infinite;
        }

        /* Card custom structures */
        .cyber-hud-card {
          position: relative;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
          backdrop-filter: blur(12px);
        }

        .tech-corner-top-right {
          position: absolute;
          top: -1px;
          right: -1px;
          width: 15px;
          height: 15px;
          border-top: 2px solid var(--accent-yellow);
          border-right: 2px solid var(--accent-yellow);
        }

        .live-badge {
          background: #FF1E1E;
          color: #fff;
          font-size: 0.6rem;
          font-weight: 900;
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 1px;
          box-shadow: 0 0 10px rgba(255,30,30,0.5);
          font-family: monospace;
        }

        .neon-status-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(43,255,136,0.15);
          color: var(--accent-green);
          font-size: 0.65rem;
          padding: 4px 10px;
          border-radius: 12px;
          font-weight: bold;
          letter-spacing: 1px;
          border: 1px solid rgba(43,255,136,0.3);
          font-family: monospace;
        }

        .telemetry-live-tag {
          color: var(--accent-green);
          font-weight: 900;
          font-size: 0.65rem;
          letter-spacing: 1.5px;
          font-family: monospace;
          background: rgba(43,255,136,0.08);
          padding: 3px 8px;
          border-radius: 6px;
          border: 1px solid rgba(43,255,136,0.2);
        }

        .telemetry-ping {
          width: 8px;
          height: 8px;
          background: var(--accent-green);
          border-radius: 50%;
          box-shadow: 0 0 12px var(--accent-green);
          animation: pulse 1s infinite;
        }

        .hologram-overlay-card {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(10,13,20,0.85);
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(5px);
        }

        /* Animations */
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }

        @keyframes heartBeat {
          0% { transform: scale(1); }
          14% { transform: scale(1.02); }
          28% { transform: scale(1); }
          42% { transform: scale(1.02); }
          70% { transform: scale(1); }
        }

        @keyframes slideDown {
          from { top: -100px; opacity: 0; }
          to { top: 20px; opacity: 1; }
        }

        @keyframes dash {
          to { stroke-dashoffset: -45; }
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.35; }
          100% { opacity: 1; }
        }

        .pulse-fast {
          animation: pulse 0.75s infinite;
        }
        
        .pulse-slow {
          animation: pulse 2s infinite;
        }

        .pulse-neon-green {
          animation: neonPulseGreen 1.5s infinite alternate;
        }

        @keyframes neonPulseGreen {
          from {
            filter: drop-shadow(0 0 1px var(--accent-green));
          }
          to {
            filter: drop-shadow(0 0 6px var(--accent-green));
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
