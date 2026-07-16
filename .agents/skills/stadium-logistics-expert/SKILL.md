---
name: stadium-logistics-expert
description: Process real-time IoT RFID crowd-tracking gate logs, manage density bottlenecks, and coordinate stadium operations.
---

# Stadium Logistics Expert Skill

This skill outlines operational protocols and analytics algorithms for processing high-density RFID gate scans and managing spectator routing.

## 📊 Core Thresholds & KPIs
* **Green (Nominal):** < 70% gate capacity. Flow is fluid.
* **Yellow (Warning):** 70% - 85% gate capacity. Queue delays > 10 minutes. Pre-position standby volunteers.
* **Red (Critical):** > 85% gate capacity. Reroute incoming fans to adjacent gates and announce via voice guide.

## 🛠️ Mock Script: Real-Time IoT Gate Analytics Parser

```javascript
/**
 * Processes raw telemetry inputs from RFID stadium gate scanners
 * and recommends steering/rerouting directives.
 * @param {Array} gateLogs Array of log objects: { gateId, scansPerMinute, capacity }
 * @returns {Object} Actionable tactical recommendations
 */
function parseGateTelemetry(gateLogs) {
  const alerts = [];
  const diversionPlan = {};

  gateLogs.forEach(gate => {
    const occupancyRate = gate.scansPerMinute / gate.capacity;
    
    if (occupancyRate > 0.85) {
      alerts.push(`🚨 CRITICAL: ${gate.gateId} capacity at ${(occupancyRate * 100).toFixed(1)}%!`);
      diversionPlan[gate.gateId] = {
        action: 'Divert flow to adjacent gates',
        targetGates: ['GATE C', 'GATE D']
      };
    } else if (occupancyRate > 0.70) {
      alerts.push(`⚠️ WARNING: ${gate.gateId} queuing delay exceeds 10m.`);
    }
  });

  return {
    timestamp: new Date().toISOString(),
    status: alerts.length > 0 ? 'CRITICAL_SURGE' : 'NOMINAL',
    alerts,
    diversionPlan
  };
}
```

## 🤝 Best Practices for Crowd Control
1. **Voluntary Pre-Alerts:** Send push notes to volunteers near gates with yellow alerts.
2. **Accessible Steering:** Ensure rerouted paths are ramp-accessible and speech guides are updated.
3. **5G Drone Positioning:** Position drone cameras over red alert zones for direct feed analysis.
