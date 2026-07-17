import React, { useState, useEffect } from 'react';
import { Navigation, Users, Bot, CheckCircle2, Timer, AlertTriangle, Target, ShieldCheck, Accessibility as AccessibilityIcon, Cpu, CloudRain, Activity, Thermometer, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMatchTimer } from '../hooks/useMatchTimer';
import CrowdLidarSimulator from '../components/CrowdLidarSimulator';
import DigitalTwinView from '../components/DigitalTwinView';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLiveNavigating, setIsLiveNavigating] = useState(false);
  
  // Dynamic Rerouting State
  const [routeGate, setRouteGate] = useState('GATE B');
  const [notification, setNotification] = useState(null);
  const [transitAdvisorText, setTransitAdvisorText] = useState('');
  const [transitLoading, setTransitLoading] = useState(false);
  const [activeSimulationPreset, setActiveSimulationPreset] = useState('Standard');
  const [arOverlay, setArOverlay] = useState(false);

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
    "SYS_INIT: VenueMind Core Kernel v1.3.0 loaded (Type /help)",
    "NETWORK: Encrypted connection to Lusail Grid established",
    "CROWD_TELEMETRY: Gate B capacity stable at 45/min"
  ]);
  const [terminalCommand, setTerminalCommand] = useState('');

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const cmd = terminalCommand.trim();
    if (!cmd) return;

    setSystemLogs(prev => [`$ ${cmd}`, ...prev]);
    setTerminalCommand('');

    setTimeout(() => {
      const lower = cmd.toLowerCase();
      let response = `ERR: Command "${cmd}" not recognized. Type "/help" for protocols.`;
      
      if (lower === '/help') {
        response = "PROTOCOLS: /status, /evacuate, /optimize, /clear";
      } else if (lower === '/status') {
        response = `STATUS: Core Active. Uptime: 98.4%. Active Gate: ${routeGate}. Preset: ${activeSimulationPreset}.`;
      } else if (lower === '/evacuate') {
        response = "ALERT: Evacuation path calculation initiated.";
        simulateReroute();
      } else if (lower === '/optimize') {
        response = "OPT: Reallocating. Security: +12, Water: Nominal.";
      } else if (lower === '/clear') {
        setSystemLogs([]);
        return;
      }
      setSystemLogs(prev => [response, ...prev]);
    }, 300);
  };

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
    <div style={{ padding: '0', paddingBottom: '120px', zIndex: 1, position: 'relative', background: 'transparent', minHeight: '100vh', color: 'var(--text-primary)' }}>
      
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
        background: 'var(--bg-secondary)',
        padding: '10px 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-glass)',
        position: 'sticky',
        top: '60px',
        zIndex: 90
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={14} style={{ color: 'var(--accent-green)' }} />
          <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.75rem' }}>Operations Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: '500' }}>System Health: 98.4%</span>
        </div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        
        {/* Futuristic Dashboard Header */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span className="live-badge">LIVE</span>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '2px', margin: 0 }}>Lusail Stadium • Match Day 14</p>
            </div>
            <h1 style={{ fontSize: '2rem', margin: '0', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              VenueMind AI <span style={{ color: 'var(--accent-yellow)' }}>Portal</span>
            </h1>
          </div>
          <button 
            onClick={simulateReroute} 
            title="Simulate AI Flow Adjustment"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-glass)',
              padding: '10px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}>
            <Target size={18} color="var(--accent-yellow)" />
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
                background: activeSimulationPreset === preset.id ? 'var(--text-primary)' : 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-glass)',
                color: activeSimulationPreset === preset.id ? '#000000' : 'var(--text-secondary)',
                borderRadius: '9999px',
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <DigitalTwinView />

        {/* ⏱️ Match Kickoff Countdown HUD Card */}
        <div className="glass-card" style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '1.25rem'
        }}>
          <div className="flex-row justify-between" style={{ marginBottom: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Timer size={15} color="var(--accent-yellow)" />
              <span style={{ color: 'var(--accent-yellow)', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '1px' }}>Kickoff Countdown</span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>UTC+3</span>
          </div>

          <div className="flex-row gap-4" style={{ alignItems: 'center', justifyContent: 'center', marginTop: '0.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>{timerValues.hrs}</div>
              <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>HRS</span>
            </div>
            <div style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.2)', marginTop: '-15px' }}>:</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>{timerValues.mins}</div>
              <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>MIN</span>
            </div>
            <div style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.2)', marginTop: '-15px' }}>:</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-yellow)' }}>{timerValues.secs}</div>
              <span style={{ fontSize: '0.6rem', color: 'var(--accent-yellow)', fontWeight: 'bold' }}>SEC</span>
            </div>
          </div>
        </div>

        {/* 🌡️ Live Weather & Heat Alert HUD (Extreme Heat mitigation design) */}
        <div className="glass-card" style={{
          padding: '1.5rem',
          marginBottom: '1.25rem'
        }}>
          <div className="flex-row justify-between" style={{ marginBottom: '1.25rem', alignItems: 'center' }}>
            <div className="flex-row gap-3" style={{ alignItems: 'center' }}>
              <div style={{ width: '36px', height: '36px', background: 'rgba(255, 107, 53, 0.08)', border: '1px solid rgba(255, 107, 53, 0.12)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Thermometer size={18} color="#FF6B35" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>Atmosphere Metric</h3>
                <span style={{ fontSize: '0.62rem', color: '#FF6B35' }}>Climate Control Active</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#FF6B35', lineHeight: '1' }}>39°C</div>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>OUTDOOR AIR</span>
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
                  <div style={{ fontSize: '0.95rem', fontWeight: '900', color: w.color }}>{w.value}</div>
                </div>
              );
            })}
          </div>

          <div style={{
            background: 'rgba(255, 107, 53, 0.03)',
            borderRadius: '8px',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            border: '1px solid rgba(255,107,53,0.1)'
          }}>
            <span style={{ fontSize: '1.1rem', marginTop: '-2px' }}>💧</span>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
              <strong style={{ color: '#FF6B35' }}>HYDRATION ALERT:</strong> Extreme climate matrix detected. Rehydration mandatory every 20 minutes. Shaded zones deployed at Gates A & D.
            </p>
          </div>
        </div>

        {/* 🤖 Ask VenuMind AI Card Link */}
        <div 
          onClick={() => navigate('/concierge')}
          className="glass-card" 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            cursor: 'pointer',
            transition: 'background 0.2s, border-color 0.2s',
          }}
        >
          <div className="flex-row gap-4" style={{ alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--accent-blue-dim)', border: '1px solid rgba(59, 130, 246, 0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot color="var(--accent-blue)" size={20} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-primary)' }}>Ask VenuMind AI</h4>
              <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Ask about specific nodes or traffic spikes</p>
            </div>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>➜</span>
        </div>

        {/* 🗺️ Interactive Holographic Navigation Card */}
        <div className="glass-card" style={{
          marginBottom: '1.25rem'
        }}>

          <div className="flex-row justify-between" style={{ marginBottom: '1.25rem', alignItems: 'center' }}>
            <div className="flex-row gap-3" style={{ alignItems: 'center' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.12)', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Navigation color="var(--accent-green)" size={16} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>Holographic Routing</h3>
                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Smart Navigation</span>
              </div>
            </div>
            <button
              onClick={() => setArOverlay(p => !p)}
              style={{
                background: arOverlay ? 'rgba(0,200,255,0.2)' : 'rgba(255,255,255,0.05)',
                border: arOverlay ? '1px solid #00C8FF' : '1px solid rgba(255,255,255,0.15)',
                color: arOverlay ? '#00C8FF' : 'var(--text-secondary)',
                fontSize: '0.65rem',
                fontWeight: 'bold',
                padding: '4px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.65rem',
              }}
            >
              📶 5G AR HUD: {arOverlay ? 'ON' : 'OFF'}
            </button>
          </div>
          
          {/* Hologram visual simulation */}
          <div className="hologram-container" style={{ position: 'relative', height: '190px', borderRadius: '14px', overflow: 'hidden', marginBottom: '1.25rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            <CrowdLidarSimulator routeGate={routeGate} />

            {arOverlay && (
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                right: '10px',
                background: 'rgba(5,10,20,0.85)',
                border: '1px solid #00C8FF',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '0.7rem',
                color: 'var(--text-primary)',
                fontSize: '0.7rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                pointerEvents: 'none',
                zIndex: 10
              }}>
                <div style={{ fontWeight: 'bold', color: '#00C8FF', fontSize: '0.6rem', letterSpacing: '1px' }}>5G AR HUD OVERLAY</div>
                <div>🏃 K. Mbappé: 36.8 km/h | Pass: 92%</div>
                <div>🛡️ V. van Dijk: 32.4 km/h | Tackles: 4/4</div>
              </div>
            )}
            
            <div className="hologram-overlay-card" style={{ pointerEvents: 'none' }}>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: 'bold', marginBottom: '2px' }}>TARGET DEPT</div>
              <div style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--accent-green)' }}>{routeGate}</div>
            </div>
          </div>

          <div className="flex-row justify-between" style={{ alignItems: 'center' }}>
            <div className="flex-col">
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px' }}>EST. TRAVEL TIME</span>
              <span style={{ color: 'var(--accent-green)', fontSize: '1.3rem', fontWeight: '900', lineHeight: '1.2' }}>
                {routeGate === 'GATE C' ? '7 MIN' : '8 MIN'}<br/>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>TO SECTOR 204</span>
              </span>
            </div>
            <button 
              onClick={() => setIsLiveNavigating(true)}
              className="btn-primary"
              style={{
                padding: '10px 18px',
                fontSize: '0.82rem'
              }}>
              LAUNCH HUD
            </button>
          </div>
        </div>

        {/* 📡 Live System Telemetry Logs Feed (New CTO component to look alive) */}
        <div className="glass-card" style={{
          marginBottom: '1.25rem'
        }}>
          <div className="flex-row justify-between" style={{ marginBottom: '10px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} color="#00C8FF" className="pulse-fast" />
              <span style={{ color: '#00C8FF', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px' }}>Activity Feed</span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>SYNC: ONLINE</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '100px', overflowY: 'auto', marginBottom: '10px' }}>
            {systemLogs.map((log, idx) => (
              <div key={idx} style={{ fontSize: '0.72rem', color: idx === 0 ? 'var(--accent-green)' : 'rgba(255,255,255,0.55)', transition: 'all 0.3s' }}>
                {log.startsWith('$') ? log : `> ${log}`}
              </div>
            ))}
          </div>
          <form onSubmit={handleTerminalSubmit} style={{ display: 'flex', gap: '6px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
            <span style={{ color: 'var(--accent-green)', fontSize: '0.75rem' }}>$</span>
            <input
              type="text"
              placeholder="Enter console command (e.g. /status)..."
              value={terminalCommand}
              onChange={(e) => setTerminalCommand(e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--accent-green)', outline: 'none', fontSize: '0.72rem', fontFamily: 'monospace' }}
            />
          </form>
        </div>

        {/* Gate Status Card */}
        <div className="glass-card" style={{
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: routeGate === 'GATE C' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
            border: routeGate === 'GATE C' ? '1px solid rgba(239, 68, 68, 0.12)' : '1px solid rgba(16, 185, 129, 0.12)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {routeGate === 'GATE C' ? <AlertTriangle color="#ef4444" size={18} /> : <CheckCircle2 color="var(--accent-green)" size={18} />}
          </div>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px' }}>Gate B Status</span>
            <div style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '600', marginTop: '2px' }}>
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
          <div className="section-label" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', fontSize: '0.75rem', marginBottom: '10px' }}>Quick Access</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            {[
              { icon: Users, label: 'Crowd AI', path: '/crowd', color: 'var(--accent-purple)', bg: 'rgba(139, 92, 246, 0.03)', border: 'rgba(139, 92, 246, 0.08)' },
              { icon: ShieldCheck, label: 'Staff Hub', path: '/staff', color: 'var(--accent-yellow)', bg: 'rgba(245, 158, 11, 0.03)', border: 'rgba(245, 158, 11, 0.08)' },
              { icon: AccessibilityIcon, label: 'Accessibility', path: '/access', color: 'var(--accent-blue)', bg: 'rgba(59, 130, 246, 0.03)', border: 'rgba(59, 130, 246, 0.08)' },
            ].map(mod => {
              const Icon = mod.icon;
              return (
                <div 
                  key={mod.label} 
                  onClick={() => navigate(mod.path)} 
                  style={{
                    background: mod.bg,
                    border: `1px solid ${mod.border}`,
                    borderRadius: '10px',
                    padding: '1rem 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}>
                  <Icon size={20} color={mod.color} />
                  <span style={{ fontWeight: '600', fontSize: '0.78rem', color: 'var(--text-primary)' }}>{mod.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Heatmap Card */}
        <div className="glass-card" style={{ marginBottom: '1.25rem' }}>
          <div className="flex-row justify-between" style={{ alignItems: 'center', marginBottom: '1.25rem' }}>
            <div className="flex-row gap-3" style={{ alignItems: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', padding: '8px', borderRadius: '8px' }}>
                <Users color="#fff" size={16} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>Thermal Crowd Density</h3>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>Real-time Density</span>
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
               <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.62rem', fontWeight: 'bold', marginBottom: '2px' }}>Zone A: Concourse</div>
               <div style={{ color: '#FF4B4B', fontSize: '0.85rem', fontWeight: '900' }}>Crowded (92%)</div>
            </div>
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(10,13,20,0.9)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
               <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.62rem', fontWeight: 'bold', marginBottom: '2px' }}>Zone B: Entrance</div>
               <div style={{ color: routeGate === 'GATE C' ? '#FF4B4B' : 'var(--accent-green)', fontSize: '0.85rem', fontWeight: '900', transition: 'all 0.5s' }}>
                 {routeGate === 'GATE C' ? 'ALERT (85%)' : 'CLEAR (14%)'}
               </div>
            </div>
          </div>

          <div className="flex-row gap-3">
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.5s' }}>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', fontWeight: 'bold', marginBottom: '4px' }}>GATE B LOAD</div>
              <div style={{ color: routeGate === 'GATE C' ? '#FF4B4B' : 'var(--accent-green)', fontSize: '0.95rem', fontWeight: 'bold' }}>
                {routeGate === 'GATE C' ? 'CRITICAL' : 'OPTIMAL'}
              </div>
            </div>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', fontWeight: 'bold', marginBottom: '4px' }}>CONCESSION 12</div>
              <div style={{ color: 'var(--accent-yellow)', fontSize: '0.95rem', fontWeight: 'bold' }}>MODERATE</div>
            </div>
          </div>
        </div>

        {/* Smart Transportation Card */}
        <div className="glass-card" style={{ marginBottom: '1.25rem' }}>
          <div className="flex-row justify-between" style={{ marginBottom: '1rem', alignItems: 'center' }}>
            <div className="flex-row gap-3" style={{ alignItems: 'center' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.12)', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v16"/><path d="M8 19v2"/><path d="M16 19v2"/></svg>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>Transit Dispatch</h3>
                <span style={{ fontSize: '0.62rem', color: 'var(--accent-blue)' }}>Smart Transit</span>
              </div>
            </div>
            <span style={{ color: 'var(--accent-blue)', fontWeight: '600', fontSize: '0.65rem' }}>Recommended</span>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.82)', margin: '0 0 1.25rem 0', lineHeight: '1.55' }}>
            "Taxi & Careem loops are heavily congested (35m delay). Proceed to <strong>Lusail Metro (Red Line)</strong> — high frequency trains active with zero queues."
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'rgba(0, 200, 255, 0.04)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(0, 200, 255, 0.15)' }}>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>LUSAIL METRO</div>
              <div style={{ fontSize: '0.95rem', color: 'var(--accent-green)', fontWeight: 'bold' }}>2m Wait (Clear)</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>SHUTTLE BUS D</div>
              <div style={{ fontSize: '0.95rem', color: 'var(--accent-yellow)', fontWeight: 'bold' }}>8m Wait (Normal)</div>
            </div>
          </div>
          <button 
            onClick={consultTransitAdvisor} 
            disabled={transitLoading}
            className="btn-ghost"
            style={{
              width: '100%',
              marginTop: '15px',
              padding: '10px',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
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
              color: 'var(--text-primary)',
              lineHeight: '1.4'
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
                <span style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--accent-yellow)' }}>4 MIN</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 'bold' }}>340M • TARGET: {routeGate}</span>
              </div>
              <button 
                onClick={() => setIsLiveNavigating(false)}
                className="exit-hud-btn"
                style={{
                  background: '#FF4B4B',
                  color: 'var(--text-primary)',
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
          text-shadow: 0 0 10px rgba(255,255,255,0.1);
        }

        .countdown-time-active {
          font-size: 2.5rem;
          font-weight: 900;
          line-height: 1;
          color: var(--accent-yellow);
          text-shadow: 0 0 20px rgba(255,222,89,0.5);
          animation: heartBeat 1s infinite;
        }

        .countdown-label {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.45);
          letter-spacing: 2px;
          font-weight: bold;
        }

        .countdown-separator {
          font-size: 2.2rem;
          font-weight: 900;
          color: rgba(255,255,255,0.25);
          line-height: 1;
          margin-top: -12px;
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
          background: rgba(0,255,178,0.1);
          color: var(--accent-green);
          font-size: 0.6rem;
          font-weight: 900;
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 1px;
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
        }

        .telemetry-live-tag {
          color: var(--accent-green);
          font-weight: 900;
          font-size: 0.65rem;
          letter-spacing: 1.5px;
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
