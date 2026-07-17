import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Bell, Brain, HelpCircle, LogOut, ArrowLeft, Check, CheckCircle2 } from 'lucide-react';
import { useEmergency } from '../EmergencyContext';

const Settings = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [precisionMode, setPrecisionMode] = useState(true);
  const [activeModel, setActiveModel] = useState('Neural Core V4.2');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTogglePrecision = () => {
    setPrecisionMode(prev => {
      const next = !prev;
      showToast(next ? 'Enhanced Precision Mode Enabled' : 'Precision Mode Disabled');
      return next;
    });
  };

  const handleModelChange = () => {
    const models = ['Neural Core V4.2', 'Gemini 1.5 Pro', 'Gemini 1.5 Flash', 'Offline Rule Engine'];
    const currentIndex = models.indexOf(activeModel);
    const nextIndex = (currentIndex + 1) % models.length;
    setActiveModel(models[nextIndex]);
    showToast(`AI Model switched to ${models[nextIndex]}`);
  };

  return (
    <div style={{ padding: '1.5rem', paddingBottom: '120px', zIndex: 1, position: 'relative', minHeight: '100vh' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '380px',
          background: 'var(--text-primary)',
          color: 'var(--bg-primary)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'pageFadeIn 0.2s ease-out'
        }}>
          <CheckCircle2 size={16} />
          <span style={{ fontWeight: '600', fontSize: '0.82rem' }}>{toastMessage}</span>
        </div>
      )}

      {/* Header Navigation */}
      <div className="flex-row gap-4" style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate(-1)} 
          className="btn-ghost" 
          style={{ padding: '8px', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Go back"
        >
          <ArrowLeft size={16} />
        </button>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>System Settings</h2>
      </div>

      {/* Profile Section */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', width: '84px', height: '84px', marginBottom: '1rem' }}>
          <div style={{
            position: 'absolute', inset: '-3px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-green))',
            opacity: 0.15
          }} />
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfsDSiSOGyhjoSKPOaHRFJt4XhDQky9aeY3wPSViF_4_sb-oKVJipWQkfDNPFNCjnzWMVxZyQEoCiRTUpxOvYiH1IGyZCimHrSbeFFCGo2gpHiE5y7pErNgJZQEkPVHeSHQ6ZZ-i0Df7c370ExAb4A2NeJjxMOb9qVfLiIq3Qm763rnDhX5RNe1MpaTtT9dAu2qunoYeDGDnolbEYIRgY3sp3dFkgdSazJmgqcknc3AMYkD9HHzme7U8nJLh0zXUUeOFFD8M7H-Zg" 
            alt="Alex Thorne" 
            style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-glass)' }}
          />
          <div style={{
            position: 'absolute',
            bottom: '2px',
            right: '2px',
            background: 'var(--accent-blue)',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--bg-secondary)'
          }}>
            <Check size={10} color="var(--text-primary)" strokeWidth={3} />
          </div>
        </div>

        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: '700' }}>Alex Thorne</h3>
        <span style={{
          fontSize: '0.62rem',
          fontWeight: '600',
          letterSpacing: '1px',
          color: 'var(--accent-blue)',
          background: 'var(--accent-blue-dim)',
          padding: '2px 8px',
          borderRadius: '9999px',
          textTransform: 'uppercase'
        }}>
          Premium Member
        </span>
      </div>

      {/* Enhanced Precision Mode Toggle */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1, paddingRight: '1rem' }}>
          <h4 style={{ margin: '0 0 2px 0', fontSize: '0.9rem', fontWeight: '600' }}>Enhanced Precision Mode</h4>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Enables high-fidelity neural processing for complex analytical tasks.
          </p>
        </div>
        
        <button 
          onClick={handleTogglePrecision}
          aria-label="Enhanced Precision Mode"
          style={{
            width: '44px',
            height: '24px',
            borderRadius: '9999px',
            background: precisionMode ? 'var(--accent-blue)' : 'var(--border-glass)',
            border: 'none',
            position: 'relative',
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
        >
          <div style={{
            position: 'absolute',
            top: '2px',
            left: precisionMode ? '22px' : '2px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'left 0.2s ease'
          }} />
        </button>
      </div>

      {/* Settings Navigation List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="section-label" style={{ paddingLeft: '4px' }}>Configuration</div>

        {/* Account Info Button */}
        <button 
          onClick={() => showToast('Account Settings under verification')}
          className="btn-ghost" 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', width: '100%', border: '1px solid var(--border-glass)' }}
        >
          <div className="flex-row gap-3">
            <User size={16} color="var(--accent-blue)" />
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Account Details</span>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>➜</span>
        </button>

        {/* Privacy Info Button */}
        <button 
          onClick={() => showToast('Privacy Settings are fully managed')}
          className="btn-ghost" 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', width: '100%', border: '1px solid var(--border-glass)' }}
        >
          <div className="flex-row gap-3">
            <Lock size={16} color="var(--accent-blue)" />
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Privacy & Security</span>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>➜</span>
        </button>

        {/* Notifications Button */}
        <button 
          onClick={() => showToast('Notification Preferences loaded')}
          className="btn-ghost" 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', width: '100%', border: '1px solid var(--border-glass)' }}
        >
          <div className="flex-row gap-3">
            <Bell size={16} color="var(--accent-blue)" />
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Notifications Settings</span>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>➜</span>
        </button>

        {/* AI Model Selection */}
        <button 
          onClick={handleModelChange}
          className="btn-ghost" 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', width: '100%', border: '1px solid var(--border-glass)' }}
        >
          <div className="flex-row gap-3">
            <Brain size={16} color="var(--accent-purple)" />
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block' }}>AI Model Selection</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', fontWeight: '600' }}>{activeModel}</span>
            </div>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>➜</span>
        </button>

        {/* Help & Support */}
        <button 
          onClick={() => showToast('Opening Support Desk...')}
          className="btn-ghost" 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', width: '100%', border: '1px solid var(--border-glass)' }}
        >
          <div className="flex-row gap-3">
            <HelpCircle size={16} color="var(--accent-blue)" />
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Help & Support</span>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>➜</span>
        </button>

        {/* Logout Button */}
        {onLogout && (
          <button 
            onClick={onLogout}
            className="btn-ghost" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px 14px', 
              width: '100%', 
              borderColor: 'rgba(220, 38, 38, 0.15)',
              background: 'rgba(220, 38, 38, 0.02)',
              color: 'var(--accent-red)',
              marginTop: '1rem' 
            }}
          >
            <LogOut size={16} color="var(--accent-red)" />
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Log Out</span>
          </button>
        )}
      </div>

      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.68rem', marginTop: '3rem', lineHeight: '1.4' }}>
        Version 2.4.1 (Stable Build)<br/>
        © 2026 VenuMind Intelligence Corp.
      </div>

    </div>
  );
};

export default Settings;
