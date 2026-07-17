import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Map, Bot, RadioTower, AlertOctagon, ArrowRight, Home } from 'lucide-react';
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
const Login = React.lazy(() => import('./pages/Login'));
const AuthorityDashboard = React.lazy(() => import('./pages/AuthorityDashboard'));

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
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: 'var(--text-primary)', textAlign: 'center' }}>
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
    { path: '/concierge', icon: Bot, label: 'AI Assistant' },

    { path: '/ops', icon: RadioTower, label: 'Ops' },
  ];

  return (
    <nav className="mobile-bottom-nav" style={{
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

// --- Desktop Sidebar Navigation Component ---
const DesktopSidebar = () => {
  const location = useLocation();
  const navItems = [
    { path: '/', icon: Home, label: 'Hub' },
    { path: '/maps', icon: Map, label: 'Maps' },
    { path: '/concierge', icon: Bot, label: 'AI Assistant' },
    { path: '/ops', icon: RadioTower, label: 'Ops' },
  ];

  return (
    <aside className="desktop-sidebar-nav" style={{
      width: '260px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-glass)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem',
      gap: '4px',
      zIndex: 90,
      flexShrink: 0,
      position: 'relative'
    }}>

      {/* Venue Info */}
      <div style={{ padding: '0.75rem', marginBottom: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '2px' }}>Lusail Stadium</div>
        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>FIFA World Cup 2026</div>
      </div>

      <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '1.5px', padding: '0 0.75rem', marginBottom: '6px' }}>NAVIGATION</div>

      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.path} 
            to={item.path}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              textDecoration: 'none',
              color: isActive ? 'var(--accent-green)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(0, 255, 178, 0.06)' : 'transparent',
              border: `1px solid ${isActive ? 'rgba(0, 255, 178, 0.12)' : 'transparent'}`,
              borderRadius: '12px',
              padding: '11px 14px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              fontWeight: isActive ? '600' : '400',
              fontSize: '0.85rem',
              position: 'relative'
            }}
          >
            {isActive && <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '3px', height: '20px', borderRadius: '0 3px 3px 0', background: 'var(--accent-green)', boxShadow: '0 0 8px var(--accent-green)' }} />}
            <Icon size={18} />
            <span>{item.label}</span>
          </Link>
        )
      })}

      {/* Footer info */}
      <div style={{ marginTop: 'auto', padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.04)', fontSize: '0.6rem', color: 'var(--text-muted)' }}>
        VenueMind AI v2.0
      </div>
    </aside>
  );
};

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
const Header = ({ onLogout, currentUser }) => {
  const { isEmergency, broadcastMessage, setBroadcastMessage } = useEmergency();
  
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', flexDirection: 'column', width: '100%' }}>
      <header style={{
        padding: '0.85rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: isEmergency ? 'rgba(255, 0, 0, 0.8)' : 'var(--bg-secondary)',
        borderBottom: isEmergency ? '1px solid rgba(255,0,0,0.5)' : '1px solid var(--border-glass)',
        transition: 'background 0.5s',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="flex-row gap-2" style={{ alignItems: 'center' }}>
            <img src="/logo.jpg" alt="VenueMind Logo" style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid rgba(0, 200, 255, 0.3)' }} />
            <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '1px' }}>
              VENUE<span className="text-accent-yellow">MIND AI</span>
            </span>
          </div>
        </Link>
        
        <LiveClock />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {currentUser && currentUser.role !== 'fan' && (
            <button
              onClick={onLogout}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                padding: '4px 8px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              LOGOUT
            </button>
          )}
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
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="11" r="5" fill={currentUser?.role !== 'fan' ? 'var(--accent-yellow)' : 'var(--accent-green)'} opacity="0.8"/>
              <ellipse cx="14" cy="22" rx="8" ry="5" fill={currentUser?.role !== 'fan' ? 'var(--accent-yellow)' : 'var(--accent-green)'} opacity="0.5"/>
            </svg>
          </div>
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
          <h1 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.8rem', fontWeight: '900', textTransform: 'uppercase' }}>Evacuate Now</h1>
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
             <span style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>GATE D (SOUTH)</span>
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
        style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'var(--text-primary)', padding: '10px 20px', borderRadius: '20px', fontSize: '0.8rem' }}>
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
const Custom404 = () => {
  const navigate = useNavigate();
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '6rem', margin: 0, color: 'var(--accent-yellow)', fontWeight: '900' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: '10px 0' }}>🛰️ Page Lost in Stadium Orbit</h2>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', maxWidth: '400px', marginBottom: '2rem' }}>
        The section or operational terminal you are looking for has been re-routed or is temporarily offline.
      </p>
      <button 
        onClick={() => navigate('/')} 
        style={{
          background: 'var(--accent-yellow)',
          color: '#000',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '25px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 5px 15px rgba(255,222,89,0.3)'
        }}
      >
        🛰️ Return to Command Hub
      </button>
    </div>
  );
};

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
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>INITIALIZING NODE...</span>
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
          <Route path="*" element={<Custom404 />} />
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
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999999,
      background: 'var(--bg-primary)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem'
    }}>
      {/* Minimal clean Spinner */}
      <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '2rem' }}>
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: '2px solid rgba(255, 255, 255, 0.05)',
          borderTopcolor: 'var(--text-primary)',
          animation: 'spin 0.8s linear infinite'
        }} />
        <img src="/logo.jpg" alt="VenueMind Logo" style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '46px', height: '46px', borderRadius: '10px', zIndex: 1
        }} />
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
        VENUE<span style={{ color: 'var(--accent-yellow)' }}>MIND AI</span>
      </div>
      <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '2px', marginBottom: '2rem' }}>FIFA WORLD CUP 2026</div>
      <div style={{ width: '100%', maxWidth: '360px', fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {logs.map((log, i) => (
          <div key={i} style={{ animation: 'slideUp 0.2s ease-out', opacity: 0.8 }}>&gt; {log}</div>
        ))}
        {logs.length < 5 && <div style={{ animation: 'pulse 0.5s infinite' }}>_</div>}
      </div>
    </div>
  );
};

