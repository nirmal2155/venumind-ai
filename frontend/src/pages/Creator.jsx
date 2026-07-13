import React, { useState, useRef } from 'react';
import { Upload, Cpu, FileText, Music, Play, RefreshCw, Sparkles, Download, CheckCircle, AlertCircle, Trash2, Film, Video, Sliders, Volume2 } from 'lucide-react';

const Creator = () => {
  // Wizard Steps: 'upload' | 'script' | 'render'
  const [activeStep, setActiveStep] = useState('upload');

  // Step 1: Upload & Train States
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingLogs, setTrainingLogs] = useState([]);
  const [lossData, setLossData] = useState([]);
  const [accData, setAccData] = useState([]);
  const [modelTrained, setModelTrained] = useState(false);

  // Step 2: Script Generation States
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('Reels');
  const [tone, setTone] = useState('Energetic');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [generatedScript, setGeneratedScript] = useState(null);
  const [scriptError, setScriptError] = useState(null);

  // Step 3: Video Render States
  const [selectedMusic, setSelectedMusic] = useState('hype-beat');
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);
  const [compileLog, setCompileLog] = useState('');
  const [videoData, setVideoData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState('');

  const videoRef = useRef(null);

  // Auto-fill training files sample data
  const handleAutoFill = () => {
    const samples = [];
    // 15 video samples
    for (let i = 1; i <= 15; i++) {
      samples.push({
        id: `vid-${i}`,
        name: `avatar_ref_source_0${i}.mp4`,
        size: `${(2.4 + Math.random() * 5).toFixed(1)} MB`,
        type: 'video/mp4',
        duration: '0:05'
      });
    }
    // 10 audio samples
    for (let i = 1; i <= 10; i++) {
      samples.push({
        id: `aud-${i}`,
        name: `voice_profile_sample_0${i}.wav`,
        size: `${(400 + Math.random() * 800).toFixed(0)} KB`,
        type: 'audio/wav',
        duration: '0:12'
      });
    }
    setUploadedFiles(samples);
  };

  // Simulate training process
  const handleStartTraining = async () => {
    if (uploadedFiles.length < 5) {
      alert("Please upload at least 5 training files (or use Auto-Fill) to train the model clone.");
      return;
    }

    setIsTraining(true);
    setTrainingProgress(0);
    setTrainingLogs([]);
    setLossData([]);
    setAccData([]);

    // Call backend to get metrics
    try {
      const response = await fetch('/api/creator/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileCount: uploadedFiles.length })
      });
      const data = await response.json();
      
      if (data.success) {
        setSessionId(data.sessionId);
        setTrainingMetrics(data.metrics);
        
        let progress = 0;
        const totalLogs = data.logs;
        const intervalTime = 80; // 8 seconds total training duration

        const interval = setInterval(() => {
          progress += 1;
          setTrainingProgress(progress);

          // Add logs sequentially based on progress percentage
          const logIdx = Math.floor((progress / 100) * totalLogs.length);
          if (totalLogs[logIdx] && !trainingLogs.includes(totalLogs[logIdx])) {
            setTrainingLogs(prev => [...prev, totalLogs[logIdx]]);
            setCurrentLog(totalLogs[logIdx]);
          }

          // Generate simulated Loss & Accuracy points for SVG Charts
          const currentLoss = (0.9 - (progress / 100) * (0.9 - parseFloat(data.metrics.finalLoss)) + (Math.random() - 0.5) * 0.03).toFixed(3);
          const currentAcc = (50 + (progress / 100) * (parseFloat(data.metrics.accuracy) - 50) + (Math.random() - 0.5) * 1.5).toFixed(1);

          if (progress % 5 === 0 || progress === 1) {
            setLossData(prev => [...prev, { x: progress, y: parseFloat(currentLoss) }]);
            setAccData(prev => [...prev, { x: progress, y: parseFloat(currentAcc) }]);
          }

          if (progress >= 100) {
            clearInterval(interval);
            setIsTraining(false);
            setModelTrained(true);
          }
        }, intervalTime);
      }
    } catch (e) {
      console.error(e);
      setIsTraining(false);
    }
  };

  // Generate Script
  const handleGenerateScript = async () => {
    if (!topic) return;
    setIsGeneratingScript(true);
    setScriptError(null);

    try {
      const res = await fetch('/api/creator/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, tone })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedScript(data.script);
      } else {
        setScriptError(data.error || "Failed to generate script.");
      }
    } catch (error) {
      console.error("Script generation error:", error);
      setScriptError("Server error. Please verify backend is running.");
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // Compile Video
  const handleCompileVideo = async () => {
    if (!generatedScript) return;
    setIsCompiling(true);
    setCompileProgress(0);
    setVideoData(null);
    setIsPlaying(false);

    const steps = [
      "Cloning speaker vocal patterns...",
      "Generating high-fidelity speech WAV track...",
      "Extracting lip-sync keypoints for base avatar...",
      "Rendering video frames via Wav2Lip core...",
      "Applying audio-video synchronization...",
      "Burning subtitles and background track...",
      "Exporting final 9:16 high-definition reel..."
    ];

    const interval = setInterval(() => {
      setCompileProgress(prev => {
        const next = prev + 2;
        
        // Update logs sequentially
        const logIdx = Math.floor((next / 100) * steps.length);
        if (steps[logIdx] && steps[logIdx] !== compileLog) {
          setCompileLog(steps[logIdx]);
        }

        if (next >= 100) {
          clearInterval(interval);
          finishCompilation();
        }
        return next;
      });
    }, 80);
  };

  const finishCompilation = async () => {
    try {
      const res = await fetch('/api/creator/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: generatedScript })
      });
      const data = await res.json();
      if (data.success) {
        setVideoData(data);
        setIsCompiling(false);
      }
    } catch (e) {
      console.error(e);
      setIsCompiling(false);
    }
  };

  // Sync subtitles with video player
  const handleVideoTimeUpdate = () => {
    if (!videoRef.current || !videoData) return;
    const currentMs = videoRef.current.currentTime * 1000;
    
    // Find active subtitle
    const activeSub = videoData.subtitles.find(sub => currentMs >= sub.start && currentMs <= sub.end);
    if (activeSub) {
      setCurrentSubtitle(activeSub.text);
    } else {
      setCurrentSubtitle('');
    }
  };

  // Handle Play/Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.error("Video play failed:", err));
    }
  };

  return (
    <div style={{ padding: '1.5rem', paddingBottom: '120px', background: '#030712', minHeight: '100vh', color: '#fff' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ background: 'rgba(0,255,178,0.12)', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-green)' }}>
            <Film size={28} className="text-accent-green" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontWeight: '900', fontSize: '1.8rem', background: 'linear-gradient(135deg, #fff 60%, rgba(255,255,255,0.4))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI Reels <span style={{ color: 'var(--accent-green)' }}>Creator</span>
            </h1>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
          Train custom avatars & voices, generate engagement scripts with Gemini, and render auto-captioned reels in seconds.
        </p>
      </div>

      {/* Progress Steps Header */}
      <div className="glass-card" role="tablist" aria-label="Creator Step Progress" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 1.5rem', marginBottom: '2rem', gap: '10px', overflowX: 'auto' }}>
        {[
          { key: 'upload', label: '1. Voice & Face Training', active: activeStep === 'upload', done: modelTrained },
          { key: 'script', label: '2. Script Engine', active: activeStep === 'script', done: generatedScript },
          { key: 'render', label: '3. Reel Renderer', active: activeStep === 'render', done: videoData }
        ].map(step => (
          <button
            key={step.key}
            role="tab"
            aria-selected={step.active}
            aria-label={step.label}
            onClick={() => {
              if (step.key === 'script' && !modelTrained) {
                alert("Please train the AI Model Clone first (Step 1).");
                return;
              }
              if (step.key === 'render' && !generatedScript) {
                alert("Please write/generate a Script first (Step 2).");
                return;
              }
              setActiveStep(step.key);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: step.active ? 'var(--accent-green)' : step.done ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              borderBottom: step.active ? '2px solid var(--accent-green)' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'all 0.2s'
            }}
          >
            {step.done ? <CheckCircle size={16} color="var(--accent-green)" /> : <span style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: step.active ? 'var(--accent-green-dim)' : 'rgba(255,255,255,0.05)',
              border: step.active ? '1px solid var(--accent-green)' : '1px solid var(--border-glass)',
              fontSize: '0.7rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: step.active ? 'var(--accent-green)' : 'inherit'
            }}>{step.key === 'upload' ? '1' : step.key === 'script' ? '2' : '3'}</span>}
            {step.label}
          </button>
        ))}
      </div>

      {/* STEP 1: UPLOAD & TRAIN */}
      {activeStep === 'upload' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          
          {/* FIFA 2026 Operations & Engagement Alignment */}
          <div className="cyber-glow-border" style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 178, 0.05), rgba(0, 0, 0, 0.4))',
            padding: '1.25rem',
            borderRadius: '16px',
            border: '1px solid rgba(0, 255, 178, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 255, 178, 0.03)'
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--accent-green)', letterSpacing: '0.5px' }}>
              🏟️ FIFA WORLD CUP 2026 — OPERATIONAL USE CASES
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '3px' }}>📢 Multi-lingual Fan Updates</strong>
                Clone stadium announcers' voices to instantly generate daily matchday reels, shuttle timings, and weather alerts in 8 tournament languages.
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '3px' }}>👷 Volunteer Briefing Hub</strong>
                Empower stadium ops managers to compile customized daily safety and crowd control guidelines as high-impact briefing videos.
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '3px' }}>🎟️ Fan Souvenirs Generator</strong>
                Let spectators clone their voice and create personalized tournament journey postcards to share on social media.
              </div>
            </div>
          </div>
          
          <div className="glass-card flex-col gap-4">
            <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Step 1: Upload Reference Material</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '4px 0 0 0' }}>
                Upload 20 to 30 short videos (or audio clips) of a target person's speech and face to align acoustic parameters and facial mesh landmarks.
              </p>
            </div>

            {/* Drag & Drop Simulation */}
            <div 
              style={{
                border: '2px dashed var(--border-glass)',
                borderRadius: '12px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                background: 'rgba(0,0,0,0.15)',
                cursor: 'pointer',
                transition: 'border-color 0.2s'
              }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                handleAutoFill();
              }}
              onClick={handleAutoFill}
            >
              <Upload size={40} className="text-accent-green" style={{ margin: '0 auto 12px auto', opacity: 0.8 }} />
              <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem' }}>Drag & Drop Video or Audio reference files here</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', margin: '0 0 12px 0' }}>Supports MP4, WAV, MP3 (Max 50MB per file)</p>
              <button className="btn-ghost" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
                Browse Files
              </button>
              <span style={{ margin: '0 10px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>or</span>
              <button 
                type="button"
                className="btn-primary" 
                style={{ fontSize: '0.75rem', padding: '6px 14px', background: 'rgba(0, 255, 178, 0.2)', color: 'var(--accent-green)', border: '1px solid var(--accent-green)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAutoFill();
                }}
              >
                Auto-Fill 25 Mock Clips
              </button>
            </div>

            {/* Uploaded Files Count & Grid */}
            {uploadedFiles.length > 0 && (
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Uploaded Files ({uploadedFiles.length})</span>
                  <button 
                    onClick={() => setUploadedFiles([])}
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Trash2 size={12} /> Clear All
                  </button>
                </div>
                <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '4px' }}>
                  {uploadedFiles.map(file => (
                    <div key={file.id} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                        {file.type.startsWith('video') ? <Video size={13} color="var(--accent-blue)" /> : <Volume2 size={13} color="var(--accent-purple)" />}
                        <span style={{ fontSize: '0.75rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{file.name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem', color: 'var(--text-secondary)', alignItems: 'center' }}>
                        <span>{file.size}</span>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-muted)' }}></span>
                        <span>{file.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Model Train Button */}
            {!modelTrained && !isTraining && (
              <button 
                onClick={handleStartTraining}
                disabled={uploadedFiles.length === 0}
                className="btn-primary flex-row gap-2 justify-center"
                style={{ width: '100%', opacity: uploadedFiles.length === 0 ? 0.5 : 1 }}
              >
                <Cpu size={18} /> Initialize Voice & Face Training Pipeline
              </button>
            )}

            {/* Training Status Arena */}
            {(isTraining || modelTrained) && (
              <div className="cyber-glow-border highlight-green" style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Cpu size={16} className={isTraining ? "pulse-neon-green" : ""} style={{ color: 'var(--accent-green)' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--accent-green)' }}>
                      {isTraining ? `MODEL_TRAINING: IN_PROGRESS (${trainingProgress}%)` : `MODEL_STATUS: READY (DEPLOYED)`}
                    </span>
                  </div>
                  {modelTrained && !isTraining && (
                    <span style={{ fontSize: '0.7rem', background: 'var(--accent-green-dim)', color: 'var(--accent-green)', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                      ACTIVE CLONE
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div style={{ background: 'rgba(255,255,255,0.05)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${trainingProgress}%`, background: 'var(--accent-green)', height: '100%', transition: 'width 0.1s ease', boxShadow: '0 0 10px var(--accent-green)' }}></div>
                </div>

                {/* Training metrics boxes */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.4)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>EPOCH PROGRESS</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '900', fontFamily: 'monospace', color: 'var(--text-primary)', marginTop: '2px' }}>
                      {isTraining ? `${Math.min(100, trainingProgress)}/100` : '100/100'}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.4)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>TRAINING LOSS</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '900', fontFamily: 'monospace', color: 'var(--accent-yellow)', marginTop: '2px' }}>
                      {lossData.length > 0 ? lossData[lossData.length - 1].y.toFixed(3) : '0.000'}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.4)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>SPEECH ACCURACY</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '900', fontFamily: 'monospace', color: 'var(--accent-green)', marginTop: '2px' }}>
                      {accData.length > 0 ? `${accData[accData.length - 1].y}%` : '0.0%'}
                    </div>
                  </div>
                </div>

                {/* Chart graphics SVG */}
                {(lossData.length > 0 || accData.length > 0) && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
                    
                    {/* SVG Chart Loss */}
                    <div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>LOSS DECAY CURVE</span>
                        <span style={{ fontFamily: 'monospace' }}>y=Loss</span>
                      </div>
                      <svg viewBox="0 0 100 50" style={{ width: '100%', height: '55px', borderBottom: '1px solid rgba(255,255,255,0.1)', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                        <path
                          d={lossData.reduce((acc, pt, idx) => {
                            const scaledX = pt.x;
                            const scaledY = 48 - (pt.y * 42); 
                            return `${acc} ${idx === 0 ? 'M' : 'L'} ${scaledX} ${scaledY}`;
                          }, '')}
                          fill="none"
                          stroke="var(--accent-yellow)"
                          strokeWidth="1.5"
                        />
                        {lossData.length > 1 && (
                          <path
                            d={`${lossData.reduce((acc, pt, idx) => {
                              const scaledX = pt.x;
                              const scaledY = 48 - (pt.y * 42); 
                              return `${acc} ${idx === 0 ? 'M' : 'L'} ${scaledX} ${scaledY}`;
                            }, '')} L 100 48 L 0 48 Z`}
                            fill="rgba(255, 214, 10, 0.05)"
                          />
                        )}
                      </svg>
                    </div>

                    {/* SVG Chart Accuracy */}
                    <div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>LIP SYNC FIT RATE</span>
                        <span style={{ fontFamily: 'monospace' }}>y=Acc%</span>
                      </div>
                      <svg viewBox="0 0 100 50" style={{ width: '100%', height: '55px', borderBottom: '1px solid rgba(255,255,255,0.1)', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                        <path
                          d={accData.reduce((acc, pt, idx) => {
                            const scaledX = pt.x;
                            const scaledY = 48 - ((pt.y - 45) / 55 * 42);
                            return `${acc} ${idx === 0 ? 'M' : 'L'} ${scaledX} ${scaledY}`;
                          }, '')}
                          fill="none"
                          stroke="var(--accent-green)"
                          strokeWidth="1.5"
                        />
                        {accData.length > 1 && (
                          <path
                            d={`${accData.reduce((acc, pt, idx) => {
                              const scaledX = pt.x;
                              const scaledY = 48 - ((pt.y - 45) / 55 * 42);
                              return `${acc} ${idx === 0 ? 'M' : 'L'} ${scaledX} ${scaledY}`;
                            }, '')} L 100 48 L 0 48 Z`}
                            fill="rgba(0, 255, 178, 0.05)"
                          />
                        )}
                      </svg>
                    </div>
                  </div>
                )}

                {/* Console Logs */}
                <div style={{ background: '#02050b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', padding: '8px 12px', height: '90px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.7rem', color: '#88a3cf' }}>
                  {trainingLogs.map((log, index) => (
                    <div key={index} style={{ marginBottom: '4px', color: index === trainingLogs.length - 1 ? 'var(--accent-green)' : 'inherit' }}>
                      &gt; {log}
                    </div>
                  ))}
                  {isTraining && <div className="pulse-fast">&gt; Executing neural alignment epoch calculations...</div>}
                </div>
              </div>
            )}

            {/* Proceed to Step 2 */}
            {modelTrained && !isTraining && (
              <button 
                onClick={() => setActiveStep('script')}
                className="btn-primary flex-row gap-2 justify-center"
                style={{ width: '100%', background: 'var(--accent-green)' }}
              >
                Model Trained Successfully! Proceed to Script Engine <Sparkles size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: SCRIPT GENERATOR */}
      {activeStep === 'script' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          
          <div className="glass-card flex-col gap-4">
            <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Step 2: Generate Script with Gemini</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '4px 0 0 0' }}>
                Provide a topic, platform type, and conversational tone. The Gemini language model will structure high-engagement hooks and CTA templates tailored for voice replication.
              </p>
            </div>

            {/* Script Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label htmlFor="topic-input" style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>VIDEO TOPIC / CONTENT IDEA</label>
                <input 
                  id="topic-input"
                  type="text" 
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g. Lusail Stadium street food tour, Gate B crowd rerouting guide, Top 3 World Cup facts"
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="platform-select" style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>PLATFORM</label>
                  <select
                    id="platform-select"
                    value={platform}
                    onChange={e => setPlatform(e.target.value)}
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  >
                    <option value="Reels">Instagram Reels</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube Shorts</option>
                    <option value="Briefing">Operational Briefing (Staff)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="tone-select" style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>SPEAKER TONE</label>
                  <select
                    id="tone-select"
                    value={tone}
                    onChange={e => setTone(e.target.value)}
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  >
                    <option value="Energetic">Energetic / Hype</option>
                    <option value="Professional">Professional / Clear</option>
                    <option value="Casual">Casual / Friendly</option>
                    <option value="Urgent">Urgent / Informative</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={handleGenerateScript}
              disabled={!topic || isGeneratingScript}
              className="btn-primary flex-row gap-2 justify-center"
              style={{ width: '100%', opacity: (!topic || isGeneratingScript) ? 0.5 : 1, background: 'var(--accent-blue)' }}
            >
              {isGeneratingScript ? (
                <>
                  <RefreshCw className="spin" size={16} /> Generating Script with Gemini...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Generate AI Script Blueprint
                </>
              )}
            </button>

            {scriptError && (
              <div style={{ display: 'flex', gap: '8px', background: 'var(--accent-red-dim)', padding: '10px', borderRadius: '8px', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', fontSize: '0.8rem' }}>
                <AlertCircle size={16} /> <span>{scriptError}</span>
              </div>
            )}

            {/* Display script textareas */}
            {generatedScript && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(0,0,0,0.15)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={16} color="var(--accent-green)" /> Generated Script Editor
                </h4>
                
                {/* Hook Text Box */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--accent-green)', letterSpacing: '1px', fontWeight: 'bold' }}>HOOK (0-3s)</span>
                  <input
                    type="text"
                    value={generatedScript.hook}
                    onChange={e => setGeneratedScript(prev => ({ ...prev, hook: e.target.value }))}
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>

                {/* Body Text Box */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--accent-blue)', letterSpacing: '1px', fontWeight: 'bold' }}>BODY CONTENT (3-15s)</span>
                  <textarea
                    value={generatedScript.body}
                    rows={3}
                    onChange={e => setGeneratedScript(prev => ({ ...prev, body: e.target.value }))}
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem', resize: 'vertical' }}
                  />
                </div>

                {/* CTA Text Box */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--accent-yellow)', letterSpacing: '1px', fontWeight: 'bold' }}>CALL TO ACTION (15-20s)</span>
                  <input
                    type="text"
                    value={generatedScript.cta}
                    onChange={e => setGeneratedScript(prev => ({ ...prev, cta: e.target.value }))}
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>

                {/* B-Roll Suggestions list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '1px', fontWeight: 'bold' }}>SUGGESTED B-ROLL / GRAPHICS</span>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {generatedScript.broll && generatedScript.broll.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Proceed button */}
                <button
                  onClick={() => setActiveStep('render')}
                  className="btn-primary flex-row gap-2 justify-center"
                  style={{ width: '100%', background: 'var(--accent-green)', marginTop: '8px' }}
                >
                  Confirm Script & Render Video <Sparkles size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: RENDER & PLAY */}
      {activeStep === 'render' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Render Controls Card */}
            <div className="glass-card flex-col gap-4">
              <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Step 3: Render AI Lip-Sync Reel</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '4px 0 0 0' }}>
                  Select a background score, then execute the rendering model to compile cloned voice synthesis and avatar movements.
                </p>
              </div>

              {/* Music Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label htmlFor="music-select" style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Music size={14} /> BACKGROUND TRACK
                </label>
                <select
                  id="music-select"
                  value={selectedMusic}
                  onChange={e => setSelectedMusic(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                >
                  <option value="hype-beat">FIFA Hype Beat (High Energy)</option>
                  <option value="corporate-tech">Tech Pulse (Professional & Calm)</option>
                  <option value="stadium-crowd">Ambient Crowd Cheers + Lo-fi</option>
                  <option value="none">No Background Music (Speech Only)</option>
                </select>
              </div>

              {/* Render Button */}
              {!videoData && !isCompiling && (
                <button
                  onClick={handleCompileVideo}
                  className="btn-primary flex-row gap-2 justify-center"
                  style={{ width: '100%', background: 'var(--accent-green)' }}
                >
                  <Film size={18} /> Compile & Render Final AI Reel
                </button>
              )}

              {/* Compiling Status */}
              {isCompiling && (
                <div className="cyber-glow-border" style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-green)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--accent-green)', marginBottom: '8px' }}>
                    <span>RENDERING_AVATAR...</span>
                    <span>{compileProgress}%</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', height: '6px', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                    <div style={{ width: `${compileProgress}%`, background: 'var(--accent-green)', height: '100%', transition: 'width 0.1s' }}></div>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                    &gt; {compileLog}
                  </div>
                </div>
              )}

              {/* Success Notification & Download */}
              {videoData && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '8px', background: 'var(--accent-green-dim)', padding: '10px', borderRadius: '8px', border: '1px solid var(--accent-green)', color: 'var(--accent-green)', fontSize: '0.8rem', alignItems: 'center' }}>
                    <CheckCircle size={16} /> <span>Reel compiled successfully at {videoData.durationSeconds}s duration!</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <a 
                      href={videoData.videoUrl} 
                      download="ai_avatar_reel.mp4" 
                      className="btn-primary flex-row gap-2 justify-center"
                      style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}
                    >
                      <Download size={16} /> Download Video
                    </a>
                    <button 
                      onClick={() => {
                        setVideoData(null);
                        handleCompileVideo();
                      }}
                      className="btn-ghost"
                      style={{ padding: '10px 14px' }}
                    >
                      Re-Render
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Script Reference info */}
            {generatedScript && (
              <div className="glass-card flex-col gap-2" style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.1)' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>ACTIVE SCRIPT TRANSCRIPT:</span>
                <p style={{ margin: 0, color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: '1.4' }}>
                  "{generatedScript.hook} {generatedScript.body} {generatedScript.cta}"
                </p>
              </div>
            )}
          </div>

          {/* Interactive Phone/Reel Preview Player */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1.5rem' }}>
            <div style={{
              width: '300px',
              height: '533px', // 9:16 Ratio
              background: '#0c0f1d',
              borderRadius: '24px',
              border: '6px solid #1f2538',
              boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 30px rgba(0, 255, 178, 0.05)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              
              {/* Dynamic Video Player */}
              {videoData ? (
                <>
                  <video
                    ref={videoRef}
                    src={videoData.videoUrl}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loop
                    playsInline
                    onTimeUpdate={handleVideoTimeUpdate}
                    onClick={togglePlay}
                  />
                  
                  {/* Subtle Sci-Fi Overlay Mesh */}
                  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.5))', zIndex: 1 }} />
                  
                  {/* Subtitle Caption Overlay */}
                  {currentSubtitle && (
                    <div style={{
                      position: 'absolute',
                      bottom: '80px',
                      left: '10px',
                      right: '10px',
                      zIndex: 2,
                      textAlign: 'center',
                      pointerEvents: 'none',
                    }}>
                      <span style={{
                        background: 'rgba(0, 0, 0, 0.75)',
                        color: 'var(--accent-yellow)',
                        fontSize: '1.1rem',
                        fontWeight: '900',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        display: 'inline-block',
                        lineHeight: '1.3',
                        textShadow: '2px 2px 0px #000',
                        border: '1px solid rgba(255,214,10,0.2)'
                      }}>
                        {currentSubtitle}
                      </span>
                    </div>
                  )}

                  {/* Play/Pause Button Overlay */}
                  {!isPlaying && (
                    <button 
                      onClick={togglePlay}
                      style={{
                        position: 'absolute',
                        zIndex: 3,
                        background: 'rgba(0, 255, 178, 0.8)',
                        border: 'none',
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#000',
                        cursor: 'pointer',
                        boxShadow: '0 0 20px rgba(0,255,178,0.4)',
                        transition: 'transform 0.15s'
                      }}
                    >
                      <Play size={24} fill="#000" style={{ marginLeft: '4px' }} />
                    </button>
                  )}

                  {/* Audio Speaker Watermark */}
                  <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 2, display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Sliders size={12} color="var(--accent-green)" />
                    <span style={{ fontSize: '0.6rem', fontWeight: 'bold', color: 'var(--accent-green)', fontFamily: 'monospace' }}>CLONED_AUDIO</span>
                  </div>
                </>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <Video size={48} color="var(--text-muted)" style={{ opacity: 0.5 }} />
                  <div>
                    <h5 style={{ color: 'var(--text-secondary)', margin: '0 0 4px 0', fontSize: '0.85rem' }}>No Video Rendered Yet</h5>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', margin: 0 }}>
                      Complete Step 1 (Training) and Step 2 (Script), then click "Compile" to generate the video stream.
                    </p>
                  </div>
                </div>
              )}

              {/* Decorative phone notch */}
              <div style={{ position: 'absolute', top: 0, width: '120px', height: '18px', background: '#1f2538', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', zIndex: 10 }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Creator;
