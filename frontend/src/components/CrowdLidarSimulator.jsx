import React, { useEffect, useRef } from 'react';
import { useEmergency } from '../EmergencyContext';

/**
 * @component CrowdLidarSimulator
 * @description HTML5 Canvas real-time swarm intelligence particle crowd flow simulator.
 * Vector steering algorithms direct particles dynamically based on active gates
 * and emergency evacuation override signals.
 * @param {Object} props
 * @param {string} props.routeGate - Active navigation target gate
 */
const CrowdLidarSimulator = ({ routeGate }) => {
  const canvasRef = useRef(null);
  const { isEmergency } = useEmergency();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return; // Headless testing environment fallback (jsdom lacks canvas support)
    let animationFrameId;

    // Scale canvas pixels for high-DPI displays
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 300;
    const height = rect.height || 180;
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    // Gate Coordinate Hub mapping stadium spatial dimensions
    const gates = {
      'GATE A': { x: width * 0.25, y: height * 0.25 },
      'GATE B': { x: width * 0.75, y: height * 0.25 },
      'GATE C': { x: width * 0.75, y: height * 0.75 },
      'GATE D': { x: width * 0.5, y: height * 0.85 }
    };

    // Vector Crowd particles (100 independent units)
    const particles = [];
    for (let i = 0; i < 75; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.6,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 1.5 + 1.5
      });
    }

    let scanAngle = 0;

    const render = () => {
      if (!canvasRef.current) return;
      ctx.clearRect(0, 0, width, height);

      // 1. Grid matrix overlay background
      ctx.strokeStyle = 'rgba(0, 200, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 16;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Lusail Stadium bowl vector boundaries
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(width / 2, height / 2 - 5, width * 0.38, height * 0.32, 0, 0, Math.PI * 2);
      ctx.stroke();

      // 3. Dynamic Rerouting target gate calculation
      const currentTargetGate = isEmergency ? 'GATE D' : routeGate;
      const targetCoord = gates[currentTargetGate] || gates['GATE B'];

      // Render static & active gates
      Object.keys(gates).forEach(gateKey => {
        const isTarget = gateKey === currentTargetGate;
        const gate = gates[gateKey];
        
        ctx.fillStyle = isTarget ? (isEmergency ? '#FF4B4B' : 'var(--accent-green)') : 'rgba(255,255,255,0.2)';
        ctx.beginPath();
        ctx.arc(gate.x, gate.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Inflow gating glow rings
        if (isTarget) {
          ctx.strokeStyle = isEmergency ? 'rgba(255,75,75,0.3)' : 'rgba(0,255,178,0.3)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(gate.x, gate.y, 10 + Math.sin(Date.now() / 150) * 3, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '7px monospace';
        ctx.fillText(gateKey, gate.x - 14, gate.y - 8);
      });

      // 4. Update particle coordinates using vector steering dynamics
      particles.forEach(p => {
        const dx = targetCoord.x - p.x;
        const dy = targetCoord.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 8) {
          const speed = isEmergency ? 2.0 : 1.0;
          const targetVx = (dx / dist) * speed;
          const targetVy = (dy / dist) * speed;

          // Velocity interpolation weight (steering response)
          p.vx += (targetVx - p.vx) * 0.04;
          p.vy += (targetVy - p.vy) * 0.04;
        } else {
          // Re-spawn particle once reached target exit gateway to simulate loop flow
          p.x = Math.random() * width;
          p.y = Math.random() * height * 0.4;
          p.vx = (Math.random() - 0.5) * 1.5;
          p.vy = (Math.random() - 0.5) * 1.5;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Draw particle dot
        ctx.fillStyle = isEmergency ? '#FF4B4B' : 'var(--accent-blue)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. Radar Lidar Sweep
      ctx.fillStyle = isEmergency ? 'rgba(255, 75, 75, 0.02)' : 'rgba(0, 255, 178, 0.02)';
      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2 - 5);
      ctx.arc(
        width / 2,
        height / 2 - 5,
        Math.max(width, height),
        scanAngle,
        scanAngle + 0.18
      );
      ctx.closePath();
      ctx.fill();

      scanAngle = (scanAngle + 0.012) % (Math.PI * 2);

      // HUD info metrics overlays
      ctx.fillStyle = isEmergency ? '#FF4B4B' : 'rgba(255,255,255,0.7)';
      ctx.font = '8px monospace';
      ctx.fillText(`FLOW: ${isEmergency ? 'EVACUATING' : 'ACTIVE_ROUTING'}`, 8, 15);
      ctx.fillText(`NODES: ${particles.length} SPECTATORS`, 8, 24);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [routeGate, isEmergency]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%', display: 'block', background: '#050810' }} 
      />
    </div>
  );
};

export default CrowdLidarSimulator;
