import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Map, Bot, RadioTower, Zap, AlertOctagon, ArrowRight, Home } from 'lucide-react';
import './index.css';
import { EmergencyProvider, useEmergency } from './EmergencyContext';

// Pages Lazy Loaded
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Maps = React.lazy(() => import('./pages/Maps'));
const Concierge = React.lazy(() => import('./pages/Concierge'));
const Ops = React.lazy(() => import('./pages/Ops'));
const Crowd = React.lazy(() => import('./pages/Crowd'));
const Staff = React.lazy(() => import('./pages/Staff'));
const AccessibilityPage = React.lazy(() => import('./pages/Accessibility'));


// --- Error Boundary Component (Reliability Check) ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("VenueMind AI Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#fff', textAlign: 'center' }}>
          <AlertOctagon size={64} color="var(--accent-red)" style={{ marginBottom: '1rem' }} />
          <h2>System Offline</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Our AI systems are currently rebooting. Please standby.</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '10px 20px', background: 'var(--accent-green)', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Reboot Interface
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Bottom Navigation Component ---
const BottomNav = React.memo(() => {
  const location = useLocation();
  const navItems = [
    { path: '/', icon: Home, label: 'Hub' },
    { path: '/maps', icon: Map, label: 'Maps' },
    { path: '/concierge', icon: Bot, label: 'AI Chat' },

    { path: '/ops', icon: RadioTower, label: 'Ops' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '1200px',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border-glass)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '1rem 0.5rem',
      paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))',
      zIndex: 100,
      overflowX: 'auto',
    }}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.path} 
            to={item.path}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '3px',
              textDecoration: 'none',
              color: isActive ? 'var(--accent-green)' : 'var(--text-secondary)',
              transition: 'color 0.2s',
              minWidth: '52px',
              flexShrink: 0,
            }}
          >
            <Icon size={20} />
            <span style={{ fontSize: '0.6rem', fontWeight: isActive ? '600' : '400', whiteSpace: 'nowrap' }}>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  );
});

