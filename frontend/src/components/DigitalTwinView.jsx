import React, { useState, memo } from 'react';
import { Eye, Cloud, Car, ShieldAlert, Activity } from 'lucide-react';

const SECTORS_DATA = [
  { id: 'North', name: 'North Stand (Blocks 101-115)', density: '88%', status: '⚠️ High Density', color: '#FFDE59' },
  { id: 'South', name: 'South Stand (Blocks 120-135)', density: '94%', status: '🚨 Critical Surge', color: '#FF4B4B' },
  { id: 'East', name: 'East Stand (Blocks 140-155)', density: '62%', status: '✅ Nominal', color: '#2BFF88' },
  { id: 'West', name: 'West Stand (VIP & Press)', density: '45%', status: '✅ Nominal', color: '#2BFF88' }
];

const DigitalTwinView = () => {
  const [hoveredSector, setHoveredSector] = useState(null);

  return (
    <div style={{
      background: 'rgba(10,17,32,0.6)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(0, 200, 255, 0.15)',
      borderRadius: '16px',
      padding: '1.25rem',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      marginBottom: '1.25rem'
    }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '0.8rem', letterSpacing: '2px', color: '#00C8FF', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Eye size={16} /> 3D DIGITAL TWIN TELEMETRY
      </h3>

      {/* Main Grid: Visual Map + Climate Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }} className="digital-twin-grid">
        
        {/* SVG interactive Stadium Blueprint */}
        <div style={{
          position: 'relative',
          background: 'rgba(0,0,0,0.4)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.05)',
          padding: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '160px'
        }}>
          <svg width="150" height="150" viewBox="0 0 100 100" data-testid="stadium-svg">
            {/* Outer Rim */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
            {/* Sectors */}
            {/* North Stand */}
            <path d="M15 35 A 40 40 0 0 1 85 35 L 50 50 Z" 
                  fill={hoveredSector === 'North' ? 'rgba(255,222,89,0.3)' : 'rgba(255,222,89,0.15)'} 
                  stroke="#FFDE59" strokeWidth="1" style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  onMouseEnter={() => setHoveredSector('North')}
                  onMouseLeave={() => setHoveredSector(null)}
            />
            {/* South Stand */}
            <path d="M15 65 A 40 40 0 0 0 85 65 L 50 50 Z" 
                  fill={hoveredSector === 'South' ? 'rgba(255,75,75,0.3)' : 'rgba(255,75,75,0.15)'} 
                  stroke="#FF4B4B" strokeWidth="1" style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  onMouseEnter={() => setHoveredSector('South')}
                  onMouseLeave={() => setHoveredSector(null)}
            />
            {/* East Stand */}
            <path d="M85 35 A 40 40 0 0 1 85 65 L 50 50 Z" 
                  fill={hoveredSector === 'East' ? 'rgba(43,255,136,0.3)' : 'rgba(43,255,136,0.15)'} 
                  stroke="#2BFF88" strokeWidth="1" style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  onMouseEnter={() => setHoveredSector('East')}
                  onMouseLeave={() => setHoveredSector(null)}
            />
            {/* West Stand */}
            <path d="M15 35 A 40 40 0 0 0 15 65 L 50 50 Z" 
                  fill={hoveredSector === 'West' ? 'rgba(43,255,136,0.3)' : 'rgba(43,255,136,0.15)'} 
                  stroke="#2BFF88" strokeWidth="1" style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  onMouseEnter={() => setHoveredSector('West')}
                  onMouseLeave={() => setHoveredSector(null)}
            />
            {/* Center Pitch */}
            <rect x="42" y="38" width="16" height="24" rx="1" fill="#1e293b" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          </svg>
          <div style={{ position: 'absolute', bottom: '6px', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
            {hoveredSector ? `${hoveredSector} sector selected` : 'Hover to inspect stands'}
          </div>
        </div>

        {/* Telemetry metrics panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
          {hoveredSector ? (
            (() => {
              const sec = SECTORS_DATA.find(s => s.id === hoveredSector);
              return (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${sec.color}`, padding: '10px', borderRadius: '8px', animation: 'fadeIn 0.2s' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#fff' }}>{sec.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Density:</span>
                    <strong style={{ color: sec.color }}>{sec.density}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                    <span style={{ color: sec.color, fontWeight: 'bold' }}>{sec.status}</span>
                  </div>
                </div>
              );
            })()
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '8px' }}>
                <Cloud size={14} color="#00C8FF" />
                <div style={{ fontSize: '0.7rem' }}>
                  <span style={{ color: 'var(--text-secondary)', display: 'block' }}>BOWL WEATHER</span>
                  <strong style={{ color: '#fff' }}>22.4°C | 54% Hum</strong>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '8px' }}>
                <Car size={14} color="#2BFF88" />
                <div style={{ fontSize: '0.7rem' }}>
                  <span style={{ color: 'var(--text-secondary)', display: 'block' }}>PARKING LOT A & B</span>
                  <strong style={{ color: '#fff' }}>84% & 91% Slots occupied</strong>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '8px' }}>
                <ShieldAlert size={14} color="#FF4B4B" />
                <div style={{ fontSize: '0.7rem' }}>
                  <span style={{ color: 'var(--text-secondary)', display: 'block' }}>BOTTLENECK STATUS</span>
                  <strong style={{ color: '#FF4B4B' }}>South Gate pressure active</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(DigitalTwinView);
