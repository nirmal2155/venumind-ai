const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const WebSocket = require('ws');

const PORT = 3000;

// G.711 mu-law table decoders/encoders for pure-JS transcoding
const BIAS = 0x84;
const CLIP = 32635;

// Mu-law decoding table (8-bit mu-law -> 16-bit signed PCM)
const muLawDecodeTable = new Int16Array(256);
for (let i = 0; i < 256; i++) {
  let u = ~i;
  let sign = u & 0x80;
  let exponent = (u & 0x70) >> 4;
  let mantissa = u & 0x0f;
  
  let sample = (mantissa << 3) + 132;
  sample <<= exponent;
  sample -= 132;
  
  muLawDecodeTable[i] = sign ? -sample : sample;
}

// Pre-computed encoding table (16-bit signed PCM -> 8-bit mu-law)
// Maps 16-bit signed values [-32768..32767] by shifting to positive index [0..65535]
const pcmToMuLawTable = new Uint8Array(65536);

function calculateMuLawSample(number) {
  let sign = (number < 0) ? 0x80 : 0;
  if (number < 0) number = -number;
  if (number > CLIP) number = CLIP;
  number += BIAS;
  
  let exponent = 7;
  for (let val = 0x4000; (number & val) === 0 && exponent > 0; val >>= 1) {
    exponent--;
  }
  
  let mantissa = (number >> (exponent + 3)) & 0x0f;
  let mulaw = (exponent << 4) | mantissa;
  if (sign === 0) mulaw |= 0x80;
  
  return ~mulaw & 0xff;
}

for (let i = 0; i < 65536; i++) {
  const pcmValue = i - 32768;
  pcmToMuLawTable[i] = calculateMuLawSample(pcmValue);
}

// Single-pass decode (8-bit mu-law) and upsample (8kHz -> 16kHz)
// Eliminates intermediate arrays and cuts loop cycles in half
function decodeMuLawAndResample8To16(muLawBuffer) {
  const pcm16kHz = new Int16Array(muLawBuffer.length * 2);
  for (let i = 0; i < muLawBuffer.length; i++) {
    const decodedSample = muLawDecodeTable[muLawBuffer[i]];
    pcm16kHz[2 * i] = decodedSample;
    pcm16kHz[2 * i + 1] = decodedSample;
  }
  return pcm16kHz;
}

