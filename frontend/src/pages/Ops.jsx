import React, { useState, useEffect } from 'react';
import { Activity, Eye, Radio, Server, CheckCircle2, AlertOctagon, Terminal, Leaf, Sun, Thermometer, Shield, Lock, Unlock, Droplet, AlertTriangle } from 'lucide-react';
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

  // --- Perimeter Security Node States ---
  const [outerTierStatus, setOuterTierStatus] = useState('SECURE');
  const [isHydrationDispatched, setIsHydrationDispatched] = useState(false);
  const [turnstileTemp, setTurnstileTemp] = useState(39);
  const [ecoAiText, setEcoAiText] = useState('');
  const [ecoLoading, setEcoLoading] = useState(false);
  
  const [breachAiText, setBreachAiText] = useState('');
  const [breachLoading, setBreachLoading] = useState(false);

  const getEcoAiAdvice = async () => {
    setEcoLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Provide energy saving recommendations for Lusail Stadium with solar harvest efficiency at 87% and HVAC running at 21 degrees.' })
      });
      const data = await res.json();
      setEcoAiText(data.reply);
    } catch {
      setEcoAiText('Error generating eco-saving directives.');
    }
    setEcoLoading(false);
  };

  const getBreachAiPlan = async () => {
    setBreachLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Sector 4 outer barrier has been breached by crowd overflow. Provide tactical containment steps.' })
      });
      const data = await res.json();
      setBreachAiText(data.reply);
    } catch {
      setBreachAiText('Error generating emergency action steps.');
    }
    setBreachLoading(false);
  };

  const triggerBreachSimulation = () => {
    setOuterTierStatus('BREACH');
    setLogs(prev => [
      `[ALERT] Outer Barrier (Tier 1) breached at Sector 4. Crowd overflow warning!`,
      ...prev
    ]);
  };

  const deployBarrierShield = () => {
    setOuterTierStatus('LOCKDOWN');
    setLogs(prev => [
      `[AI COMMAND] Deploying AI Shield Barrier at Sector 4 Gates. Locking outer perimeter.`,
      `[SECURITY] Security drones routed to disperse unverified crowd.`,
      ...prev
    ]);
  };

  const resetBarrierShield = () => {
    setOuterTierStatus('SECURE');
    setLogs(prev => [
      `[AI COMMAND] Outer barrier gates unlocked. Re-establishing baseline flow.`,
      ...prev
    ]);
  };

  const dispatchHydration = () => {
    setIsHydrationDispatched(true);
    setTurnstileTemp(28);
    setLogs(prev => [
      `[HVAC] Automated misting nozzles activated in Sector A turnstile queue.`,
      `[STAFF] Dispatched 6 autonomous Hydration units with water supplies.`,
      ...prev
    ]);
  };

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
          <h2 style={{ fontSize: '1.4rem', margin: 0, fontWeight: '800', color: 'var(--accent-blue)', letterSpacing: '2px', textTransform: 'uppercase' }}>Command Node</h2>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: 'monospace' }}>SECURE ENCRYPTED CHANNEL</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)', animation: 'pulse 1.5s infinite' }}></div>
            <span style={{ color: 'var(--accent-green)', fontWeight: 'bold', fontSize: '0.8rem', fontFamily: 'monospace' }}>SYSTEM ONLINE</span>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontFamily: 'monospace' }}>PING: 14ms</span>
        </div>
      </div>

      {/* EMERGENCY TRIGGER */}
      <button 
        onClick={() => setEmergency(true)}
        style={{ width: '100%', background: '#FF1E1E', border: 'none', color: 'var(--text-primary)', padding: '1rem', borderRadius: '12px', fontWeight: '900', fontSize: '1.1rem', letterSpacing: '2px', cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 30px rgba(255,30,30,0.4)' }}>
        <AlertOctagon size={24} /> TRIGGER EMERGENCY EVACUATION
      </button>

      {/* AI Heatmap & Surveillance */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="flex-row justify-between" style={{ marginBottom: '0.5rem', alignItems: 'center' }}>
          <h3 style={{ fontSize: '0.85rem', letterSpacing: '2px', color: 'var(--accent-yellow)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Eye size={16} /> LIVE HEATMAP
          </h3>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-primary)', background: 'rgba(30, 64, 175, 0.06)', padding: '2px 6px', borderRadius: '4px' }}>SECTOR ALL</span>
        </div>
        
        <div style={{ 
          height: '200px', 
          background: 'var(--bg-card)', 
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
             <span style={{ position: 'absolute', top: '-18px', left: '-2px', background: '#FF4B4B', color: 'var(--text-primary)', fontSize: '0.5rem', padding: '2px 4px', fontWeight: 'bold' }}>ANOMALY</span>
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
        <div style={{ background: 'rgba(30, 64, 175,0.03)', border: '1px solid rgba(5, 150, 105, 0.08)', borderRadius: '16px', padding: '1.25rem' }}>
          <div className="flex-row justify-between" style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '600' }}>AI Sustainability Grid</span>
            <span style={{ background: 'var(--accent-green-dim)', color: 'var(--accent-green)', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>ECO ACTIVE</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ background: 'rgba(30, 64, 175, 0.03)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sun size={20} color="var(--accent-yellow)" />
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Solar Grid harvest</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>87% Efficiency</div>
              </div>
            </div>
            <div style={{ background: 'rgba(30, 64, 175, 0.03)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Thermometer size={20} color="var(--accent-blue)" />
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>HVAC Smart Temp</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>21°C (-14.2% Load)</div>
              </div>
            </div>
          </div>
          <button 
            onClick={getEcoAiAdvice} 
            disabled={ecoLoading}
            style={{ width: '100%', marginTop: '12px', background: 'rgba(30, 64, 175,0.1)', border: '1px solid rgba(5, 150, 105, 0.15)', color: 'var(--accent-green)', padding: '10px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}
          >
            {ecoLoading ? 'Running Grid Optimization...' : '🤖 Run GenAI Eco Grid Optimization'}
          </button>
          {ecoAiText && (
            <div style={{ marginTop: '10px', background: 'rgba(30, 64, 175,0.04)', border: '1px solid rgba(5, 150, 105, 0.08)', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-primary)', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
              {ecoAiText}
            </div>
          )}
        </div>
      </div>

      {/* 🛡️ Perimeter Security & Anti-Gatecrash Control Node */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', letterSpacing: '2px', color: 'var(--accent-blue)', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Shield size={16} /> PERIMETER SECURITY & BREACH MITIGATION
        </h3>
        <div style={{ background: 'rgba(0, 200, 255, 0.03)', border: '1px solid rgba(0, 200, 255, 0.15)', borderRadius: '16px', padding: '1.25rem' }}>
          
          {/* Status of Perimeters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(30, 64, 175, 0.02)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Tier 1: Outer Barrier (1km)</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Fences, gates, & checkpoint screening</div>
              </div>
              <span style={{ 
                background: outerTierStatus === 'SECURE' ? 'rgba(0, 200, 120, 0.15)' : outerTierStatus === 'BREACH' ? 'rgba(255, 30, 30, 0.15)' : 'rgba(255, 222, 89, 0.15)',
                color: outerTierStatus === 'SECURE' ? 'var(--accent-green)' : outerTierStatus === 'BREACH' ? '#FF4B4B' : 'var(--accent-yellow)',
                fontSize: '0.65rem', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', fontFamily: 'monospace'
              }}>
                {outerTierStatus}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(30, 64, 175, 0.02)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Tier 2: Inner Security (200m)</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Bag screening & metal detection lanes</div>
              </div>
              <span style={{ 
                background: 'rgba(0, 200, 120, 0.15)',
                color: 'var(--accent-green)',
                fontSize: '0.65rem', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', fontFamily: 'monospace'
              }}>
                SECURE
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(30, 64, 175, 0.02)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Tier 3: Main Turnstiles</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Stadium final entrance validation</div>
              </div>
              <span style={{ 
                background: 'rgba(0, 200, 120, 0.15)',
                color: 'var(--accent-green)',
                fontSize: '0.65rem', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', fontFamily: 'monospace'
              }}>
                SECURE
              </span>
            </div>
          </div>

          {/* Interactive Breach Simulator Area */}
          {outerTierStatus === 'BREACH' ? (
            <div style={{ background: 'rgba(255, 75, 75, 0.08)', border: '1px solid #FF4B4B', borderRadius: '12px', padding: '10px', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FF4B4B', fontSize: '0.82rem', fontWeight: 'bold' }}>
                <AlertTriangle size={16} /> WARNING: BREACH IN PROGRESS
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-primary)', margin: 0, lineHeight: '1.4' }}>
                CCTV vision sensors detected 120 ticketless individuals scaling the perimeter fences at Sector 4 Outer Barrier. 
              </p>
              <button 
                onClick={deployBarrierShield}
                style={{
                  background: '#FF4B4B', border: 'none', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}>
                <Lock size={14} /> DEPLOY SHIELD BARRIER
              </button>
            </div>
          ) : outerTierStatus === 'LOCKDOWN' ? (
            <div style={{ background: 'rgba(255, 222, 89, 0.08)', border: '1px solid var(--accent-yellow)', borderRadius: '12px', padding: '10px', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-yellow)', fontSize: '0.82rem', fontWeight: 'bold' }}>
                <Lock size={16} /> LOCKDOWN SHIELD DEPLOYED
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-primary)', margin: 0, lineHeight: '1.4' }}>
                Outer barrier gates locked. Security drones successfully dispersed crowd. Legitimate ticket flows restored.
              </p>
              <button 
                onClick={resetBarrierShield}
                style={{
                  background: 'transparent', border: '1px solid var(--accent-yellow)', color: 'var(--accent-yellow)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer'
                }}>
                <Unlock size={12} /> RELEASE LOCKDOWN
              </button>
            </div>
          ) : (
            <button 
              onClick={triggerBreachSimulation}
              style={{
                width: '100%', background: 'rgba(0, 200, 255, 0.1)', border: '1px solid rgba(0, 200, 255, 0.3)', color: 'var(--accent-blue)', padding: '10px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}>
              <AlertTriangle size={14} /> SIMULATE COPA-STYLE SURGE BREACH
            </button>
          )}

          {/* AI Emergency Incident commander block */}
          <div style={{ margin: '1rem 0' }}>
            <button
              onClick={getBreachAiPlan}
              disabled={breachLoading}
              style={{
                width: '100%',
                background: 'rgba(255, 75, 75, 0.1)',
                border: '1px solid rgba(255, 75, 75, 0.3)',
                color: '#FF4B4B',
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
              {breachLoading ? 'Formulating tactical directives...' : '🤖 Generate AI Breach Containment Plan'}
            </button>
            {breachAiText && (
              <div style={{
                marginTop: '10px',
                background: 'rgba(255, 75, 75, 0.04)',
                border: '1px solid rgba(255, 75, 75, 0.15)',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: 'var(--text-primary)',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap'
              }}>
                {breachAiText}
              </div>
            )}
          </div>

          {/* Thermal/Hydration Dispatcher Panel */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Queue Climate & Hydration</span>
              <span style={{ fontSize: '0.75rem', color: turnstileTemp > 30 ? '#FF6B35' : 'var(--accent-green)', fontWeight: 'bold', fontFamily: 'monospace' }}>
                Sector A: {turnstileTemp}°C
              </span>
            </div>
            {isHydrationDispatched ? (
              <div style={{ background: 'rgba(30, 64, 175,0.06)', border: '1px solid var(--accent-green)', borderRadius: '10px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--accent-green)" />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>Hydration bots dispatched. Misting fans ON. Temp reduced to 28°C.</span>
              </div>
            ) : (
              <button 
                onClick={dispatchHydration}
                style={{
                  width: '100%', background: '#FF6B35', border: 'none', color: 'var(--text-primary)', padding: '8px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}>
                <Droplet size={14} /> DISPATCH WATER BOTS (HEAT ALERT)
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Critical Incident Management */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', letterSpacing: '2px', color: '#FF4B4B', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertOctagon size={16} /> PRIORITY INCIDENT
        </h3>
        
        <div style={{ 
          background: isResolved ? 'var(--accent-green-dim)' : 'rgba(255, 75, 75, 0.08)', 
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
          
          <p style={{ color: 'var(--text-primary)', margin: '0 0 1.5rem 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
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
        <div style={{ flex: 1, background: 'rgba(30, 64, 175, 0.03)', border: '1px solid var(--border-glass)', borderRadius: '16px', padding: '1rem' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>ACTIVE UNITS</h4>
          <div className="flex-row justify-between" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Guards</span>
            <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>42</span>
          </div>
          <div className="flex-row justify-between" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Medics</span>
            <span style={{ color: 'var(--accent-yellow)', fontWeight: 'bold' }}>12</span>
          </div>
          <div className="flex-row justify-between">
            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Drones</span>
            <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>08</span>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => setShowBroadcastModal(true)}
            style={{ flex: 1, background: 'rgba(0, 200, 255, 0.1)', border: '1px solid rgba(0, 200, 255, 0.3)', borderRadius: '12px', color: 'var(--accent-blue)', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
             <Radio size={14} /> BROADCAST
          </button>
          <button 
            onClick={runDiagnostics}
            disabled={isDiagnosing}
            style={{ flex: 1, background: isDiagnosing ? 'rgba(30, 64, 175, 0.05)' : 'rgba(30, 64, 175, 0.05)', border: `1px solid ${isDiagnosing ? 'var(--accent-green)' : 'var(--border-glass)'}`, borderRadius: '12px', color: isDiagnosing ? 'var(--accent-green)' : 'var(--text-primary)', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', opacity: isDiagnosing ? 0.7 : 1 }}>
             <Server size={14} /> {isDiagnosing ? 'SCANNING...' : 'DIAGNOSTICS'}
          </button>
        </div>
      </div>

      {/* Terminal Log Output */}
      <div>
        <h3 style={{ fontSize: '0.85rem', letterSpacing: '2px', color: 'var(--text-secondary)', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={16} /> SYSTEM TELEMETRY
        </h3>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '1rem', height: '120px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', scrollbarWidth: 'none' }}>
          {logs.map((log, i) => (
            <div key={i} style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: i === 0 ? 'var(--text-primary)' : 'var(--text-muted)', opacity: 1 - (i * 0.15), animation: i === 0 ? 'fadeIn 0.5s ease-out' : 'none' }}>
              <span style={{ color: log.includes('SECURITY') || log.includes('ALERT') || log.includes('DIAG') ? 'var(--accent-yellow)' : 'var(--accent-green)' }}>&gt;</span> {log}
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast Announcement Modal Popup */}
      {showBroadcastModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(255, 255, 255, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem' }}>
          <form onSubmit={handleSendBroadcast} style={{ background: 'var(--bg-card)', border: '1px solid rgba(0, 200, 255, 0.3)', borderRadius: '20px', padding: '1.5rem', width: '100%', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0, 200, 255, 0.2)' }}>
            <h3 style={{ color: 'var(--accent-blue)', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Radio /> Send Stadium Announcement</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Type a message to broadcast at the top header of all fans' screens.</p>
            <input 
              type="text" 
              placeholder="e.g. Kickoff in 2 hours. Proceed to Gates." 
              value={broadcastText} 
              onChange={(e) => setBroadcastText(e.target.value)} 
              required 
              style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: '10px', padding: '12px', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', marginBottom: '1.5rem' }} 
            />
            <div className="flex-row justify-between" style={{ gap: '10px' }}>
              <button type="button" onClick={() => setShowBroadcastModal(false)} style={{ flex: 1, background: 'rgba(30, 64, 175, 0.05)', border: 'none', color: 'var(--text-primary)', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
              <button type="submit" style={{ flex: 1, background: 'var(--accent-blue)', border: 'none', color: '#000', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Send Alert</button>
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
