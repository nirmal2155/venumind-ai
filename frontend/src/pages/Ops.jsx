import React, { useState, useEffect } from 'react';
import { Activity, Eye, Radio, Server, CheckCircle2, AlertOctagon, Terminal, Leaf, Sun, Thermometer, Wind } from 'lucide-react';
import { useEmergency } from '../EmergencyContext';

const NEW_LOGS = [
  "[VISION] Facial match: VIP Guest at Lounge A",
  "[ALERT] Unregistered frequency detected in Sector 2",
  "[CROWD] Density spike predicted at Food Court in 10m",
  "[SYSTEM] Real-time map optimization running"
];

const DIAGNOSTIC_STEPS = [
  { delay: 1000, log: "[DIAG] Scanning Security Drone network... [OK]" },
  { delay: 2000, log: "[DIAG] Checking CCTV Vision recognition... [1,400 Units - ACTIVE]" },
  { delay: 3000, log: "[DIAG] Measuring Wi-Fi load distribution... [14ms latency - STABLE]" },
  { delay: 4000, log: "[DIAG] Checking Solar Grid power harvest... [87% efficiency - OPTIMAL]" },
  { delay: 5000, log: "[DIAG] Analyzing AI core parameters... [99.8% health - ALL SYSTEMS NOMINAL]" }
];