// Single-pass downsample (24kHz -> 8kHz) and encode (16-bit PCM -> 8-bit mu-law)
// Uses O(1) table lookup instead of loops and branch shifting
function downsample24To8AndEncodeMuLaw(pcm24kHz) {
  const len = Math.floor(pcm24kHz.length / 3);
  const mulaw = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    let val = pcm24kHz[i * 3];
    if (val < -32768) val = -32768;
    else if (val > 32767) val = 32767;
    mulaw[i] = pcmToMuLawTable[val + 32768];
  }
  return mulaw;
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// UI active browser clients registry
const uiClients = new Set();
function broadcastToUI(data) {
  const message = JSON.stringify(data);
  uiClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Global active campaign & API Cache configurations
let activeCampaign = null;
let globalTwilioConfig = null;
let globalGeminiConfig = null;

// Registry for single call logs
const activeSingleCalls = new Map(); // callSid -> { number, sid, status, duration, startTime, transcript: [] }
const singleCallsHistory = [];

// Campaign Orchestrator class
class BulkCallCampaignManager {
  constructor(numbers, maxConcurrent, twilioConfig, geminiConfig) {
    this.numbers = [...numbers]; // Queue of numbers
    this.maxConcurrent = maxConcurrent;
    this.twilioConfig = twilioConfig;
    this.geminiConfig = geminiConfig;
    
    this.totalCount = numbers.length;
    this.activeCount = 0;
    this.completedCount = 0;
    this.failedCount = 0;
    
    this.activeCalls = new Map(); // callSid -> { number, sid, status, duration, startTime, transcript: [] }
    this.callHistory = []; // List of finished calls
    this.isPaused = false;
    this.cpsLimitDelay = 1000; // 1 second throttle between API triggers
  }

  async start() {
    console.log(`[Campaign] Starting bulk campaign for ${this.totalCount} numbers (Concurrency: ${this.maxConcurrent})`);
    this.processQueue();
  }

  pause() {
    this.isPaused = true;
    console.log('[Campaign] Campaign paused.');
    broadcastToUI({ event: 'bulk-status', ...this.getStats() });
  }

  async processQueue() {
    if (this.isPaused) return;

    // Fill concurrency slots
    while (this.activeCount < this.maxConcurrent && this.numbers.length > 0) {
      const number = this.numbers.shift();
      this.activeCount++;
      
      // Update UI state immediately
      broadcastToUI({ event: 'bulk-status', ...this.getStats() });

      // Call number (asynchronously)
      this.launchOutboundCall(number);

      // Throttling to respect Twilio default account 1 Calls-Per-Second limit
      await new Promise(resolve => setTimeout(resolve, this.cpsLimitDelay));
    }

    // Campaign completed
    if (this.numbers.length === 0 && this.activeCount === 0) {
      console.log('[Campaign] Campaign completed!');
      broadcastToUI({ event: 'bulk-status', ...this.getStats(), finished: true });
    }
  }

  async launchOutboundCall(number) {
    const { twilioSid, twilioToken, twilioNumber, publicUrl } = this.twilioConfig;
    const { apiKey, model, voice, systemInstruction } = this.geminiConfig;

    try {
      let cleanDomain = publicUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const twimlUrl = `https://${cleanDomain}/api/twiml?apiKey=${encodeURIComponent(apiKey)}&model=${encodeURIComponent(model)}&voice=${encodeURIComponent(voice)}&systemInstruction=${encodeURIComponent(systemInstruction)}&domain=${encodeURIComponent(cleanDomain)}`;

      const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
      const params = new URLSearchParams({
        To: number,
        From: twilioNumber,
        Url: twimlUrl
      });

      const twilioRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Calls.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      const twilioData = await twilioRes.json();

      if (twilioRes.ok) {
        const callSid = twilioData.sid;
        console.log(`[Campaign] Call initiated to ${number}. CallSid: ${callSid}`);
        
        // Add to active maps
        this.activeCalls.set(callSid, {
          number,
          sid: callSid,
          status: 'ringing',
          duration: 0,
          startTime: Date.now(),
          transcript: []
        });

        broadcastToUI({ event: 'bulk-status', ...this.getStats() });
      } else {
        throw new Error(twilioData.message || 'Call rejected by Twilio.');
      }
    } catch (err) {
      console.error(`[Campaign] Outbound failure to ${number}:`, err.message);
      this.activeCount--;
      this.failedCount++;
      
      this.callHistory.push({
        number,
        sid: 'Failed',
        status: 'failed',
        duration: 0,
        error: err.message,
        transcript: []
      });

      // Continue queue
      this.processQueue();
    }
  }

  handleCallStart(callSid) {
    const call = this.activeCalls.get(callSid);
    if (call) {
      call.status = 'active';
      call.startTime = Date.now();
      broadcastToUI({ event: 'bulk-status', ...this.getStats() });
    }
  }

  handleCallDisconnect(callSid, status = 'completed') {
    const call = this.activeCalls.get(callSid);
    if (call) {
      this.activeCount--;
      if (status === 'completed') {
        this.completedCount++;
      } else {
        this.failedCount++;
      }

      call.status = status;
      call.duration = Math.round((Date.now() - call.startTime) / 1000);

      // Move record to history log
      this.callHistory.push(call);
      this.activeCalls.delete(callSid);

      console.log(`[Campaign] Call completed to ${call.number}. Duration: ${call.duration}s`);
      
      // Continue queue
      this.processQueue();
    }
  }

  addTranscriptLine(callSid, sender, text, isUser) {
    const call = this.activeCalls.get(callSid);
    if (call) {
      const line = { sender, text, isUser, time: new Date().toLocaleTimeString() };
      call.transcript.push(line);
      
      // Broadcast this line update to the client dashboard in real time
      broadcastToUI({
        event: 'bulk-transcript',
        callSid: callSid,
        line: line
      });
    }
  }

  getStats() {
    return {
      total: this.totalCount,
      queued: this.numbers.length,
      active: this.activeCount,
      completed: this.completedCount,
      failed: this.failedCount,
      activeCallsList: Array.from(this.activeCalls.values()),
      history: this.callHistory
    };
  }
}

// Create standard HTTP server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  console.log(`${req.method} ${pathname}`);

  // API Authorization Middleware helper
  const SERVER_API_KEY = "vm_token_secure_987654";
  function checkAuth() {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Unauthorized. Missing Bearer Token.' }));
      return false;
    }
    const token = authHeader.substring(7).trim();
    if (token !== SERVER_API_KEY) {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Forbidden. Invalid API Token.' }));
      return false;
    }
    return true;
  }

  // ==========================================================================
  // EXTERNAL DEVELOPER API (v1) ENDPOINTS
  // ==========================================================================

  // Endpoint: GET /api/v1/calls (List all active/history OR query specific callSid)
  if (req.method === 'GET' && pathname === '/api/v1/calls') {
    if (!checkAuth()) return;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    const callSid = parsedUrl.query.callSid;

    if (callSid) {
      // Find call details by CallSid
      let foundCall = null;

      // 1. Search in campaign active
      if (activeCampaign && activeCampaign.activeCalls.has(callSid)) {
        foundCall = activeCampaign.activeCalls.get(callSid);
      }
      // 2. Search in campaign history
      else if (activeCampaign && (foundCall = activeCampaign.callHistory.find(c => c.sid === callSid))) {
        // found in array
      }
      // 3. Search in single active
      else if (activeSingleCalls.has(callSid)) {
        foundCall = activeSingleCalls.get(callSid);
      }
      // 4. Search in single history
      else if ((foundCall = singleCallsHistory.find(c => c.sid === callSid))) {
        // found in array
      }

      if (foundCall) {
        res.end(JSON.stringify({ success: true, call: foundCall }));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: `Call SID ${callSid} not found.` }));
      }
    } else {
      // Return lists
      const activeCampaignCalls = activeCampaign ? Array.from(activeCampaign.activeCalls.values()) : [];
      const activeSingles = Array.from(activeSingleCalls.values());
      const campaignHistory = activeCampaign ? activeCampaign.callHistory : [];
      
      res.end(JSON.stringify({
        success: true,
        active: [...activeCampaignCalls, ...activeSingles],
        history: [...campaignHistory, ...singleCallsHistory]
      }));
    }
    return;
  }

  // Endpoint: GET /api/v1/campaign/status
  if (req.method === 'GET' && pathname === '/api/v1/campaign/status') {
    if (!checkAuth()) return;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    if (activeCampaign) {
      res.end(JSON.stringify({ success: true, active: true, stats: activeCampaign.getStats() }));
    } else {
      res.end(JSON.stringify({ success: true, active: false, message: 'No campaign is currently active.' }));
    }
    return;
  }

  // Endpoint: POST /api/v1/campaign/stop
  if (req.method === 'POST' && pathname === '/api/v1/campaign/stop') {
    if (!checkAuth()) return;
    if (activeCampaign) {
      activeCampaign.pause();
      activeCampaign = null;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, message: 'Campaign stopped.' }));
    return;
  }

  // Endpoint: POST /api/v1/calls/terminate (Programmatic hangup via Twilio API)
  if (req.method === 'POST' && pathname === '/api/v1/calls/terminate') {
    if (!checkAuth()) return;
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const { callSid } = data;

        const twilioSid = data.twilioSid || (globalTwilioConfig && globalTwilioConfig.twilioSid);
        const twilioToken = data.twilioToken || (globalTwilioConfig && globalTwilioConfig.twilioToken);

        if (!callSid || !twilioSid || !twilioToken) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Missing Call SID or Twilio credentials.' }));
          return;
        }

        console.log(`[API v1] Hanging up Call SID: ${callSid}...`);

        const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
        const params = new URLSearchParams({ Status: 'completed' });

        const twilioRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Calls/${callSid}.json`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString()
        });

        const twilioData = await twilioRes.json();

        if (twilioRes.ok) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, message: 'Call terminated successfully.' }));
        } else {
          res.statusCode = twilioRes.status;
          res.end(JSON.stringify({ error: twilioData.message || 'Twilio failed to terminate call.' }));
        }
      } catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Endpoint: POST /api/v1/campaign
  if (req.method === 'POST' && pathname === '/api/v1/campaign') {
    if (!checkAuth()) return;
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { numbers, maxConcurrent, systemInstruction } = data;
        
        // Retrieve configs with cache fallbacks
        const twilioSid = data.twilioSid || (globalTwilioConfig && globalTwilioConfig.twilioSid);
        const twilioToken = data.twilioToken || (globalTwilioConfig && globalTwilioConfig.twilioToken);
        const twilioNumber = data.twilioNumber || (globalTwilioConfig && globalTwilioConfig.twilioNumber);
        const publicUrl = data.publicUrl || (globalTwilioConfig && globalTwilioConfig.publicUrl);
        const apiKey = data.apiKey || (globalGeminiConfig && globalGeminiConfig.apiKey);
        const model = data.model || (globalGeminiConfig && globalGeminiConfig.model) || 'models/gemini-2.0-flash';
        const voice = data.voice || (globalGeminiConfig && globalGeminiConfig.voice) || 'Fenrir';
        const finalSystemInstruction = systemInstruction || (globalGeminiConfig && globalGeminiConfig.systemInstruction);

        if (!numbers || !numbers.length || !twilioSid || !twilioToken || !twilioNumber || !publicUrl || !apiKey) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Missing configuration. Configure via dashboard first or send credentials inside the JSON body.' }));
          return;
        }

        if (activeCampaign) {
          activeCampaign.pause();
        }

        const twilioConfig = { twilioSid, twilioToken, twilioNumber, publicUrl };
        const geminiConfig = { apiKey, model, voice, systemInstruction: finalSystemInstruction };

        activeCampaign = new BulkCallCampaignManager(numbers, parseInt(maxConcurrent) || 5, twilioConfig, geminiConfig);
        activeCampaign.start();

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, message: 'Campaign started successfully.', totalQueued: numbers.length }));
      } catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Endpoint: POST /api/v1/call
  if (req.method === 'POST' && pathname === '/api/v1/call') {
    if (!checkAuth()) return;
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const { to, systemInstruction } = data;

        const twilioSid = data.twilioSid || (globalTwilioConfig && globalTwilioConfig.twilioSid);
        const twilioToken = data.twilioToken || (globalTwilioConfig && globalTwilioConfig.twilioToken);
        const twilioNumber = data.twilioNumber || (globalTwilioConfig && globalTwilioConfig.twilioNumber);
        const publicUrl = data.publicUrl || (globalTwilioConfig && globalTwilioConfig.publicUrl);
        const apiKey = data.apiKey || (globalGeminiConfig && globalGeminiConfig.apiKey);
        const model = data.model || (globalGeminiConfig && globalGeminiConfig.model) || 'models/gemini-2.0-flash';
        const voice = data.voice || (globalGeminiConfig && globalGeminiConfig.voice) || 'Fenrir';
        const finalSystemInstruction = systemInstruction || (globalGeminiConfig && globalGeminiConfig.systemInstruction);

        if (!to || !twilioSid || !twilioToken || !twilioNumber || !publicUrl || !apiKey) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Missing configuration. Configure via dashboard first or send credentials inside the JSON body.' }));
          return;
        }

        let cleanDomain = publicUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
        const twimlUrl = `https://${cleanDomain}/api/twiml?apiKey=${encodeURIComponent(apiKey)}&model=${encodeURIComponent(model)}&voice=${encodeURIComponent(voice)}&systemInstruction=${encodeURIComponent(finalSystemInstruction)}&domain=${encodeURIComponent(cleanDomain)}`;

        console.log(`[API v1] Triggering outbound call to ${to}...`);
        
        const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
        const params = new URLSearchParams({
          To: to,
          From: twilioNumber,
          Url: twimlUrl
        });

        const twilioRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Calls.json`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString()
        });

        const twilioData = await twilioRes.json();
        
        if (twilioRes.ok) {
          const callSid = twilioData.sid;
          
          // Register in single active calls registry
          activeSingleCalls.set(callSid, {
            number: to,
            sid: callSid,
            status: 'ringing',
            duration: 0,
            startTime: Date.now(),
            transcript: []
          });

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, callSid: callSid }));
        } else {
          res.statusCode = twilioRes.status;
          res.end(JSON.stringify({ error: twilioData.message }));
        }
      } catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // ==========================================================================
  // DASHBOARD INTERNAL API ENDPOINTS
  // ==========================================================================

  // Endpoint: Start Bulk Campaign
  if (req.method === 'POST' && pathname === '/api/start-bulk') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { numbers, maxConcurrent, twilioSid, twilioToken, twilioNumber, publicUrl, apiKey, model, voice, systemInstruction } = data;

        if (!numbers || !numbers.length || !twilioSid || !twilioToken || !twilioNumber || !publicUrl || !apiKey) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Missing required parameters.' }));
          return;
        }

        // Cache configs in global memory for API v1 fallbacks
        globalTwilioConfig = { twilioSid, twilioToken, twilioNumber, publicUrl };
        globalGeminiConfig = { apiKey, model, voice, systemInstruction };

        // Cancel previous campaign if active
        if (activeCampaign) {
          activeCampaign.pause();
        }

        activeCampaign = new BulkCallCampaignManager(numbers, parseInt(maxConcurrent) || 5, globalTwilioConfig, globalGeminiConfig);
        activeCampaign.start();

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        console.error('Error starting bulk campaign:', err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Endpoint: Stop Bulk Campaign
  if (req.method === 'POST' && pathname === '/api/stop-bulk') {
    if (activeCampaign) {
      activeCampaign.pause();
      activeCampaign = null;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // Endpoint 1: Outbound single phone call trigger
  if (req.method === 'POST' && pathname === '/api/make-call') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const { to, twilioSid, twilioToken, twilioNumber, publicUrl, apiKey, model, voice, systemInstruction } = data;

        if (!to || !twilioSid || !twilioToken || !twilioNumber || !publicUrl || !apiKey) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Missing required configuration parameters.' }));
          return;
        }

        // Cache configs in global memory for API v1 fallbacks
        globalTwilioConfig = { twilioSid, twilioToken, twilioNumber, publicUrl };
        globalGeminiConfig = { apiKey, model, voice, systemInstruction };

        let cleanDomain = publicUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
        const twimlUrl = `https://${cleanDomain}/api/twiml?apiKey=${encodeURIComponent(apiKey)}&model=${encodeURIComponent(model)}&voice=${encodeURIComponent(voice)}&systemInstruction=${encodeURIComponent(systemInstruction)}&domain=${encodeURIComponent(cleanDomain)}`;

        console.log(`[Twilio] Placing outbound call to ${to}...`);
        
        const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
        const params = new URLSearchParams({
          To: to,
          From: twilioNumber,
          Url: twimlUrl
        });

        const twilioRes = await fetch('https://api.twilio.com/2010-04-01/Accounts/' + twilioSid + '/Calls.json', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString()
        });

        const twilioData = await twilioRes.json();
        
        if (twilioRes.ok) {
          const callSid = twilioData.sid;
          console.log(`[Twilio] Call initiated. SID: ${callSid}`);
          
          // Register in single active calls registry
          activeSingleCalls.set(callSid, {
            number: to,
            sid: callSid,
            status: 'ringing',
            duration: 0,
            startTime: Date.now(),
            transcript: []
          });

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, callSid: callSid }));
        } else {
          console.error(`[Twilio] Call failed:`, twilioData);
          res.statusCode = twilioRes.status;
          res.end(JSON.stringify({ error: twilioData.message }));
        }
      } catch (err) {
        console.error('Error placing call:', err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Endpoint 1.5: Proxy for browser-mode open-source models
  if (req.method === 'POST' && pathname === '/api/chat') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const { provider, model, apiKey, systemInstruction, prompt } = data;

        let responseText = '';
        let usage = null;

        if (provider === 'ollama') {
          console.log(`[Ollama] Querying local model ${model}...`);
          const ollamaRes = await fetch('http://localhost:11434/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: model || 'qwen2.5:1.5b',
              messages: [
                { role: 'system', content: systemInstruction },
                { role: 'user', content: prompt }
              ],
              stream: false
            })
          });
          const resJson = await ollamaRes.json();
          if (ollamaRes.ok && resJson.choices && resJson.choices[0]) {
            responseText = resJson.choices[0].message.content;
            if (resJson.usage) {
              usage = {
                prompt: resJson.usage.prompt_tokens,
                completion: resJson.usage.completion_tokens,
                total: resJson.usage.total_tokens
              };
            }
          } else {
            throw new Error(resJson.error?.message || 'Failed to get response from local Ollama. Ensure Ollama is running on your PC.');
          }
        } 
        else if (provider === 'groq') {
          console.log(`[Groq] Querying cloud model ${model}...`);
          const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: model || 'llama-3.1-8b-instant',
              messages: [
                { role: 'system', content: systemInstruction },
                { role: 'user', content: prompt }
              ],
              stream: false
            })
          });
          const resJson = await groqRes.json();
          if (groqRes.ok && resJson.choices && resJson.choices[0]) {
            responseText = resJson.choices[0].message.content;
            if (resJson.usage) {
              usage = {
                prompt: resJson.usage.prompt_tokens,
                completion: resJson.usage.completion_tokens,
                total: resJson.usage.total_tokens
              };
            }
          } else {
            throw new Error(resJson.error?.message || 'Failed to get response from Groq API.');
          }
        } 
        else if (provider === 'huggingface') {
          console.log(`[Hugging Face] Querying serverless model ${model}...`);
          const hfRes = await fetch(`https://api-inference.huggingface.co/v1/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: model || 'meta-llama/Llama-3-8b-instruct',
              messages: [
                { role: 'system', content: systemInstruction },
                { role: 'user', content: prompt }
              ],
              max_tokens: 150
            })
          });
          const resJson = await hfRes.json();
          if (hfRes.ok && resJson.choices && resJson.choices[0]) {
            responseText = resJson.choices[0].message.content;
            if (resJson.usage) {
              usage = {
                prompt: resJson.usage.prompt_tokens,
                completion: resJson.usage.completion_tokens,
                total: resJson.usage.total_tokens
              };
            }
          } else {
            throw new Error(resJson.error?.message || 'Failed to get response from Hugging Face API.');
          }
        } else {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Unsupported provider.' }));
          return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ response: responseText, usage: usage }));
      } catch (err) {
        console.error('Error in proxy chat:', err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Endpoint 2: TwiML stream connector config
  if ((req.method === 'POST' || req.method === 'GET') && pathname === '/api/twiml') {
    const query = parsedUrl.query;
    const { apiKey, model, voice, systemInstruction, domain } = query;

    console.log(`[Twilio Webhook] Serving TwiML for incoming call connected.`);

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Aditi">Connecting to AI Voice Assistant. Please wait.</Say>
  <Connect>
    <Stream url="wss://${domain}/api/media-stream?apiKey=${encodeURIComponent(apiKey)}&amp;model=${encodeURIComponent(model)}&amp;voice=${encodeURIComponent(voice)}&amp;systemInstruction=${encodeURIComponent(systemInstruction)}" />
  </Connect>
</Response>`;

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/xml');
    res.end(twiml);
    return;
  }

  // Fallback: Serve static UI files
  let filePath = decodeURIComponent(pathname);
  if (filePath === '/') {
    filePath = '/index.html';
  }

  const fullPath = path.join(__dirname, filePath);

  if (!fullPath.startsWith(__dirname)) {
    res.statusCode = 403;
    res.end('Access Denied');
    return;
  }

  fs.stat(fullPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-cache');

    fs.createReadStream(fullPath).pipe(res);
  });
});

