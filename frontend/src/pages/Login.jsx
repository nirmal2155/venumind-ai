import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [loginType, setLoginType] = useState('fan'); // 'fan' or 'authority'
  const [authorityId, setAuthorityId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (loginType === 'fan') {
      onLoginSuccess({ role: 'fan', email: 'fan@fifaworldcup.com' });
      return;
    }

    // Authority Login Validation
    if (!authorityId.trim() || !email.trim() || !password.trim()) {
      setError('⚠️ All credentials are required for authority access.');
      return;
    }

    if (password.length < 6) {
      setError('⚠️ Security violation: password must be at least 6 characters.');
      return;
    }

    // Role-based ID matching
    const upperId = authorityId.trim().toUpperCase();
    let detectedRole = '';

    if (upperId === 'COLL-2026') {
      detectedRole = 'collector';
    } else if (upperId === 'POLICE-2026') {
      detectedRole = 'police';
    } else if (upperId === 'ORG-2026') {
      detectedRole = 'organizer';
    } else if (upperId === 'GOVT-2026') {
      detectedRole = 'government';
    } else {
      setError('❌ Access Denied: Invalid Authority ID. Verified credentials only.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        role: detectedRole,
        email: email.trim(),
        id: upperId
      });
    }, 1200);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      background: 'radial-gradient(ellipse at center, #0a1120 0%, #050810 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background grids */}
      <div className="grid-bg" style={{ opacity: 0.1 }}></div>

      <div style={{
        maxWidth: '420px',
        width: '100%',
        background: 'linear-gradient(135deg, rgba(13,18,32,0.9), rgba(5,8,16,0.95))',
        border: '1px solid rgba(0, 200, 255, 0.2)',
        borderRadius: '24px',
        padding: '2.5rem 2rem',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(0,200,255,0.05)',
        zIndex: 10
      }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(0, 200, 255, 0.3)',
            marginBottom: '1rem',
            boxShadow: '0 0 15px rgba(0,200,255,0.2)'
          }}>
            <img src="/logo.jpg" alt="VenueMind Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800', letterSpacing: '0.5px' }}>
            VENUE<span style={{ color: '#FFD60A' }}>MIND AI</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
            FIFA World Cup 2026 Operations Portal
          </p>
        </div>

        {/* Tab Selector */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '1.5rem'
        }}>
          <button
            onClick={() => { setLoginType('fan'); setError(''); }}
            style={{
              flex: 1,
              background: loginType === 'fan' ? 'rgba(0,200,255,0.1)' : 'transparent',
              border: 'none',
              color: loginType === 'fan' ? '#00C8FF' : 'var(--text-secondary)',
              padding: '8px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            ⚽ General Fan Portal
          </button>
          <button
            onClick={() => { setLoginType('authority'); setError(''); }}
            style={{
              flex: 1,
              background: loginType === 'authority' ? 'rgba(255,214,10,0.1)' : 'transparent',
              border: 'none',
              color: loginType === 'authority' ? '#FFD60A' : 'var(--text-secondary)',
              padding: '8px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            🛡️ Authority Control
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {loginType === 'authority' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>AUTHORITY ID</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 12px', gap: '10px' }}>
                <ShieldCheck size={16} color="#FFD60A" />
                <input
                  type="text"
                  placeholder="e.g. COLL-2026, POLICE-2026..."
                  value={authorityId}
                  onChange={(e) => setAuthorityId(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                />
              </div>
            </div>
          )}

          {loginType === 'authority' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>EMAIL ADDRESS</label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 12px', gap: '10px' }}>
                  <Mail size={16} color="rgba(255,255,255,0.4)" />
                  <input
                    type="email"
                    placeholder="authority@stadium.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>PASSPHRASE</label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 12px', gap: '10px' }}>
                  <Lock size={16} color="rgba(255,255,255,0.4)" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                  />
                </div>
              </div>
            </>
          )}

          {error && (
            <div style={{ background: 'rgba(255,75,75,0.08)', border: '1px solid #FF4B4B', color: '#FF4B4B', padding: '10px', borderRadius: '10px', fontSize: '0.8rem', lineHeight: '1.4' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '10px',
              padding: '12px',
              borderRadius: '12px',
              background: loginType === 'authority' ? 'var(--accent-yellow)' : 'var(--accent-green)',
              border: 'none',
              color: '#000',
              fontWeight: '900',
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: loginType === 'authority' ? '0 8px 24px rgba(255,214,10,0.2)' : '0 8px 24px rgba(0,255,178,0.2)'
            }}
          >
            {loading ? 'Authenticating Secure Node...' : loginType === 'authority' ? '🛡️ Login Authority Portal' : '⚽ Enter Stadium Portal'}
          </button>
        </form>
      </div>

      {/* Info footer */}
      <div style={{ marginTop: '2rem', textAlign: 'center', zIndex: 10 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
          SECURE PROTOCOL v2.4.0 — AES 256 ENCRYPTED GATEWAY
        </p>
      </div>
    </div>
  );
};

export default Login;