const Ops = () => {
  const [logs, setLogs] = useState([
    "[SYSTEM] VenueMind AI initialized",
    "[SECURITY] Drone 04 perimeter scan complete",
    "[HVAC] Sector 3 temperature normalized",
    "[CROWD] Flow rate at Gate B stable at 45/min"
  ]);

  const [aiActionText, setAiActionText] = useState('AUTHORIZE AI DISPATCH');
  const [isResolved, setIsResolved] = useState(false);
  const [broadcastText, setBroadcastText] = useState('');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  
  const { setEmergency, setBroadcastMessage } = useEmergency();

  useEffect(() => {
    if (isDiagnosing) return; // Pause auto logs during diagnostics
    let i = 0;
    const interval = setInterval(() => {
      setLogs(prev => [NEW_LOGS[i], ...prev.slice(0, 4)]);
      i++;
      if (i >= NEW_LOGS.length) i = 0;
    }, 4000);
    return () => clearInterval(interval);
  }, [isDiagnosing]);

  const handleAiResponse = () => {
    setAiActionText('AI Overriding Systems...');
    setTimeout(() => {
      setAiActionText('Threat Neutralized ✅');
      setIsResolved(true);
    }, 2000);
  };

  const runDiagnostics = () => {
    if (isDiagnosing) return;
    setIsDiagnosing(true);
    setLogs(["[DIAGNOSTICS] Starting Automated Node Scan..."]);

    DIAGNOSTIC_STEPS.forEach(step => {
      setTimeout(() => {
        setLogs(prev => [step.log, ...prev]);
        if (step.delay === 5000) {
          setIsDiagnosing(false);
        }
      }, step.delay);
    });
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    setBroadcastMessage(broadcastText);
    setBroadcastText('');
    setShowBroadcastModal(false);
  };

  return (
    <div className="flex-col" style={{ padding: '1rem', paddingBottom: '130px', zIndex: 1, position: 'relative' }}>
      
      {/* Global Status Header */}
      <div className="flex-row justify-between" style={{ alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(0, 200, 255, 0.2)', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', margin: 0, fontWeight: '800', color: '#00C8FF', letterSpacing: '2px', textTransform: 'uppercase' }}>Command Node</h2>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: 'monospace' }}>SECURE ENCRYPTED CHANNEL</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)', animation: 'pulse 1.5s infinite' }}></div>
            <span style={{ color: 'var(--accent-green)', fontWeight: 'bold', fontSize: '0.8rem', fontFamily: 'monospace' }}>SYSTEM ONLINE</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontFamily: 'monospace' }}>PING: 14ms</span>
        </div>
      </div>

      {/* EMERGENCY TRIGGER */}
      <button 
        onClick={() => setEmergency(true)}
        style={{ width: '100%', background: '#FF1E1E', border: 'none', color: '#FFF', padding: '1rem', borderRadius: '12px', fontWeight: '900', fontSize: '1.1rem', letterSpacing: '2px', cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 30px rgba(255,30,30,0.4)' }}>
        <AlertOctagon size={24} /> TRIGGER EMERGENCY EVACUATION
      </button>

      {/* AI Heatmap & Surveillance */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="flex-row justify-between" style={{ marginBottom: '0.5rem', alignItems: 'center' }}>
          <h3 style={{ fontSize: '0.85rem', letterSpacing: '2px', color: 'var(--accent-yellow)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Eye size={16} /> LIVE HEATMAP
          </h3>
          <span style={{ fontSize: '0.7rem', color: '#fff', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>SECTOR ALL</span>
        </div>
        
        <div style={{ 
          height: '200px', 
          background: '#000', 
          borderRadius: '16px', 
          border: '1px solid rgba(255, 222, 89, 0.3)', 
          position: 'relative', 
          overflow: 'hidden',
          boxShadow: '0 0 30px rgba(255, 222, 89, 0.1)'
        }}>
          {/* Base Heatmap Image */}
          <img src="/images/stadium_heatmap.png" alt="Heatmap" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
          
          {/* Radar Scan Animation */}
          <div style={{ position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(0, 200, 255, 0.4), transparent)', animation: 'scanLine 3s linear infinite' }}></div>
          
          {/* AI Bounding Boxes */}
          <div style={{ position: 'absolute', top: '30%', left: '40%', width: '40px', height: '40px', border: '2px solid #FF4B4B', borderRadius: '4px', animation: 'pulse 2s infinite' }}>
             <span style={{ position: 'absolute', top: '-18px', left: '-2px', background: '#FF4B4B', color: '#fff', fontSize: '0.5rem', padding: '2px 4px', fontWeight: 'bold' }}>ANOMALY</span>
          </div>
          <div style={{ position: 'absolute', top: '60%', right: '25%', width: '60px', height: '30px', border: '1px solid var(--accent-green)', borderRadius: '4px' }}>
             <span style={{ position: 'absolute', top: '-15px', right: 0, color: 'var(--accent-green)', fontSize: '0.5rem', fontWeight: 'bold' }}>VIP ESCORT</span>
          </div>
          
          {/* Grid Overlay */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none', mixBlendMode: 'overlay' }}></div>
        </div>
      </div>

      {/* Sustainability & Smart Grid Panel */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', letterSpacing: '2px', color: 'var(--accent-green)', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Leaf size={16} /> ECO INTELLIGENCE & SUSTAINABILITY
        </h3>
        <div style={{ background: 'rgba(43,255,136,0.03)', border: '1px solid rgba(43,255,136,0.15)', borderRadius: '16px', padding: '1.25rem' }}>
          <div className="flex-row justify-between" style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: '600' }}>AI Sustainability Grid</span>
            <span style={{ background: 'var(--accent-green-dim)', color: 'var(--accent-green)', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>ECO ACTIVE</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sun size={20} color="var(--accent-yellow)" />
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Solar Grid harvest</div>
                <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 'bold' }}>87% Efficiency</div>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Thermometer size={20} color="#00C8FF" />
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>HVAC Smart Temp</div>
                <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 'bold' }}>21°C (-14.2% Load)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Incident Management */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', letterSpacing: '2px', color: '#FF4B4B', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertOctagon size={16} /> PRIORITY INCIDENT
        </h3>
        
        <div style={{ 
          background: isResolved ? 'rgba(43,255,136,0.05)' : 'rgba(255, 75, 75, 0.08)', 
          border: `1px solid ${isResolved ? 'var(--accent-green)' : '#FF4B4B'}`, 
          borderRadius: '16px', 
          padding: '1.25rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {!isResolved && <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#FF4B4B', animation: 'pulse 1s infinite' }}></div>}
          
          <div className="flex-row justify-between" style={{ marginBottom: '1rem' }}>
            <span style={{ color: isResolved ? 'var(--accent-green)' : '#FF4B4B', fontWeight: '900', fontFamily: 'monospace', fontSize: '1.1rem' }}>
              {isResolved ? 'INCIDENT RESOLVED' : 'CODE RED: UNAUTHORIZED ACCESS'}
            </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'monospace' }}>ZONE-4</span>
          </div>
          
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0 0 1.5rem 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
            AI facial recognition failed to match individual in restricted sector. Security drones awaiting command.
          </p>
          
          <button 
            onClick={handleAiResponse}
            disabled={isResolved}
            style={{ 
              width: '100%', 
              background: isResolved ? 'transparent' : 'rgba(255, 75, 75, 0.2)', 
              color: isResolved ? 'var(--accent-green)' : '#FF4B4B', 
              border: `1px solid ${isResolved ? 'var(--accent-green)' : '#FF4B4B'}`, 
              padding: '12px', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              letterSpacing: '1px',
              cursor: isResolved ? 'default' : 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '10px',
              fontFamily: 'monospace',
              fontSize: '1rem',
              transition: 'all 0.3s'
            }}>
            {isResolved ? <CheckCircle2 size={18} /> : <Terminal size={18} />}
            {aiActionText}
          </button>
        </div>
      </div>

      {/* Telemetry & Quick Actions */}
      <div className="flex-row gap-3" style={{ marginBottom: '1.5rem' }}>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1rem' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>ACTIVE UNITS</h4>
          <div className="flex-row justify-between" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: '#fff' }}>Guards</span>
            <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>42</span>
          </div>
          <div className="flex-row justify-between" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: '#fff' }}>Medics</span>
            <span style={{ color: 'var(--accent-yellow)', fontWeight: 'bold' }}>12</span>
          </div>
          <div className="flex-row justify-between">
            <span style={{ fontSize: '0.9rem', color: '#fff' }}>Drones</span>
            <span style={{ color: '#00C8FF', fontWeight: 'bold' }}>08</span>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => setShowBroadcastModal(true)}
            style={{ flex: 1, background: 'rgba(0, 200, 255, 0.1)', border: '1px solid rgba(0, 200, 255, 0.3)', borderRadius: '12px', color: '#00C8FF', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
             <Radio size={14} /> BROADCAST
          </button>
          <button 
            onClick={runDiagnostics}
            disabled={isDiagnosing}
            style={{ flex: 1, background: isDiagnosing ? 'rgba(255,255,255,0.05)' : 'rgba(255, 255, 255, 0.05)', border: `1px solid ${isDiagnosing ? 'var(--accent-green)' : 'rgba(255, 255, 255, 0.1)'}`, borderRadius: '12px', color: isDiagnosing ? 'var(--accent-green)' : '#fff', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', opacity: isDiagnosing ? 0.7 : 1 }}>
             <Server size={14} /> {isDiagnosing ? 'SCANNING...' : 'DIAGNOSTICS'}
          </button>
        </div>
      </div>

      {/* Terminal Log Output */}
      <div>
        <h3 style={{ fontSize: '0.85rem', letterSpacing: '2px', color: 'var(--text-secondary)', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={16} /> SYSTEM TELEMETRY
        </h3>
        <div style={{ background: '#0a0d14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem', height: '120px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', scrollbarWidth: 'none' }}>
          {logs.map((log, i) => (
            <div key={i} style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: i === 0 ? '#fff' : 'rgba(255,255,255,0.4)', opacity: 1 - (i * 0.15), animation: i === 0 ? 'fadeIn 0.5s ease-out' : 'none' }}>
              <span style={{ color: log.includes('SECURITY') || log.includes('ALERT') || log.includes('DIAG') ? 'var(--accent-yellow)' : 'var(--accent-green)' }}>&gt;</span> {log}
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast Announcement Modal Popup */}
      {showBroadcastModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem' }}>
          <form onSubmit={handleSendBroadcast} style={{ background: '#121621', border: '1px solid rgba(0, 200, 255, 0.3)', borderRadius: '20px', padding: '1.5rem', width: '100%', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0, 200, 255, 0.2)' }}>
            <h3 style={{ color: '#00C8FF', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Radio /> Send Stadium Announcement</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Type a message to broadcast at the top header of all fans' screens.</p>
            <input 
              type="text" 
              placeholder="e.g. Kickoff in 2 hours. Proceed to Gates." 
              value={broadcastText} 
              onChange={(e) => setBroadcastText(e.target.value)} 
              required 
              style={{ width: '100%', background: '#0a0d14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px', color: '#fff', fontSize: '0.9rem', outline: 'none', marginBottom: '1.5rem' }} 
            />
            <div className="flex-row justify-between" style={{ gap: '10px' }}>
              <button type="button" onClick={() => setShowBroadcastModal(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
              <button type="submit" style={{ flex: 1, background: '#00C8FF', border: 'none', color: '#000', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Send Alert</button>
            </div>
          </form>
        </div>
      )}

      <style>{`
        @keyframes scanLine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Ops;