// Setup WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// Attach WS connections to HTTP upgrades
server.on('upgrade', (request, socket, head) => {
  const pathname = url.parse(request.url).pathname;

  if (pathname === '/api/media-stream' || pathname === '/api/ui-stream') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

wss.on('connection', (ws, request) => {
  const parsedUrl = url.parse(request.url, true);
  const pathname = parsedUrl.pathname;

  // Browser UI stream logic
  if (pathname === '/api/ui-stream') {
    console.log('[WS] Browser UI client connected.');
    uiClients.add(ws);
    
    // Send current campaign stats to UI if one is running
    if (activeCampaign) {
      ws.send(JSON.stringify({ event: 'bulk-status', ...activeCampaign.getStats() }));
    }

    ws.on('close', () => {
      console.log('[WS] Browser UI client disconnected.');
      uiClients.delete(ws);
    });
    return;
  }

  // Twilio media stream logic
  if (pathname === '/api/media-stream') {
    const query = parsedUrl.query;
    const { apiKey, model, voice, systemInstruction } = query;

    console.log('[WS] Twilio Call Media Stream connected.');
    broadcastToUI({ event: 'call-status', status: 'connected', message: 'Call connected! Starting AI Agent...' });

    let streamSid = null;
    let callSid = null;
    let geminiSocket = null;
    
    // Connect to Gemini Live API
    const geminiUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`;
    geminiSocket = new WebSocket(geminiUrl);

    geminiSocket.on('open', () => {
      console.log('[Gemini] Connected to Gemini Multimodal Live API.');
      
      // Setup payload
      const setupMsg = {
        setup: {
          model: model || 'models/gemini-2.0-flash',
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: voice || 'Fenrir'
                }
              }
            }
          },
          systemInstruction: {
            parts: [{ text: systemInstruction || 'You are a helpful assistant.' }]
          },
          inputAudioTranscription: { enable: true },
          outputAudioTranscription: { enable: true }
        }
      };

      geminiSocket.send(JSON.stringify(setupMsg));
    });

    geminiSocket.on('message', (data) => {
      handleGeminiMessage(data);
    });

    geminiSocket.on('error', (err) => {
      console.error('[Gemini] Socket Error:', err);
      broadcastToUI({ event: 'call-status', status: 'error', message: 'Gemini service error.' });
    });

    geminiSocket.on('close', (code, reason) => {
      console.log(`[Gemini] Connection closed: ${code} - ${reason}`);
      if (activeCampaign && callSid) {
        activeCampaign.handleCallDisconnect(callSid, 'completed');
      } else if (activeSingleCalls.has(callSid)) {
        const call = activeSingleCalls.get(callSid);
        call.status = 'completed';
        call.duration = Math.round((Date.now() - call.startTime) / 1000);
        singleCallsHistory.push(call);
        activeSingleCalls.delete(callSid);
        broadcastToUI({ event: 'call-status', status: 'disconnected', message: 'AI Agent disconnected.' });
      } else {
        broadcastToUI({ event: 'call-status', status: 'disconnected', message: 'AI Agent disconnected.' });
      }
      ws.close();
    });

    // Handle messages coming from Twilio
    ws.on('message', (message) => {
      const data = JSON.parse(message);

      switch (data.event) {
        case 'connected':
          console.log('[Twilio] Stream protocol connected.');
          break;
        case 'start':
          streamSid = data.streamSid;
          callSid = data.start.callSid; // Capture the Call SID
          console.log(`[Twilio] Call Media Stream started. StreamSid: ${streamSid}, CallSid: ${callSid}`);
          
          if (activeCampaign && callSid) {
            activeCampaign.handleCallStart(callSid);
          } else if (activeSingleCalls.has(callSid)) {
            const call = activeSingleCalls.get(callSid);
            call.status = 'active';
            call.startTime = Date.now();
            broadcastToUI({ event: 'call-status', status: 'active', message: 'Call Active' });
          } else {
            broadcastToUI({ event: 'call-status', status: 'active', message: 'Call Active' });
          }
          break;
        case 'media':
          // Highly efficient O(1) single-pass decode and resample (8kHz -> 16kHz)
          if (geminiSocket && geminiSocket.readyState === WebSocket.OPEN) {
            const rawPayload = Buffer.from(data.media.payload, 'base64');
            const pcm16Bit16kHz = decodeMuLawAndResample8To16(rawPayload);
            const base64Pcm = Buffer.from(pcm16Bit16kHz.buffer).toString('base64');

            const audioInputPayload = {
              realtimeInput: {
                mediaChunks: [
                  {
                    mimeType: "audio/pcm;rate=16000",
                    data: base64Pcm
                  }
                ]
              }
            };
            geminiSocket.send(JSON.stringify(audioInputPayload));
            
            // Calculate input volume directly from rawPayload (cuts loop calculations in half)
            let sum = 0;
            for (let i = 0; i < rawPayload.length; i++) {
              sum += Math.abs(muLawDecodeTable[rawPayload[i]]);
            }
            const avgVol = sum / rawPayload.length;
            broadcastToUI({ event: 'vol-input', value: avgVol });
          }
          break;
        case 'stop':
          console.log('[Twilio] Media Stream stopped.');
          break;
      }
    });

    ws.on('close', () => {
      console.log('[WS] Twilio Media connection closed.');
      if (activeCampaign && callSid) {
        activeCampaign.handleCallDisconnect(callSid, 'completed');
      } else if (activeSingleCalls.has(callSid)) {
        const call = activeSingleCalls.get(callSid);
        call.status = 'completed';
        call.duration = Math.round((Date.now() - call.startTime) / 1000);
        singleCallsHistory.push(call);
        activeSingleCalls.delete(callSid);
        broadcastToUI({ event: 'call-status', status: 'disconnected', message: 'Call Finished' });
      } else {
        broadcastToUI({ event: 'call-status', status: 'disconnected', message: 'Call Finished' });
      }
      if (geminiSocket && geminiSocket.readyState === WebSocket.OPEN) {
        geminiSocket.close();
      }
    });

    // Handle messages coming from Gemini to send back to Twilio
    function handleGeminiMessage(data) {
      try {
        const msg = JSON.parse(data.toString());

        if (msg.setupComplete) {
          console.log('[Gemini] Configuration setup acknowledged.');
          if (!activeCampaign) {
            broadcastToUI({ event: 'call-status', status: 'speaking', message: 'AI Speaking...' });
          }
          return;
        }

        const serverContent = msg.serverContent;
        if (!serverContent) return;

        // Handle User speech transcription
        if (serverContent.inputTranscription && serverContent.inputTranscription.text) {
          if (activeCampaign && callSid) {
            activeCampaign.addTranscriptLine(callSid, 'You', serverContent.inputTranscription.text, true);
          } else if (activeSingleCalls.has(callSid)) {
            const line = { sender: 'You', text: serverContent.inputTranscription.text, isUser: true, time: new Date().toLocaleTimeString() };
            activeSingleCalls.get(callSid).transcript.push(line);
            broadcastToUI({ event: 'transcript', sender: 'You', text: serverContent.inputTranscription.text, isUser: true });
          } else {
            broadcastToUI({ event: 'transcript', sender: 'You', text: serverContent.inputTranscription.text, isUser: true });
          }
        }

        // Handle Agent speech transcription
        if (serverContent.outputTranscription && serverContent.outputTranscription.text) {
          if (activeCampaign && callSid) {
            activeCampaign.addTranscriptLine(callSid, 'Agent', serverContent.outputTranscription.text, false);
          } else if (activeSingleCalls.has(callSid)) {
            const line = { sender: 'Agent', text: serverContent.outputTranscription.text, isUser: false, time: new Date().toLocaleTimeString() };
            activeSingleCalls.get(callSid).transcript.push(line);
            broadcastToUI({ event: 'transcript', sender: 'Agent', text: serverContent.outputTranscription.text, isUser: false });
          } else {
            broadcastToUI({ event: 'transcript', sender: 'Agent', text: serverContent.outputTranscription.text, isUser: false });
          }
        }

        // Handle Barge-in (interruption)
        if (serverContent.interrupted) {
          console.log('[Gemini] User interrupted the agent. Clearing Twilio buffer.');
          if (ws.readyState === WebSocket.OPEN && streamSid) {
            const clearMessage = { event: 'clear', streamSid: streamSid };
            ws.send(JSON.stringify(clearMessage));
            broadcastToUI({ event: 'interrupted' });
          }
          return;
        }

        // Stream audio back to Twilio
        const modelTurn = serverContent.modelTurn;
        if (modelTurn && modelTurn.parts) {
          for (const part of modelTurn.parts) {
            if (part.inlineData && part.inlineData.data) {
              const audioBase64 = part.inlineData.data; // 24kHz 16-bit PCM
              const pcm16Bit24kHz = new Int16Array(Buffer.from(audioBase64, 'base64').buffer);
              
              // Highly efficient O(1) single-pass downsample and encode (24kHz -> 8kHz mu-law)
              const muLawEncodedBytes = downsample24To8AndEncodeMuLaw(pcm16Bit24kHz);
              const twilioBase64 = Buffer.from(muLawEncodedBytes.buffer).toString('base64');

              if (ws.readyState === WebSocket.OPEN && streamSid) {
                const mediaMessage = {
                  event: 'media',
                  streamSid: streamSid,
                  media: {
                    payload: twilioBase64
                  }
                };
                ws.send(JSON.stringify(mediaMessage));
                
                // Calculate output volume from encoded bytes
                let sum = 0;
                for (let i = 0; i < muLawEncodedBytes.length; i++) {
                  sum += Math.abs(muLawDecodeTable[muLawEncodedBytes[i]]);
                }
                const avgVol = sum / muLawEncodedBytes.length;
                broadcastToUI({ event: 'vol-output', value: avgVol });
              }
            }
          }
        }
      } catch (err) {
        console.error('Error handling Gemini response payload:', err);
      }
    }
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🚀 VenuMind AI Enterprise Server is running!`);
  console.log(`🌐 Local dashboard: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
