import React, { useState, useEffect } from 'react';
import { ShieldCheck, Stethoscope, Users, Wrench, CheckCircle2, AlertTriangle, MapPin, Radio, ClipboardList } from 'lucide-react';

const ROLES = [
  { id: 'security', label: 'Security', icon: ShieldCheck, color: '#FF4B4B', badge: 'SEC-042' },
  { id: 'medic',    label: 'Medic',    icon: Stethoscope, color: '#00C8FF', badge: 'MED-012' },
  { id: 'volunteer',label: 'Volunteer',icon: Users,        color: '#2BFF88', badge: 'VOL-187' },
  { id: 'ops',      label: 'Operations', icon: Wrench,     color: '#FFDE59', badge: 'OPS-006' },
];

const TASKS_BY_ROLE = {
  security: [
    { id: 1, priority: 'HIGH',   sector: 'Gate B',       task: 'Crowd density spike — deploy crowd barriers immediately.', done: false },
    { id: 2, priority: 'MEDIUM', sector: 'Sector 4',     task: 'Unregistered frequency — patrol and report.', done: false },
    { id: 3, priority: 'LOW',    sector: 'VIP Lounge A', task: 'Escort VIP guest arrival from Gate D.', done: false },
  ],
  medic: [
    { id: 1, priority: 'HIGH',   sector: 'Section 204',  task: 'Fan reported dizziness near Row 14. Assist immediately.', done: false },
    { id: 2, priority: 'MEDIUM', sector: 'First Aid Post 2', task: 'Restock oral rehydration sachets.', done: false },
    { id: 3, priority: 'LOW',    sector: 'Gate A',        task: 'Pre-match wellness check for wheelchair zone.', done: false },
  ],
  volunteer: [
    { id: 1, priority: 'HIGH',   sector: 'Gate C',       task: 'Direct crowd from Gate B (overcrowded) — AI rerouted 340 fans your way.', done: false },
    { id: 2, priority: 'MEDIUM', sector: 'Concessions',  task: 'Assist multilingual signage setup for Arabic & Spanish fans.', done: false },
    { id: 3, priority: 'LOW',    sector: 'Fan Zone',     task: 'Distribute complimentary water bottles. Stock: 200 units.', done: false },
  ],
  ops: [
    { id: 1, priority: 'HIGH',   sector: 'Power Grid B', task: 'Solar failover detected — switch to Grid C manually.', done: false },
    { id: 2, priority: 'MEDIUM', sector: 'HVAC Zone 3',  task: 'AI recommends lowering cooling by 2°C. Confirm override.', done: false },
    { id: 3, priority: 'LOW',    sector: 'Parking Lot',  task: 'Update dynamic signage with updated shuttle timing.', done: false },
  ],
};

const AI_BRIEFINGS = {
  security: 'AI analysis: Gate B crowd pressure is 87% capacity. Recommend 2 additional officers within 3 mins to prevent overflow. Drone 04 is monitoring.',
  medic:    'AI analysis: Based on heat index 39°C and fan density, predict 3-4 heat exhaustion cases in next 60 mins. Pre-position IV fluids at Posts 1 & 3.',
  volunteer: 'AI analysis: 340 Spanish-speaking fans were rerouted to Gate C. High engagement expected. Ensure you have a Spanish-capable volunteer in your team.',
  ops:      'AI analysis: Solar Grid harvested 87% capacity today. Grid B momentary dip detected at 09:32. Predictive maintenance window: tonight 02:00–04:00.',
};

const PRIORITY_COLOR = { HIGH: '#FF4B4B', MEDIUM: '#FFDE59', LOW: '#2BFF88' };