const AppLayout = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onLogout={onLogout} currentUser={currentUser} />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', position: 'relative', width: '100%' }}>
        {currentUser?.role === 'fan' && <DesktopSidebar />}
        
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', minWidth: 0 }}>
          {currentUser?.role !== 'fan' ? (
            <React.Suspense fallback={
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid rgba(43,255,136,0.1)', borderTopColor: 'var(--accent-green)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              </div>
            }>
              <AuthorityDashboard user={currentUser} onLogout={onLogout} />
            </React.Suspense>
          ) : (
            <AnimatedRoutes />
          )}
        </main>
      </div>

      {currentUser?.role === 'fan' && <BottomNav />}

      {/* Root-level Fixed Floating AI Assistant Button (Locked to Viewport Side, does not scroll!) */}
      {currentUser?.role === 'fan' && (
        <button 
          onClick={() => navigate('/concierge')}
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '50px',
            height: '50px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-glass)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            zIndex: 99999,
            transition: 'transform 0.2s ease, border-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = 'var(--border-glass)';
          }}
        >
          <Bot color="var(--text-primary)" size={20} />
        </button>
      )}
    </div>
  );
};

function MainApp() {
  const [booting, setBooting] = useState(() => {
    if (typeof window !== 'undefined' && window.navigator) {
      const ua = window.navigator.userAgent.toLowerCase();
      const isBot = /bot|googlebot|crawler|spider|robot|crawling|seoptimer|chatgpt|perplexity|bingbot/i.test(ua);
      if (isBot) return false;
    }
    return true;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== 'undefined' && window.navigator) {
      const ua = window.navigator.userAgent.toLowerCase();
      const isBot = /bot|googlebot|crawler|spider|robot|crawling|seoptimer|chatgpt|perplexity|bingbot/i.test(ua);
      if (isBot) {
        return { role: 'fan', email: 'fan@venumind-ai.dev', id: 'FAN-SEO' };
      }
    }
    try {
      return JSON.parse(localStorage.getItem('venumind_user')) || null;
    } catch { return null; }
  });

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('venumind_user', JSON.stringify(user));
    } catch {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('venumind_user');
    } catch {}
  };

  return (
    <ErrorBoundary>
      <EmergencyProvider>
        {booting && <SplashSequence onComplete={() => setBooting(false)} />}
        
        {!booting && !currentUser ? (
          <React.Suspense fallback={
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1rem', background: '#050a14' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid rgba(43,255,136,0.1)', borderTopColor: 'var(--accent-green)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
          }>
            <Login onLoginSuccess={handleLoginSuccess} />
          </React.Suspense>
        ) : (
          !booting && (
            <Router>
              <div className="grid-bg"></div>

              <EmergencyOverlay />
              <AppLayout currentUser={currentUser} onLogout={handleLogout} />
            </Router>
          )
        )}
      </EmergencyProvider>
    </ErrorBoundary>
  );
}

export default MainApp;
