import React, { useState, useEffect } from 'react';
import { AlertTriangle, Users, Activity, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';

const INITIAL_GATES = [
  { id: 'A', name: 'North Gate', density: 45, status: 'NORMAL', wait: '2 min', trend: +2 },
  { id: 'B', name: 'East Plaza', density: 60, status: 'BUSY',   wait: '8 min', trend: +5 },
  { id: 'C', name: 'South VIP',  density: 20, status: 'CLEAR',  wait: '0 min', trend: -1 },
  { id: 'D', name: 'West Fan Zone', density: 72, status: 'BUSY', wait: '11 min', trend: +8 },
];

const getStatus = (d) => d > 85 ? 'CRITICAL' : d > 60 ? 'BUSY' : d > 35 ? 'NORMAL' : 'CLEAR';
const getWait  = (d) => d > 85 ? `${Math.round(d / 4)} min` : d > 60 ? `${Math.round(d / 8)} min` : d > 35 ? '2 min' : '0 min';

const Crowd = () => {
  const [gates, setGates] = useState(INITIAL_GATES);
  const [alertActive, setAlertActive] = useState(false);
  const [rerouteActive, setRerouteActive] = useState(false);
  const [isSurge, setIsSurge] = useState(false);

  // ✅ Live breathing: density fluctuates naturally every 3s
  useEffect(() => {
    if (isSurge) return;
    const interval = setInterval(() => {
      setGates(prev => prev.map(gate => {
        const delta = Math.round((Math.random() - 0.48) * 4); // -2 to +2 drift
        const newDensity = Math.max(5, Math.min(95, gate.density + delta));
        return { ...gate, density: newDensity, status: getStatus(newDensity), wait: getWait(newDensity), trend: delta };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [isSurge]);

  const simulateSurge = () => {
    setIsSurge(true);
    setGates([
      { id: 'A', name: 'North Gate',    density: 98, status: 'CRITICAL', wait: '25 min', trend: +12 },
      { id: 'B', name: 'East Plaza',    density: 40, status: 'NORMAL',   wait: '2 min',  trend: -8  },
      { id: 'C', name: 'South VIP',     density: 20, status: 'CLEAR',    wait: '0 min',  trend: -2  },
      { id: 'D', name: 'West Fan Zone', density: 88, status: 'CRITICAL', wait: '22 min', trend: +15 },
    ]);
    setAlertActive(true);
    setRerouteActive(false);
  };

  const activateReroute = () => {
    setRerouteActive(true);
    setTimeout(() => {
      setGates([
        { id: 'A', name: 'North Gate',    density: 72, status: 'BUSY',   wait: '12 min', trend: -10 },
        { id: 'B', name: 'East Plaza',    density: 68, status: 'BUSY',   wait: '10 min', trend: +5  },
        { id: 'C', name: 'South VIP',     density: 30, status: 'NORMAL', wait: '2 min',  trend: +2  },
        { id: 'D', name: 'West Fan Zone', density: 55, status: 'BUSY',   wait: '7 min',  trend: -12 },
      ]);
      setAlertActive(false);
      setIsSurge(false);
    }, 2000);
  };

  const reset = () => {
    setIsSurge(false);
    setGates(INITIAL_GATES);
    setAlertActive(false);
    setRerouteActive(false);
  };

  const getDensityColor = (density) => {
    if (density > 85) return '#FF4B4B';
    if (density > 60) return 'var(--accent-yellow)';
    return 'var(--accent-green)';
  };

  const totalFans = Math.round(gates.reduce((s, g) => s + g.density * 480, 0));
  const avgDensity = Math.round(gates.reduce((s, g) => s + g.density, 0) / gates.length);

  return (
    <div className="flex-col" style={{ zIndex: 1, height: '100%', padding: '1.5rem', paddingBottom: '120px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      
      {/* Header */}
      <div className="flex-row justify-between" style={{ alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: '300' }}>Live Crowd<br/><span style={{fontWeight: '800'}}>Analytics</span></h2>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Activity className="text-accent-green" size={24} />
        </div>
      </div>

      {/* Reroute Alert Banner */}
      {alertActive && !rerouteActive && (
        <div style={{ background: 'rgba(255, 75, 75, 0.1)', border: '1px solid #FF4B4B', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', animation: 'pulse 2s infinite' }}>
          <div className="flex-row gap-3" style={{ alignItems: 'center', marginBottom: '1rem' }}>
            <AlertTriangle color="#FF4B4B" size={28} />
            <h3 style={{ color: '#FF4B4B', margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>CRITICAL SURGE DETECTED</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>Gate A density reached 98%. Estimated wait time exceeds acceptable limits. AI recommends immediate digital rerouting to Gate B.</p>
          <button 
            onClick={activateReroute}
            style={{ width: '100%', background: '#FF4B4B', color: '#FFF', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
            ACTIVATE AI REROUTING <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Rerouting Active State */}
      {rerouteActive && (
        <div style={{ background: 'rgba(43, 255, 136, 0.1)', border: '1px solid var(--accent-green)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
          <div className="flex-row gap-3" style={{ alignItems: 'center', marginBottom: '1rem' }}>
            <CheckCircle2 color="var(--accent-green)" size={28} />
            <h3 style={{ color: 'var(--accent-green)', margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>REROUTING ACTIVE</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0', lineHeight: '1.5' }}>Successfully dispatched push notifications to 4,200 fans. Redirecting flow to Gate B. Pressure normalizing...</p>
        </div>
      )}

      {/* Gates List */}
      <div className="flex-col gap-4">
        <h3 className="text-secondary" style={{ fontSize: '0.9rem', letterSpacing: '2px', fontWeight: '600' }}>STADIUM GATES</h3>
        
        {gates.map(gate => (
          <article key={gate.id} className="glass-card" style={{ padding: '1.25rem' }}>
            <div className="flex-row justify-between" style={{ marginBottom: '1rem', alignItems: 'center' }}>
              <div className="flex-row gap-3" style={{ alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  {gate.id}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>{gate.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: getDensityColor(gate.density) }}>{gate.status}</span>
                </div>
              </div>
              <div className="flex-col" style={{ alignItems: 'flex-end' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{gate.wait}</span>
                <span className="text-secondary text-small">Wait Time</span>
              </div>
            </div>
            
            {/* Density Bar */}
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${gate.density}%`, 
                height: '100%', 
                background: getDensityColor(gate.density),
                transition: 'width 1s ease-in-out, background 1s ease-in-out'
              }} />
            </div>
          </article>
        ))}
      </div>

      {/* Demo Controls */}
      <div className="flex-row gap-3" style={{ marginTop: '3rem' }}>
        <button onClick={simulateSurge} style={{ flex: 1, padding: '12px', background: 'rgba(255, 75, 75, 0.2)', border: '1px solid #FF4B4B', color: '#FF4B4B', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          Simulate Surge
        </button>
        <button onClick={reset} style={{ flex: 1, padding: '12px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFF', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }} aria-label="Reset crowd simulation">
          Reset
        </button>
      </div>

    </div>
  );
};

export default Crowd;