const Staff = () => {
  const [activeRole, setActiveRole] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReply, setAiReply] = useState('');
  const [reportInput, setReportInput] = useState('');
  const [reportSent, setReportSent] = useState(false);
  const [liveAlerts, setLiveAlerts] = useState([
    '⚡ AI rerouted 340 fans → Gate C',
    '🔴 Anomaly detected — Sector 4',
    '🌡️ Heat index: 39°C. Medic Pre-alert active',
    '✅ Solar grid harvest nominal: 87%',
  ]);

  // Simulate live alerts rotating
  useEffect(() => {
    const newAlerts = [
      '🚨 Gate B capacity: 87% — deploying barriers',
      '🎙️ PA Broadcast sent to all fans',
      '🚌 Shuttle Bus D departed Gate C on time',
      '✅ CCTV check complete — 1,400 units active',
    ];
    let i = 0;
    const t = setInterval(() => {
      setLiveAlerts(prev => [newAlerts[i % newAlerts.length], ...prev.slice(0, 3)]);
      i++;
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const selectRole = (role) => {
    setAiLoading(true);
    setAiReply('');
    setActiveRole(role);
    setTasks(TASKS_BY_ROLE[role.id].map(t => ({ ...t })));
    setReportSent(false);

    // Simulate AI briefing generation
    setTimeout(async () => {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `You are VenueMind AI at FIFA World Cup 2026 Lusail Stadium. Give a 2-sentence operational briefing for a ${role.label} staff member. Focus on current crowd situation and their priority. Be concise and direct.`
          })
        });
        const data = await res.json();
        setAiReply(data.reply || AI_BRIEFINGS[role.id]);
      } catch {
        setAiReply(AI_BRIEFINGS[role.id]);
      }
      setAiLoading(false);
    }, 800);
  };

  const markDone = (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, done: true } : t));
  };

  const sendReport = (e) => {
    e.preventDefault();
    if (!reportInput.trim()) return;
    setReportSent(true);
    setReportInput('');
  };

  if (!activeRole) {
    return (
      <div style={{ padding: '1.5rem', paddingBottom: '120px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: 'var(--accent-green)', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '8px', fontFamily: 'monospace' }}>FIFA WORLD CUP 2026 — LUSAIL STADIUM</p>
          <h1 style={{ fontSize: '2rem', fontWeight: '900', margin: 0 }}>Staff <span style={{ color: 'var(--accent-yellow)' }}>Command</span></h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.9rem' }}>Select your role to receive AI-generated task briefing</p>
        </div>

        {/* Live Alerts ticker */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1rem', marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '1px', marginBottom: '8px', fontFamily: 'monospace' }}>LIVE COMMAND FEED</div>
          {liveAlerts.map((a, i) => (
            <div key={i} style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: i === 0 ? '#fff' : 'rgba(255,255,255,0.4)', marginBottom: '4px', animation: i === 0 ? 'fadeIn 0.5s ease' : 'none' }}>{a}</div>
          ))}
        </div>

        {/* Role selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {ROLES.map(role => {
            const Icon = role.icon;
            return (
              <button key={role.id} onClick={() => selectRole(role)} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${role.color}33`, borderRadius: '16px', padding: '1.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px', transition: 'all 0.2s', textAlign: 'left' }}>
                <div style={{ background: `${role.color}22`, width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={24} color={role.color} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '1rem', color: '#fff' }}>{role.label}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>ID: {role.badge}</div>
                </div>
                <div style={{ background: role.color, color: '#000', fontSize: '0.65rem', fontWeight: 'bold', padding: '3px 10px', borderRadius: '12px' }}>
                  {TASKS_BY_ROLE[role.id].length} Active Tasks
                </div>
              </button>
            );
          })}
        </div>

        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    );
  }

  const Icon = activeRole.icon;
  const completedCount = tasks.filter(t => t.done).length;

  return (
    <div style={{ padding: '1.5rem', paddingBottom: '120px' }}>
      {/* Role Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: `${activeRole.color}22`, width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={22} color={activeRole.color} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontWeight: '900', fontSize: '1.3rem' }}>{activeRole.label}</h2>
            <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>ID: {activeRole.badge} · SHIFT ACTIVE</span>
          </div>
        </div>
        <button onClick={() => setActiveRole(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-secondary)', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontSize: '0.8rem' }}>← Back</button>
      </div>

      {/* AI Briefing Card */}
      <div style={{ background: 'linear-gradient(135deg, rgba(43,255,136,0.08), rgba(43,255,136,0.02))', border: '1px solid var(--border-green)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-green)', boxShadow: '0 0 8px var(--accent-green)', animation: 'pulse 1.5s infinite' }}></div>
          <span style={{ fontSize: '0.7rem', color: 'var(--accent-green)', fontWeight: 'bold', letterSpacing: '1px', fontFamily: 'monospace' }}>GEMINI AI LIVE BRIEFING</span>
        </div>
        {aiLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '18px', height: '18px', border: '2px solid rgba(43,255,136,0.2)', borderTopColor: 'var(--accent-green)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Gemini AI is analyzing stadium data...</span>
          </div>
        ) : (
          <p style={{ color: '#fff', fontSize: '0.9rem', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>{aiReply}</p>
        )}
      </div>

      {/* Task Queue */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}><ClipboardList size={15} /> AI TASK QUEUE</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontFamily: 'monospace' }}>{completedCount}/{tasks.length} Done</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tasks.map(task => (
            <div key={task.id} style={{ background: task.done ? 'rgba(43,255,136,0.05)' : 'rgba(255,255,255,0.03)', border: `1px solid ${task.done ? 'var(--border-green)' : `${PRIORITY_COLOR[task.priority]}33`}`, borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'flex-start', gap: '12px', transition: 'all 0.3s' }}>
              <div style={{ marginTop: '2px' }}>
                <span style={{ background: task.done ? 'var(--accent-green)' : PRIORITY_COLOR[task.priority], color: '#000', fontSize: '0.55rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '8px' }}>{task.done ? 'DONE' : task.priority}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                  <MapPin size={12} color="var(--text-secondary)" />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{task.sector}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: task.done ? 'var(--text-secondary)' : '#fff', textDecoration: task.done ? 'line-through' : 'none', lineHeight: '1.4' }}>{task.task}</p>
              </div>
              {!task.done && (
                <button onClick={() => markDone(task.id)} style={{ background: 'rgba(43,255,136,0.1)', border: '1px solid var(--border-green)', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', color: 'var(--accent-green)', fontSize: '0.75rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                  ✓ Done
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: 'var(--text-secondary)', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}><Radio size={15} /> QUICK ACTIONS</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button style={{ background: 'rgba(255,75,75,0.1)', border: '1px solid rgba(255,75,75,0.3)', borderRadius: '12px', padding: '12px', color: '#FF4B4B', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <AlertTriangle size={16} /> Request Backup
          </button>
          <button style={{ background: 'rgba(0,200,255,0.1)', border: '1px solid rgba(0,200,255,0.3)', borderRadius: '12px', padding: '12px', color: '#00C8FF', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} /> Sector Clear
          </button>
        </div>
      </div>

      {/* AI Incident Report */}
      <div>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: 'var(--text-secondary)', letterSpacing: '2px' }}>📋 AI INCIDENT REPORT</h3>
        {reportSent ? (
          <div style={{ background: 'rgba(43,255,136,0.08)', border: '1px solid var(--border-green)', borderRadius: '12px', padding: '1rem', textAlign: 'center', color: 'var(--accent-green)', fontWeight: 'bold' }}>
            ✅ Report Submitted to Command Node via AI
          </div>
        ) : (
          <form onSubmit={sendReport} style={{ display: 'flex', gap: '10px' }}>
            <input
              value={reportInput}
              onChange={e => setReportInput(e.target.value)}
              placeholder="Describe incident for AI to log & escalate..."
              style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
            />
            <button type="submit" style={{ background: activeRole.color, border: 'none', borderRadius: '10px', padding: '12px 16px', cursor: 'pointer', fontWeight: 'bold', color: '#000' }}>Send</button>
          </form>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Staff;
