import React, { useState } from 'react';
import { Zap, AlertTriangle, Download, Server, Cpu, Eye } from 'lucide-react';
import { useEmergency } from '../EmergencyContext';

const ROLE_METADATA = {
  collector: {
    title: 'District Collector Portal',
    badge: 'COLLECTOR-HQ',
    color: '#FFDE59',
    kpis: [
      { label: 'Overall Security Level', value: '🟢 NOMINAL' },
      { label: 'Resource Efficiency', value: '94.2%' },
      { label: 'Spectator Satisfaction', value: '96.5%' },
      { label: 'District Coordination', value: 'ACTIVE' }
    ]
  },
  police: {
    title: 'Police Command Portal',
    badge: 'POLICE-CHIEF-HQ',
    color: '#FF4B4B',
    kpis: [
      { label: 'Sector 4 Outer Barrier', value: '🔒 LOCKED' },
      { label: 'Security Stewards Active', value: '140 Stewards' },
      { label: 'Evacuation Readiness', value: '100% Prepared' },
      { label: 'Response Unit ETA', value: '1.5 Min' }
    ]
  },
  organizer: {
    title: 'FIFA Tournament Director',
    badge: 'FIFA-ORGANIZER-HQ',
    color: '#00C8FF',
    kpis: [
      { label: 'Stadium Seating Load', value: '95,400 / 96,000' },
      { label: 'VIP Lounge Occupancy', value: '98%' },
      { label: 'Match Schedule Offset', value: '0s (Nominal)' },
      { label: 'Concessions Flow Index', value: 'A+ (Optimal)' }
    ]
  },
  government: {
    title: 'Ministry of Infrastructure',
    badge: 'GOVERNMENT-HQ',
    color: '#2BFF88',
    kpis: [
      { label: 'Solar Output Harvest', value: '1.4 MW' },
      { label: 'HVAC Energy Load', value: '21.5°C (-14.2%)' },
      { label: 'Stadium Green Rating', value: 'Platinum (A+)' },
      { label: 'Carbon Neutral Index', value: '98.6%' }
    ]
  }
};