// --- Live Clock Widget ---
const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
        {time.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
      <span style={{ fontSize: '0.7rem', background: 'rgba(43,255,136,0.2)', color: 'var(--accent-green)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>LIVE</span>
    </div>
  );
};

// --- Main Header Component ---
const Header = () => {
  const { isEmergency, broadcastMessage, setBroadcastMessage } = useEmergency();
  
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', flexDirection: 'column', width: '100%' }}>
      <header style={{
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: isEmergency ? 'rgba(255, 0, 0, 0.8)' : 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-glass)',
        transition: 'background 0.5s'
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="flex-row gap-2">
            <Zap className="text-accent-yellow" size={24} />
            <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '1px' }}>
              VENUE<span className="text-accent-yellow">MIND AI</span>
            </span>
          </div>
        </Link>
        
        <LiveClock />

        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {/* User Avatar - SVG fallback, no external dependency */}
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="11" r="5" fill="var(--accent-green)" opacity="0.8"/>
            <ellipse cx="14" cy="22" rx="8" ry="5" fill="var(--accent-green)" opacity="0.5"/>
          </svg>
        </div>
      </header>

      {/* Broadcast Marquee Banner */}
      {broadcastMessage && !isEmergency && (
        <div style={{
          background: 'rgba(255, 222, 89, 0.95)',
          color: '#000',
          padding: '8px 1.5rem',
          fontSize: '0.85rem',
          fontWeight: '900',
          letterSpacing: '0.5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          boxShadow: '0 4px 15px rgba(255,222,89,0.3)',
          position: 'relative'
        }}>
          <div style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', position: 'relative' }}>
            <span style={{
              display: 'inline-block',
              animation: 'marquee 15s linear infinite'
            }}>
              📢 ANNOUNCEMENT: {broadcastMessage} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 📢 ANNOUNCEMENT: {broadcastMessage}
            </span>
          </div>
          <button 
            onClick={() => setBroadcastMessage('')}
            style={{ background: 'transparent', border: 'none', color: '#000', fontWeight: 'bold', marginLeft: '15px', cursor: 'pointer', fontSize: '0.85rem', padding: '0 4px' }}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

// --- Emergency Overlay Component ---
const EmergencyOverlay = () => {
  const { isEmergency, setEmergency } = useEmergency();

  if (!isEmergency) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: 'rgba(5, 0, 0, 0.95)',
      display: 'flex',
      flexDirection: 'column',
      animation: 'redFlash 2s infinite'
    }}>
      <div style={{ padding: '2rem 1.5rem', background: '#FF1E1E', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <AlertOctagon size={40} color="#FFF" style={{ animation: 'pulse 1s infinite' }} />
        <div>
          <h1 style={{ margin: 0, color: '#FFF', fontSize: '1.8rem', fontWeight: '900', textTransform: 'uppercase' }}>Evacuate Now</h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)', fontWeight: 'bold' }}>Emergency declared in Sector 4.</p>
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <img src="/images/stadium_isometric.png" alt="Live Map" style={{ position: 'absolute', width: '150%', height: '150%', objectFit: 'cover', top: '-25%', left: '-25%', filter: 'brightness(0.3) sepia(1) hue-rotate(-50deg) saturate(3)' }} />
        
        {/* AR Escape Path */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <path 
            d="M500,800 L700,600 L800,400 L950,200" 
            fill="none" 
            stroke="#2BFF88" 
            strokeWidth="16" 
            strokeDasharray="30, 20" 
            style={{ animation: 'dash 1s linear infinite', filter: 'drop-shadow(0 0 20px #2BFF88)' }} 
          />
          <circle cx="500" cy="800" r="20" fill="#FF1E1E" style={{ animation: 'pulse 1s infinite' }} />
          <circle cx="950" cy="200" r="30" fill="#2BFF88" stroke="#FFF" strokeWidth="6" />
        </svg>

        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.8)', padding: '1.5rem', borderRadius: '16px', border: '2px solid #FF1E1E', textAlign: 'center', minWidth: '80%' }}>
           <h2 style={{ color: '#2BFF88', margin: '0 0 10px 0', fontSize: '2rem', fontWeight: '900' }}>NEAREST SAFE EXIT</h2>
           <div className="flex-row justify-center gap-2" style={{ alignItems: 'center' }}>
             <span style={{ color: '#FFF', fontSize: '1.5rem', fontWeight: 'bold' }}>GATE D (SOUTH)</span>
             <ArrowRight color="#2BFF88" size={30} />
           </div>
           <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '10px', fontSize: '0.9rem' }}>Follow the green path on your screen immediately.</p>
        </div>
      </div>

      <button 
        onClick={() => {
          if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
          setEmergency(false);
        }} 
        style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#FFF', padding: '10px 20px', borderRadius: '20px', fontSize: '0.8rem' }}>
        Cancel Demo
      </button>

      <style>{`
        @keyframes redFlash {
          0% { box-shadow: inset 0 0 0 0 rgba(255,30,30,0); }
          50% { box-shadow: inset 0 0 100px 10px rgba(255,30,30,0.5); }
          100% { box-shadow: inset 0 0 0 0 rgba(255,30,30,0); }
        }
      `}</style>
    </div>
  );
}
// --- Animated Routes Component ---
const AnimatedRoutes = () => {
  const location = useLocation();
  const [fadeClass, setFadeClass] = useState('page-enter');

  useEffect(() => {
    setFadeClass('');
    const t = requestAnimationFrame(() => setFadeClass('page-enter'));
    return () => cancelAnimationFrame(t);
  }, [location.pathname]);

  return (
    <div className={fadeClass} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <React.Suspense fallback={
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(43,255,136,0.1)', borderTopColor: 'var(--accent-green)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'monospace', letterSpacing: '1px' }}>INITIALIZING NODE...</span>
        </div>
      }>
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="/crowd" element={<Crowd />} />
          <Route path="/concierge" element={<Concierge />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/access" element={<AccessibilityPage />} />
          <Route path="/ops" element={<Ops />} />

        </Routes>
      </React.Suspense>
    </div>
  );
};

// --- Sci-Fi Boot Splash Screen ---
const SplashSequence = ({ onComplete }) => {
  const [logs, setLogs] = useState([]);
  
  useEffect(() => {
    const bootLogs = [
      "INITIALIZING VENUEMIND AI KERNEL...",
      "ESTABLISHING SECURE CONNECTION TO LUSAIL STADIUM GRID...",
      "LOADING NEURAL CROWD PREDICTION MODELS...",
      "CALIBRATING 1,400+ CCTV VISION NODES...",
      "SYSTEM ONLINE. WELCOME TO THE FUTURE."
    ];
    
    let i = 0;
    const t = setInterval(() => {
      setLogs(prev => [...prev, bootLogs[i]]);
      i++;
      if (i >= bootLogs.length) {
        clearInterval(t);
        setTimeout(onComplete, 800);
      }
    }, 400);
    return () => clearInterval(t);
  }, [onComplete]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999999, background: '#050A14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <Zap size={64} color="var(--accent-green)" style={{ animation: 'pulse 1s infinite', marginBottom: '2rem' }} />
      <div style={{ width: '100%', maxWidth: '400px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-green)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {logs.map((log, i) => (
          <div key={i} style={{ animation: 'slideUp 0.2s ease-out' }}>&gt; {log}</div>
        ))}
        {logs.length < 5 && <div style={{ animation: 'pulse 0.5s infinite' }}>_</div>}
      </div>
    </div>
  );
};

function MainApp() {
  const [booting, setBooting] = useState(true);

  return (
    <ErrorBoundary>
      <EmergencyProvider>
        {booting && <SplashSequence onComplete={() => setBooting(false)} />}
        <Router>
          <div className="grid-bg"></div>
          <EmergencyOverlay />
          
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <AnimatedRoutes />
            </main>

            <BottomNav />
          </div>
        </Router>
      </EmergencyProvider>
    </ErrorBoundary>
  );
}

export default MainApp;