const AuthorityDashboard = ({ user, onLogout }) => {
  const { setEmergency, isEmergency } = useEmergency();
  const [activeRole, setActiveRole] = useState(user.role); // Default to logged in role, but allow switching in dashboard
  const [downloadState, setDownloadState] = useState('');
  const [logs, setLogs] = useState([
    'SYS_UPDATE: Secure connection to FIFA Command Grid nominal.',
    'CROWD_NODE: Gate B bypass turning active (stewards re-routed).',
    'ENERGY_GRID: Solar output peak reached: 1.4MW generated.'
  ]);

  const activeMeta = ROLE_METADATA[activeRole] || ROLE_METADATA.collector;

  const triggerEvac = () => {
    setEmergency(true);
    setLogs(prev => ['[ALERT] EMERGENCY DISPATCHED: Evacuation sequence initiated.', ...prev]);
  };

  const cancelEvac = () => {
    setEmergency(false);
    setLogs(prev => ['[RESOLVED] Evacuation sequence cancelled by HQ.', ...prev]);
  };

  const handleDownload = (format) => {
    setDownloadState(`Generating ${format.toUpperCase()} Report...`);
    setTimeout(() => {
      setDownloadState(`Saved: venumind_hq_report.${format}`);
      setTimeout(() => setDownloadState(''), 3000);
    }, 1500);
  };

  return (
    <div style={{ padding: '1.5rem', paddingBottom: '120px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Top Banner info */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(13,18,32,0.9), rgba(5,8,16,0.95))',
        border: `1px solid ${activeMeta.color}44`,
        borderRadius: '20px',
        padding: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '15px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ background: activeMeta.color, color: '#000', fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px' }}>
              {activeMeta.badge}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontFamily: 'monospace' }}>SECURE ACCESS VERIFIED</span>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>{activeMeta.title}</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>LoggedIn: {user.email}</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Switch Roles Toggles */}
          {Object.keys(ROLE_METADATA).map(roleKey => (
            <button
              key={roleKey}
              onClick={() => setActiveRole(roleKey)}
              style={{
                background: activeRole === roleKey ? ROLE_METADATA[roleKey].color : 'rgba(255,255,255,0.03)',
                border: 'none',
                color: activeRole === roleKey ? '#000' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {roleKey.toUpperCase()}
            </button>
          ))}
          <button
            onClick={onLogout}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,75,75,0.4)',
              color: '#FF4B4B',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              padding: '6px 12px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            LOGOUT
          </button>
        </div>
      </div>

      {/* KPIs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', marginBottom: '2rem' }}>
        {activeMeta.kpis.map((kpi, idx) => (
          <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {kpi.label}
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: activeMeta.color, marginTop: '6px' }}>
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      {/* Heatmap & Alerts Double Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '2rem' }}>
        
        {/* Crowd Heatmap */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={18} color={activeMeta.color} /> Live Crowd Density Heatmap
          </h3>
          <div style={{ height: '220px', borderRadius: '12px', position: 'relative', overflow: 'hidden', background: '#0a0d14' }}>
            <img src="/images/stadium_heatmap.png" alt="Stadium Seating Heatmap" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
            <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255, 75, 75, 0.2)', border: '1px solid #FF4B4B', padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', color: '#fff', fontWeight: 'bold' }}>
              SECTOR 4 HOTSPOT DETECTED (92%)
            </div>
          </div>
        </div>

        {/* Live Command Log Alerts */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={18} color="var(--accent-yellow)" /> Secure Command Center Feed
          </h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto', paddingRight: '5px' }}>
            {logs.map((log, idx) => (
              <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', borderLeft: `3px solid ${activeMeta.color}`, fontSize: '0.8rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.9)' }}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency & Solar controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '2rem' }}>
        
        {/* HQ Emergency Dispatcher */}
        <div style={{ background: 'rgba(255,75,75,0.03)', border: '1px solid rgba(255,75,75,0.2)', borderRadius: '20px', padding: '1.5rem' }}>
          <h3 style={{ color: '#FF4B4B', margin: '0 0 10px 0', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} /> Authority Emergency Dispatch Center
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 1.25rem 0', lineHeight: '1.4' }}>
            Remotely trigger stadium-wide evacuations, lock outer security boundaries, and override public signs.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={triggerEvac}
              style={{
                flex: 1,
                background: '#FF4B4B',
                color: '#fff',
                border: 'none',
                padding: '10px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              DISPATCH EVACUATION
            </button>
            {isEmergency && (
              <button
                onClick={cancelEvac}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  padding: '10px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                CANCEL EVACUATION
              </button>
            )}
          </div>
        </div>

        {/* Eco Smart Grid & Transport status */}
        <div style={{ background: 'rgba(0, 200, 255, 0.03)', border: '1px solid rgba(0, 200, 255, 0.2)', borderRadius: '20px', padding: '1.5rem' }}>
          <h3 style={{ color: '#00C8FF', margin: '0 0 10px 0', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} /> Energy & Transit Telemetry
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Solar Storage Harvest</span>
              <strong style={{ color: '#2BFF88' }}>1.4 MW (Active)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Metro Station Line status</span>
              <strong style={{ color: '#2BFF88' }}>2 min wait (High frequency)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Shuttle Congestion Loop</span>
              <strong style={{ color: '#FFDE59' }}>Moderate wait (8 min)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Predictions & Reports Generation */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.1rem', color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={18} color="var(--accent-purple)" /> GenAI Predictions & Analytics Reports
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 'bold', marginBottom: '8px' }}>
              AI PREDICTED CONGESTION PEAK FORECAST
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#B48EFF' }}>18:40 PM</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>(Estimated Crowd Surge 98% North Gate)</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleDownload('pdf')}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
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
                <Download size={14} /> Download PDF Report
              </button>
              <button
                onClick={() => handleDownload('json')}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
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
                <Download size={14} /> Download JSON Logs
              </button>
            </div>
            {downloadState && (
              <div style={{ color: 'var(--accent-green)', fontSize: '0.8rem', fontFamily: 'monospace', textAlign: 'center' }}>
                {downloadState}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityDashboard;
