// VenuMind AI Voice Agent Client - Browser, Phone & Bulk modes

// Application State
const state = {
  activeMode: 'browser', // 'browser', 'phone', or 'bulk'
  isConnected: false,
  isMuted: false,
  
  // Settings - Browser Mode (LocalStorage)
  provider: localStorage.getItem('v_provider') || 'ollama',
  browserModel: localStorage.getItem('v_browser_model') || 'qwen2.5:1.5b',
  browserApiKey: localStorage.getItem('v_browser_api_key') || '',
  browserVoiceName: localStorage.getItem('v_browser_voice_name') || '',
  
  // Settings - Phone Mode (LocalStorage)
  geminiApiKey: localStorage.getItem('v_gemini_api_key') || '',
  targetPhone: localStorage.getItem('v_target_phone') || '',
  publicUrl: localStorage.getItem('v_public_url') || '',
  twilioSid: localStorage.getItem('v_twilio_sid') || '',
  twilioToken: localStorage.getItem('v_twilio_token') || '',
  twilioNumber: localStorage.getItem('v_twilio_number') || '',
  phoneModel: localStorage.getItem('v_phone_model') || 'models/gemini-2.0-flash',
  phoneVoice: localStorage.getItem('v_phone_voice') || 'Fenrir',

  // Settings - Bulk Mode (LocalStorage)
  bulkGeminiKey: localStorage.getItem('v_bulk_gemini_key') || '',
  bulkNumbers: localStorage.getItem('v_bulk_numbers') || '',
  bulkPublicUrl: localStorage.getItem('v_bulk_public_url') || '',
  bulkTwilioSid: localStorage.getItem('v_bulk_twilio_sid') || '',
  bulkTwilioToken: localStorage.getItem('v_bulk_twilio_token') || '',
  bulkTwilioNumber: localStorage.getItem('v_bulk_twilio_number') || '',
  bulkConcurrency: localStorage.getItem('v_bulk_concurrency') || '5',
  bulkVoice: localStorage.getItem('v_bulk_voice') || 'Fenrir',

  // Shared settings
  systemInstruction: localStorage.getItem('v_system_instruction') || 
    'You are a helpful, friendly, and concise AI voice assistant. Speak naturally, keeping responses concise (1-3 sentences) so the conversation flows easily like a phone call.',

  // Browser Mode audio/speech nodes
  recognition: null,
  speechSynthesis: window.speechSynthesis,
  browserMicStream: null,
  browserMicContext: null,
  browserMicAnalyser: null,
  isSpeechSpeaking: false,
  simulatedSpeakerVolume: 0,
  
  // Phone Mode & Bulk Mode Socket
  uiWebSocket: null,
  currentCallSid: null,
  
  // Visualizer volume feedback
  inputVolume: 0,
  outputVolume: 0,
  currentAgentBubble: null,
  sessionTokens: 0,

  // Bulk Campaign State
  campaignStats: null,
  campaignTranscripts: new Map(), // callSid -> Array of transcript lines
  monitoredCallSid: 'dashboard'  // 'dashboard' or specific callSid
};

// DOM Elements
const elements = {
  tabBrowser: document.getElementById('tab-browser'),
  tabPhone: document.getElementById('tab-phone'),
  tabBulk: document.getElementById('tab-bulk'),
  toggleSettingsBtn: document.getElementById('toggle-settings-btn'),
  settingsPanel: document.getElementById('settings-panel'),
  
  // Config sections
  browserConfigFields: document.getElementById('browser-config-fields'),
  phoneConfigFields: document.getElementById('phone-config-fields'),
  bulkConfigFields: document.getElementById('bulk-config-fields'),
  
  // Inputs
  providerSelect: document.getElementById('provider-select'),
  providerKeyGroup: document.getElementById('provider-key-group'),
  providerKeyLabel: document.getElementById('provider-key-label'),
  providerKeyInput: document.getElementById('provider-key-input'),
  toggleApiKeyBtn: document.getElementById('toggle-api-key-btn'),
  providerKeyHelper: document.getElementById('provider-key-helper'),
  browserModelSelect: document.getElementById('browser-model-select'),
  browserVoiceSelect: document.getElementById('browser-voice-select'),
  
  geminiKeyInput: document.getElementById('gemini-key-input'),
  targetPhoneInput: document.getElementById('target-phone-input'),
  publicUrlInput: document.getElementById('public-url-input'),
  twilioSidInput: document.getElementById('twilio-sid-input'),
  twilioTokenInput: document.getElementById('twilio-token-input'),
  twilioNumberInput: document.getElementById('twilio-number-input'),
  phoneModelSelect: document.getElementById('phone-model-select'),
  phoneVoiceSelect: document.getElementById('phone-voice-select'),

  bulkGeminiKeyInput: document.getElementById('bulk-gemini-key-input'),
  bulkNumbersInput: document.getElementById('bulk-numbers-input'),
  bulkPublicUrlInput: document.getElementById('bulk-public-url-input'),
  bulkTwilioSidInput: document.getElementById('bulk-twilio-sid-input'),
  bulkTwilioTokenInput: document.getElementById('bulk-twilio-token-input'),
  bulkTwilioNumberInput: document.getElementById('bulk-twilio-number-input'),
  bulkConcurrencySelect: document.getElementById('bulk-concurrency-select'),
  bulkVoiceSelect: document.getElementById('bulk-voice-select'),
  
  systemInstructionInput: document.getElementById('system-instruction-input'),
  
  // Stage controls
  statusDot: document.getElementById('status-dot'),
  statusLabel: document.getElementById('status-label'),
  connectBtn: document.getElementById('connect-btn'),
  connectBtnText: document.getElementById('connect-btn-text'),
  muteBtn: document.getElementById('mute-btn'),
  
  // Bulk controls
  bulkCallStage: document.getElementById('bulk-call-stage'),
  singleCallStage: document.getElementById('single-call-stage'),
  bulkStartBtn: document.getElementById('bulk-start-btn'),
  bulkStopBtn: document.getElementById('bulk-stop-btn'),
  campaignStatusTag: document.getElementById('campaign-status-tag'),
  
  // Bulk Stats
  bulkProgressPercent: document.getElementById('bulk-progress-percent'),
  bulkProgressBarFill: document.getElementById('bulk-progress-bar-fill'),
  statBulkQueued: document.getElementById('stat-bulk-queued'),
  statBulkActive: document.getElementById('stat-bulk-active'),
  statBulkCompleted: document.getElementById('stat-bulk-completed'),
  statBulkFailed: document.getElementById('stat-bulk-failed'),
  
  // Transcription & Table Logs
  transcriptHeaderTitle: document.getElementById('transcript-header-title'),
  bulkCallMonitorSelect: document.getElementById('bulk-call-monitor-select'),
  transcriptContainer: document.getElementById('transcript-container'),
  bulkDashboardContainer: document.getElementById('bulk-dashboard-container'),
  bulkLogTbody: document.getElementById('bulk-log-tbody'),
  clearTranscriptBtn: document.getElementById('clear-transcript-btn'),
  canvas: document.getElementById('visualizer-canvas'),
  tokenMonitor: document.getElementById('token-monitor'),
  statPrompt: document.getElementById('stat-prompt'),
  statCompletion: document.getElementById('stat-completion'),
  statTotal: document.getElementById('stat-total'),
  statSession: document.getElementById('stat-session')
};

// SVG icons
const EYE_OPEN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
const EYE_CLOSED_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye-off"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

// Initialize settings inputs and events
function initUI() {
  // Populate Browser
  elements.providerSelect.value = state.provider;
  elements.providerKeyInput.value = state.browserApiKey;
  elements.browserModelSelect.value = state.browserModel;
  
  // Populate Phone
  elements.geminiKeyInput.value = state.geminiApiKey;
  elements.targetPhoneInput.value = state.targetPhone;
  elements.publicUrlInput.value = state.publicUrl;
  elements.twilioSidInput.value = state.twilioSid;
  elements.twilioTokenInput.value = state.twilioToken;
  elements.twilioNumberInput.value = state.twilioNumber;
  elements.phoneModelSelect.value = state.phoneModel;
  elements.phoneVoiceSelect.value = state.phoneVoice;

  // Populate Bulk
  elements.bulkGeminiKeyInput.value = state.bulkGeminiKey;
  elements.bulkNumbersInput.value = state.bulkNumbers;
  elements.bulkPublicUrlInput.value = state.bulkPublicUrl;
  elements.bulkTwilioSidInput.value = state.bulkTwilioSid;
  elements.bulkTwilioTokenInput.value = state.bulkTwilioToken;
  elements.bulkTwilioNumberInput.value = state.bulkTwilioNumber;
  elements.bulkConcurrencySelect.value = state.bulkConcurrency;
  elements.bulkVoiceSelect.value = state.bulkVoice;
  
  elements.systemInstructionInput.value = state.systemInstruction;
  
  updateProviderInputs();
  populateSystemVoices();
  
  // Tab Event Listeners
  elements.tabBrowser.addEventListener('click', () => switchMode('browser'));
  elements.tabPhone.addEventListener('click', () => switchMode('phone'));
  elements.tabBulk.addEventListener('click', () => switchMode('bulk'));
  
  // Settings Panel Toggle
  elements.toggleSettingsBtn.addEventListener('click', () => {
    elements.settingsPanel.classList.toggle('card-hidden');
  });
  
  // Sync inputs to state & LocalStorage
  elements.providerSelect.addEventListener('change', (e) => {
    state.provider = e.target.value;
    localStorage.setItem('v_provider', state.provider);
    updateProviderInputs();
    updateModelOptions();
  });
  
  elements.providerKeyInput.addEventListener('input', (e) => {
    state.browserApiKey = e.target.value;
    localStorage.setItem('v_browser_api_key', state.browserApiKey);
  });
  
  elements.browserModelSelect.addEventListener('change', (e) => {
    state.browserModel = e.target.value;
    localStorage.setItem('v_browser_model', state.browserModel);
  });
  
  elements.browserVoiceSelect.addEventListener('change', (e) => {
    state.browserVoiceName = e.target.value;
    localStorage.setItem('v_browser_voice_name', state.browserVoiceName);
  });
  
  elements.geminiKeyInput.addEventListener('input', (e) => {
    state.geminiApiKey = e.target.value;
    localStorage.setItem('v_gemini_api_key', state.geminiApiKey);
  });
  
  elements.targetPhoneInput.addEventListener('input', (e) => {
    state.targetPhone = e.target.value;
    localStorage.setItem('v_target_phone', state.targetPhone);
  });
  
  elements.publicUrlInput.addEventListener('input', (e) => {
    state.publicUrl = e.target.value;
    localStorage.setItem('v_public_url', state.publicUrl);
  });
  
  elements.twilioSidInput.addEventListener('input', (e) => {
    state.twilioSid = e.target.value;
    localStorage.setItem('v_twilio_sid', state.twilioSid);
  });
  
  elements.twilioTokenInput.addEventListener('input', (e) => {
    state.twilioToken = e.target.value;
    localStorage.setItem('v_twilio_token', state.twilioToken);
  });
  
  elements.twilioNumberInput.addEventListener('input', (e) => {
    state.twilioNumber = e.target.value;
    localStorage.setItem('v_twilio_number', state.twilioNumber);
  });
  
  elements.phoneModelSelect.addEventListener('change', (e) => {
    state.phoneModel = e.target.value;
    localStorage.setItem('v_phone_model', state.phoneModel);
  });
  
  elements.phoneVoiceSelect.addEventListener('change', (e) => {
    state.phoneVoice = e.target.value;
    localStorage.setItem('v_phone_voice', state.phoneVoice);
  });

  // Sync Bulk inputs
  elements.bulkGeminiKeyInput.addEventListener('input', (e) => {
    state.bulkGeminiKey = e.target.value;
    localStorage.setItem('v_bulk_gemini_key', state.bulkGeminiKey);
  });
  elements.bulkNumbersInput.addEventListener('input', (e) => {
    state.bulkNumbers = e.target.value;
    localStorage.setItem('v_bulk_numbers', state.bulkNumbers);
  });
  elements.bulkPublicUrlInput.addEventListener('input', (e) => {
    state.bulkPublicUrl = e.target.value;
    localStorage.setItem('v_bulk_public_url', state.bulkPublicUrl);
  });
  elements.bulkTwilioSidInput.addEventListener('input', (e) => {
    state.bulkTwilioSid = e.target.value;
    localStorage.setItem('v_bulk_twilio_sid', state.bulkTwilioSid);
  });
  elements.bulkTwilioTokenInput.addEventListener('input', (e) => {
    state.bulkTwilioToken = e.target.value;
    localStorage.setItem('v_bulk_twilio_token', state.bulkTwilioToken);
  });
  elements.bulkTwilioNumberInput.addEventListener('input', (e) => {
    state.bulkTwilioNumber = e.target.value;
    localStorage.setItem('v_bulk_twilio_number', state.bulkTwilioNumber);
  });
  elements.bulkConcurrencySelect.addEventListener('change', (e) => {
    state.bulkConcurrency = e.target.value;
    localStorage.setItem('v_bulk_concurrency', state.bulkConcurrency);
  });
  elements.bulkVoiceSelect.addEventListener('change', (e) => {
    state.bulkVoice = e.target.value;
    localStorage.setItem('v_bulk_voice', state.bulkVoice);
  });
  
  elements.systemInstructionInput.addEventListener('input', (e) => {
    state.systemInstruction = e.target.value;
    localStorage.setItem('v_system_instruction', state.systemInstruction);
  });

  elements.clearTranscriptBtn.addEventListener('click', () => {
    if (state.activeMode === 'bulk' && state.monitoredCallSid === 'dashboard') {
      // Clear dashboard table logs
      elements.bulkLogTbody.innerHTML = `<tr><td colspan="4" class="table-empty">No calls queued. Start the campaign to see call logs.</td></tr>`;
      state.campaignTranscripts.clear();
    } else {
      elements.transcriptContainer.innerHTML = '<div class="system-message">Transcript cleared.</div>';
      if (state.monitoredCallSid !== 'dashboard') {
        state.campaignTranscripts.set(state.monitoredCallSid, []);
      }
    }
  });

  elements.connectBtn.addEventListener('click', handleConnectToggle);
  elements.muteBtn.addEventListener('click', handleMuteToggle);

  // Bulk click handlers
  elements.bulkStartBtn.addEventListener('click', handleBulkStartToggle);
  elements.bulkStopBtn.addEventListener('click', pauseBulkCampaign);
  
  // Monitor Dropdown selector change
  elements.bulkCallMonitorSelect.addEventListener('change', (e) => {
    switchMonitorView(e.target.value);
  });

  elements.toggleApiKeyBtn.addEventListener('click', () => {
    const isPassword = elements.providerKeyInput.type === 'password';
    elements.providerKeyInput.type = isPassword ? 'text' : 'password';
    elements.toggleApiKeyBtn.innerHTML = isPassword ? EYE_CLOSED_SVG : EYE_OPEN_SVG;
  });
  
  if (state.speechSynthesis.onvoiceschanged !== undefined) {
    state.speechSynthesis.onvoiceschanged = populateSystemVoices;
  }

  // Developer API Accordion Toggle
  const apiToggle = document.getElementById('api-docs-toggle');
  const apiContent = document.getElementById('api-docs-content');
  if (apiToggle && apiContent) {
    apiToggle.addEventListener('click', () => {
      const isHidden = apiContent.style.display === 'none';
      apiContent.style.display = isHidden ? 'block' : 'none';
      apiToggle.classList.toggle('active', isHidden);
      if (isHidden) {
        updateApiSnippets();
      }
    });
  }

  // Developer API Tabs Toggle
  const apiTabButtons = document.querySelectorAll('.api-tab-btn');
  apiTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      apiTabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const tabName = btn.getAttribute('data-api-tab');
      document.getElementById('snippet-curl').style.display = tabName === 'curl' ? 'block' : 'none';
      document.getElementById('snippet-python').style.display = tabName === 'python' ? 'block' : 'none';
      document.getElementById('snippet-node').style.display = tabName === 'node' ? 'block' : 'none';
    });
  });

  // Copy API Token
  const copyTokenBtn = document.getElementById('copy-token-btn');
  if (copyTokenBtn) {
    copyTokenBtn.addEventListener('click', () => {
      const token = document.getElementById('api-token-display').textContent;
      navigator.clipboard.writeText(token).then(() => {
        copyTokenBtn.textContent = 'Copied!';
        setTimeout(() => copyTokenBtn.textContent = 'Copy', 1500);
      });
    });
  }

  // Hook input changes to update snippets dynamically
  elements.publicUrlInput.addEventListener('input', updateApiSnippets);
  elements.bulkPublicUrlInput.addEventListener('input', updateApiSnippets);
  
  const apiActionSelect = document.getElementById('api-action-select');
  if (apiActionSelect) {
    apiActionSelect.addEventListener('change', updateApiSnippets);
  }
  
  // Initial snippet populate
  updateApiSnippets();
}

// Updates the Developer API documentation snippets with the active public domain/ngrok URL
function updateApiSnippets() {
  const publicUrl = state.activeMode === 'bulk' ? state.bulkPublicUrl : state.publicUrl;
  let domain = publicUrl ? publicUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : window.location.host;
  let protocol = publicUrl ? 'https://' : 'http://';
  
  if (!domain) {
    domain = 'localhost:3000';
    protocol = 'http://';
  }
  
  const fullBase = `${protocol}${domain}`;
  
  const apiActionSelect = document.getElementById('api-action-select');
  const action = apiActionSelect ? apiActionSelect.value : 'call';
  
  let curlCode = '';
  let pythonCode = '';
  let nodeCode = '';

  if (action === 'call') {
    curlCode = `curl -X POST ${fullBase}/api/v1/call \\
  -H "Authorization: Bearer vm_token_secure_987654" \\
  -H "Content-Type: application/json" \\
  -d '{"to": "+91XXXXXXXXXX"}'`;

    pythonCode = `import requests

url = "${fullBase}/api/v1/call"
headers = {
    "Authorization": "Bearer vm_token_secure_987654",
    "Content-Type": "application/json"
}
payload = {
    "to": "+91XXXXXXXXXX"
}

res = requests.post(url, json=payload, headers=headers)
print(res.json())`;

    nodeCode = `fetch("${fullBase}/api/v1/call", {
  method: "POST",
  headers: {
    "Authorization": "Bearer vm_token_secure_987654",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    to: "+91XXXXXXXXXX"
  })
})
.then(res => res.json())
.then(data => console.log(data));`;
  }
  else if (action === 'list') {
    curlCode = `curl -H "Authorization: Bearer vm_token_secure_987654" \\
  ${fullBase}/api/v1/calls`;

    pythonCode = `import requests

url = "${fullBase}/api/v1/calls"
headers = {
    "Authorization": "Bearer vm_token_secure_987654"
}

res = requests.get(url, headers=headers)
print(res.json())`;

    nodeCode = `fetch("${fullBase}/api/v1/calls", {
  method: "GET",
  headers: {
    "Authorization": "Bearer vm_token_secure_987654"
  }
})
.then(res => res.json())
.then(data => console.log(data));`;
  }
  else if (action === 'transcript') {
    curlCode = `curl -H "Authorization: Bearer vm_token_secure_987654" \\
  "${fullBase}/api/v1/calls?callSid=CAxxxxxxxxxxxxxxxx"`;

    pythonCode = `import requests

url = "${fullBase}/api/v1/calls"
headers = {
    "Authorization": "Bearer vm_token_secure_987654"
}
params = {
    "callSid": "CAxxxxxxxxxxxxxxxx"
}

res = requests.get(url, params=params, headers=headers)
print(res.json())`;

    nodeCode = `fetch("${fullBase}/api/v1/calls?callSid=CAxxxxxxxxxxxxxxxx", {
  method: "GET",
  headers: {
    "Authorization": "Bearer vm_token_secure_987654"
  }
})
.then(res => res.json())
.then(data => console.log(data));`;
  }
  else if (action === 'hangup') {
    curlCode = `curl -X POST ${fullBase}/api/v1/calls/terminate \\
  -H "Authorization: Bearer vm_token_secure_987654" \\
  -H "Content-Type: application/json" \\
  -d '{"callSid": "CAxxxxxxxxxxxxxxxx"}'`;

    pythonCode = `import requests

url = "${fullBase}/api/v1/calls/terminate"
headers = {
    "Authorization": "Bearer vm_token_secure_987654",
    "Content-Type": "application/json"
}
payload = {
    "callSid": "CAxxxxxxxxxxxxxxxx"
}

res = requests.post(url, json=payload, headers=headers)
print(res.json())`;

    nodeCode = `fetch("${fullBase}/api/v1/calls/terminate", {
  method: "POST",
  headers: {
    "Authorization": "Bearer vm_token_secure_987654",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    callSid: "CAxxxxxxxxxxxxxxxx"
  })
})
.then(res => res.json())
.then(data => console.log(data));`;
  }

  const snippetCurl = document.getElementById('snippet-curl');
  const snippetPython = document.getElementById('snippet-python');
  const snippetNode = document.getElementById('snippet-node');

  if (snippetCurl) snippetCurl.querySelector('code').textContent = curlCode;
  if (snippetPython) snippetPython.querySelector('code').textContent = pythonCode;
  if (snippetNode) snippetNode.querySelector('code').textContent = nodeCode;
}

// Adjust API Key display depending on model provider
function updateProviderInputs() {
  if (state.provider === 'ollama') {
    elements.providerKeyGroup.style.display = 'none';
  } else {
    elements.providerKeyGroup.style.display = 'flex';
    if (state.provider === 'groq') {
      elements.providerKeyLabel.textContent = 'Groq API Key';
      elements.providerKeyInput.placeholder = 'gsk_...';
      elements.providerKeyHelper.innerHTML = 'Get a free key from the <a href="https://console.groq.com/" target="_blank">Groq Console</a>.';
    } else if (state.provider === 'huggingface') {
      elements.providerKeyLabel.textContent = 'Hugging Face Token';
      elements.providerKeyInput.placeholder = 'hf_...';
      elements.providerKeyHelper.innerHTML = 'Get a free token from your <a href="https://huggingface.co/settings/tokens" target="_blank">Hugging Face Profile</a>.';
    }
  }
}

// Load default open-source model options based on selection
function updateModelOptions() {
  const modelSelect = elements.browserModelSelect;
  modelSelect.innerHTML = '';
  
  if (state.provider === 'ollama') {
    const options = [
      { value: 'qwen2.5:1.5b', text: 'Qwen 2.5 1.5B (Fast)' },
      { value: 'llama3:8b', text: 'Llama 3 8B' },
      { value: 'mistral', text: 'Mistral 7B' }
    ];
    options.forEach(opt => {
      const el = document.createElement('option');
      el.value = opt.value;
      el.textContent = opt.text;
      modelSelect.appendChild(el);
    });
    state.browserModel = 'qwen2.5:1.5b';
  } else if (state.provider === 'groq') {
    const options = [
      { value: 'llama-3.1-8b-instant', text: 'Llama 3.1 8B (Fast)' },
      { value: 'llama3-8b-8192', text: 'Llama 3 8B' },
      { value: 'gemma2-9b-it', text: 'Gemma 2 9B' }
    ];
    options.forEach(opt => {
      const el = document.createElement('option');
      el.value = opt.value;
      el.textContent = opt.text;
      modelSelect.appendChild(el);
    });
    state.browserModel = 'llama-3.1-8b-instant';
  } else if (state.provider === 'huggingface') {
    const options = [
      { value: 'meta-llama/Llama-3-8b-instruct', text: 'Llama 3 8B Instruct' },
      { value: 'Qwen/Qwen2.5-7B-Instruct', text: 'Qwen 2.5 7B Instruct' }
    ];
    options.forEach(opt => {
      const el = document.createElement('option');
      el.value = opt.value;
      el.textContent = opt.text;
      modelSelect.appendChild(el);
    });
    state.browserModel = 'meta-llama/Llama-3-8b-instruct';
  }
  modelSelect.value = state.browserModel;
  localStorage.setItem('v_browser_model', state.browserModel);
}

// Populate system voices for browser Text-To-Speech
function populateSystemVoices() {
  const voices = state.speechSynthesis.getVoices();
  const voiceSelect = elements.browserVoiceSelect;
  voiceSelect.innerHTML = '';
  
  if (voices.length === 0) {
    const el = document.createElement('option');
    el.textContent = 'Loading system voices...';
    voiceSelect.appendChild(el);
    return;
  }
  
  voices.forEach(voice => {
    const el = document.createElement('option');
    el.value = voice.name;
    el.textContent = `${voice.name} (${voice.lang})`;
    if (voice.name === state.browserVoiceName) {
      el.selected = true;
    }
    voiceSelect.appendChild(el);
  });
  
  if (!voiceSelect.value && voices.length > 0) {
    state.browserVoiceName = voices[0].name;
    localStorage.setItem('v_browser_voice_name', state.browserVoiceName);
  }
}

// Switch between tabs
function switchMode(mode) {
  if (state.isConnected) {
    alert('Please disconnect the current session before switching modes.');
    return;
  }
  
  state.activeMode = mode;
  state.sessionTokens = 0;
  elements.tokenMonitor.style.display = 'none';
  
  // Hide active monitors
  elements.bulkCallMonitorSelect.style.display = 'none';
  elements.bulkDashboardContainer.style.display = 'none';
  elements.transcriptContainer.style.display = 'block';
  elements.transcriptHeaderTitle.textContent = 'Live Conversation Transcript';
  state.monitoredCallSid = 'dashboard';
  
  if (mode === 'browser') {
    elements.tabBrowser.classList.add('active');
    elements.tabPhone.classList.remove('active');
    elements.tabBulk.classList.remove('active');
    
    elements.browserConfigFields.style.display = 'block';
    elements.phoneConfigFields.style.display = 'none';
    elements.bulkConfigFields.style.display = 'none';
    
    elements.singleCallStage.style.display = 'flex';
    elements.bulkCallStage.style.display = 'none';
    elements.muteBtn.style.display = 'flex';
    
    setStatus('disconnected', 'Disconnected');
    logSystem('Switched to Browser Mode. Uses your microphone and speakers.');
  } else if (mode === 'phone') {
    elements.tabBrowser.classList.remove('active');
    elements.tabPhone.classList.add('active');
    elements.tabBulk.classList.remove('active');
    
    elements.browserConfigFields.style.display = 'none';
    elements.phoneConfigFields.style.display = 'block';
    elements.bulkConfigFields.style.display = 'none';
    
    elements.singleCallStage.style.display = 'flex';
    elements.bulkCallStage.style.display = 'none';
    elements.muteBtn.style.display = 'none'; // Call mode hides mic mute
    
    setStatus('disconnected', 'Disconnected');
    logSystem('Switched to Phone Call Mode. Connects to Twilio and places outbound calls.');
  } else if (mode === 'bulk') {
    elements.tabBrowser.classList.remove('active');
    elements.tabPhone.classList.remove('active');
    elements.tabBulk.classList.add('active');
    
    elements.browserConfigFields.style.display = 'none';
    elements.phoneConfigFields.style.display = 'none';
    elements.bulkConfigFields.style.display = 'block';
    
    elements.singleCallStage.style.display = 'none';
    elements.bulkCallStage.style.display = 'block';
    
    // Default bulk mode view to table dashboard logs
    elements.bulkCallMonitorSelect.style.display = 'block';
    switchMonitorView('dashboard');
    
    setBulkStatus('inactive', 'Inactive');
    logSystem('Switched to Bulk Campaign Mode. Outbound concurrent calling dashboard.');
  }
}

// Update single call status dot
function setStatus(statusClass, label) {
  elements.statusDot.className = 'status-indicator-dot ' + statusClass;
  elements.statusLabel.textContent = label;
  
  if (statusClass === 'disconnected') {
    elements.connectBtn.className = 'btn btn-primary';
    elements.connectBtnText.textContent = state.activeMode === 'browser' ? 'Connect Session' : 'Place Phone Call';
    elements.muteBtn.disabled = true;
    elements.muteBtn.classList.add('disabled');
    state.inputVolume = 0;
    state.outputVolume = 0;
  } else if (statusClass === 'connecting') {
    elements.connectBtn.className = 'btn btn-secondary';
    elements.connectBtnText.textContent = 'Connecting...';
  } else {
    elements.connectBtn.className = 'btn btn-secondary';
    elements.connectBtnText.textContent = 'Disconnect';
    elements.muteBtn.disabled = false;
    elements.muteBtn.classList.remove('disabled');
  }
}

// Update bulk campaign status tag
function setBulkStatus(statusClass, label) {
  elements.campaignStatusTag.className = 'header-tag ' + statusClass;
  elements.campaignStatusTag.textContent = label;
  
  if (statusClass === 'inactive' || statusClass === 'finished') {
    elements.bulkStartBtn.className = 'btn btn-primary';
    elements.bulkStartBtn.querySelector('.btn-text').textContent = 'Start Campaign';
    elements.bulkStartBtn.querySelector('.btn-icon').textContent = '▶';
    elements.bulkStopBtn.disabled = true;
    elements.bulkStopBtn.classList.add('disabled');
    state.isConnected = false;
  } else if (statusClass === 'calling') {
    elements.bulkStartBtn.className = 'btn btn-secondary';
    elements.bulkStartBtn.querySelector('.btn-text').textContent = 'Stop/Pause';
    elements.bulkStartBtn.querySelector('.btn-icon').textContent = '⏸';
    elements.bulkStopBtn.disabled = false;
    elements.bulkStopBtn.classList.remove('disabled');
    state.isConnected = true;
  }
}

// Renders chat bubble
function logTranscript(sender, text, isUser = false) {
  const systemMsg = elements.transcriptContainer.querySelector('.system-message');
  if (systemMsg) systemMsg.remove();
  
  if (isUser) {
    const bubble = document.createElement('div');
    bubble.className = 'transcript-bubble user';
    bubble.innerHTML = `
      <span class="bubble-sender">You</span>
      <div class="bubble-content"></div>
    `;
    bubble.querySelector('.bubble-content').textContent = text;
    elements.transcriptContainer.appendChild(bubble);
    scrollTranscriptToBottom();
    state.currentAgentBubble = null;
  } else {
    if (!state.currentAgentBubble) {
      state.currentAgentBubble = document.createElement('div');
      state.currentAgentBubble.className = 'transcript-bubble agent';
      state.currentAgentBubble.innerHTML = `
        <span class="bubble-sender">Agent</span>
        <div class="bubble-content"></div>
      `;
      elements.transcriptContainer.appendChild(state.currentAgentBubble);
    }
    const contentDiv = state.currentAgentBubble.querySelector('.bubble-content');
    contentDiv.textContent += text;
    scrollTranscriptToBottom();
  }
}

function logSystem(text, isError = false) {
  const msg = document.createElement('div');
  msg.className = isError ? 'error-message' : 'system-message';
  msg.textContent = text;
  elements.transcriptContainer.appendChild(msg);
  scrollTranscriptToBottom();
}

function scrollTranscriptToBottom() {
  elements.transcriptContainer.scrollTop = elements.transcriptContainer.scrollHeight;
}

// Toggle mute on browser mode microphone
function handleMuteToggle() {
  if (state.activeMode !== 'browser' || !state.isConnected) return;
  state.isMuted = !state.isMuted;
  
  if (state.isMuted) {
    elements.muteBtn.classList.add('muted');
    elements.muteBtn.title = 'Unmute Microphone';
    setStatus('connecting', 'Muted');
    if (state.recognition) state.recognition.stop();
  } else {
    elements.muteBtn.classList.remove('muted');
    elements.muteBtn.title = 'Mute Microphone';
    setStatus('listening', 'Listening');
    if (state.recognition && !state.isSpeechSpeaking) {
      try {
        state.recognition.start();
      } catch (e) {}
    }
  }
}

// Connect / Disconnect handles
async function handleConnectToggle() {
  if (state.isConnected) {
    if (state.activeMode === 'browser') {
      stopBrowserMode();
    } else {
      await stopPhoneMode();
    }
  } else {
    if (state.activeMode === 'browser') {
      await startBrowserMode();
    } else {
      await startPhoneMode();
    }
  }
}

/* ==========================================================================
   BROWSER MODE: LOCAL STT / LLM / TTS
   ========================================================================== */

async function startBrowserMode() {
  if (state.provider !== 'ollama' && !state.browserApiKey) {
    alert(`Please enter the API Key for ${state.provider} in the configuration drawer.`);
    elements.settingsPanel.classList.remove('card-hidden');
    return;
  }
  
  setStatus('connecting', 'Starting audio capture...');
  logSystem('Initializing local voice recognition...');
  
  try {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      throw new Error('Your browser does not support Web Speech SpeechRecognition. Please use Chrome or Edge.');
    }
    
    state.browserMicContext = new (window.AudioContext || window.webkitAudioContext)();
    state.browserMicStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = state.browserMicContext.createMediaStreamSource(state.browserMicStream);
    state.browserMicAnalyser = state.browserMicContext.createAnalyser();
    state.browserMicAnalyser.fftSize = 256;
    source.connect(state.browserMicAnalyser);
    
    state.recognition = new SpeechRecognition();
    state.recognition.continuous = true;
    state.recognition.interimResults = false;
    state.recognition.lang = 'en-IN';
    
    state.recognition.onstart = () => {
      if (!state.isMuted) {
        setStatus('listening', 'Listening');
      }
    };
    
    state.recognition.onresult = async (event) => {
      if (state.isSpeechSpeaking || state.isMuted) return;
      
      const transcriptText = event.results[event.results.length - 1][0].transcript.trim();
      if (!transcriptText) return;
      
      logTranscript('You', transcriptText, true);
      state.recognition.stop();
      state.isSpeechSpeaking = true;
      setStatus('thinking', 'Thinking...');
      
      await queryLocalLLM(transcriptText);
    };
    
    state.recognition.onerror = (event) => {
      console.error('[STT] Error:', event.error);
      if (event.error === 'not-allowed') {
        logSystem('Microphone permission blocked.', true);
        stopBrowserMode();
      }
    };
    
    state.recognition.onend = () => {
      if (state.isConnected && !state.isMuted && !state.isSpeechSpeaking) {
        try {
          state.recognition.start();
        } catch (e) {}
      }
    };
    
    state.recognition.start();
    state.isConnected = true;
    state.isMuted = false;
    elements.muteBtn.classList.remove('muted');
    logSystem('Voice session active. Start speaking.');
    
  } catch (err) {
    console.error('Browser Mode error:', err);
    logSystem(err.message, true);
    stopBrowserMode();
  }
}

async function queryLocalLLM(promptText) {
  try {
    const payload = {
      provider: state.provider,
      model: state.browserModel,
      apiKey: state.browserApiKey,
      systemInstruction: state.systemInstruction,
      prompt: promptText
    };
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const resJson = await response.json();
    
    if (response.ok && resJson.response) {
      const agentResponse = resJson.response;
      
      // Update token stats if usage is returned
      if (resJson.usage) {
        elements.tokenMonitor.style.display = 'flex';
        elements.statPrompt.textContent = resJson.usage.prompt;
        elements.statCompletion.textContent = resJson.usage.completion;
        elements.statTotal.textContent = resJson.usage.total;
        
        state.sessionTokens += resJson.usage.total;
        elements.statSession.textContent = state.sessionTokens;
      }
      
      speakLocalTTS(agentResponse);
    } else {
      throw new Error(resJson.error || 'Failed to get reply from model.');
    }
  } catch (err) {
    console.error('LLM Request failed:', err);
    logSystem(err.message, true);
    state.isSpeechSpeaking = false;
    setStatus('listening', 'Listening');
    if (state.recognition && !state.isMuted) {
      try {
        state.recognition.start();
      } catch (e) {}
    }
  }
}

function speakLocalTTS(text) {
  state.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  
  if (state.browserVoiceName) {
    const voices = state.speechSynthesis.getVoices();
    const voice = voices.find(v => v.name === state.browserVoiceName);
    if (voice) utterance.voice = voice;
  }
  
  utterance.onstart = () => {
    setStatus('speaking', 'Speaking');
    state.isSpeechSpeaking = true;
    logTranscript('Agent', text, false);
    simulateSpeechVolumeWave();
  };
  
  utterance.onend = () => {
    state.isSpeechSpeaking = false;
    state.simulatedSpeakerVolume = 0;
    setStatus('listening', 'Listening');
    if (state.recognition && !state.isMuted && state.isConnected) {
      try {
        state.recognition.start();
      } catch (e) {}
    }
  };
  
  utterance.onerror = () => {
    state.isSpeechSpeaking = false;
    state.simulatedSpeakerVolume = 0;
    setStatus('listening', 'Listening');
    if (state.recognition && !state.isMuted && state.isConnected) {
      try {
        state.recognition.start();
      } catch (e) {}
    }
  };
  
  state.speechSynthesis.speak(utterance);
}

function simulateSpeechVolumeWave() {
  if (!state.isSpeechSpeaking) {
    state.simulatedSpeakerVolume = 0;
    return;
  }
  state.simulatedSpeakerVolume = 15 + Math.random() * 45;
  setTimeout(simulateSpeechVolumeWave, 100);
}

function stopBrowserMode() {
  state.isConnected = false;
  state.isSpeechSpeaking = false;
  state.simulatedSpeakerVolume = 0;
  
  if (state.recognition) {
    state.recognition.stop();
    state.recognition = null;
  }
  if (state.speechSynthesis) {
    state.speechSynthesis.cancel();
  }
  if (state.browserMicStream) {
    state.browserMicStream.getTracks().forEach(track => track.stop());
    state.browserMicStream = null;
  }
  if (state.browserMicContext) {
    state.browserMicContext.close();
    state.browserMicContext = null;
  }
  state.browserMicAnalyser = null;
  
  setStatus('disconnected', 'Disconnected');
  logSystem('Voice session disconnected.');
}

/* ==========================================================================
   PHONE MODE: SINGLE OUTBOUND TWILIO DIAL
   ========================================================================== */

async function startPhoneMode() {
  if (!state.geminiApiKey || !state.targetPhone || !state.publicUrl || !state.twilioSid || !state.twilioToken || !state.twilioNumber) {
    alert('Please fill out all settings including Gemini API Key, Target Phone, Public Server URL, and Twilio Credentials.');
    elements.settingsPanel.classList.remove('card-hidden');
    return;
  }
  
  setStatus('connecting', 'Initiating call...');
  logSystem('Opening call UI bridge WebSocket...');
  
  try {
    const loc = window.location;
    const wsProto = loc.protocol === 'https:' ? 'wss:' : 'ws';
    const wsUrl = `${wsProto}://${loc.host}/api/ui-stream`;
    
    state.uiWebSocket = new WebSocket(wsUrl);
    
    state.uiWebSocket.onopen = () => {
      logSystem('Call bridge connected. Placing outbound phone call...');
      triggerTwilioCall();
    };
    
    state.uiWebSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleCallBridgeMessage(data);
    };
    
    state.uiWebSocket.onclose = () => {
      stopPhoneMode();
    };
    
  } catch (err) {
    logSystem(err.message, true);
    stopPhoneMode();
  }
}

async function triggerTwilioCall() {
  try {
    const payload = {
      to: state.targetPhone,
      twilioSid: state.twilioSid,
      twilioToken: state.twilioToken,
      twilioNumber: state.twilioNumber,
      publicUrl: state.publicUrl,
      apiKey: state.geminiApiKey,
      model: state.phoneModel,
      voice: state.phoneVoice,
      systemInstruction: state.systemInstruction
    };
    
    const response = await fetch('/api/make-call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const resData = await response.json();
    if (response.ok && resData.success) {
      state.currentCallSid = resData.callSid;
      logSystem(`Call placed successfully! Call SID: ${resData.callSid}`);
      logSystem(`Waiting for answer...`);
      setStatus('connecting', 'Dialing...');
      state.isConnected = true;
    } else {
      throw new Error(resData.error || 'Failed to place Twilio call.');
    }
  } catch (err) {
    logSystem(err.message, true);
    stopPhoneMode();
  }
}

function handleCallBridgeMessage(data) {
  if (state.activeMode === 'bulk') {
    handleBulkProgressMessage(data);
    return;
  }
  
  switch (data.event) {
    case 'call-status':
      logSystem(data.message);
      if (data.status === 'connected' || data.status === 'active') {
        setStatus('listening', 'Call Active');
      } else if (data.status === 'speaking') {
        setStatus('speaking', 'AI Agent speaking');
      } else if (data.status === 'disconnected') {
        stopPhoneMode();
      }
      break;
      
    case 'transcript':
      logTranscript(data.sender, data.text, data.isUser);
      break;
      
    case 'vol-input':
      state.inputVolume = data.value;
      break;
      
    case 'vol-output':
      state.outputVolume = data.value;
      break;
      
    case 'interrupted':
      state.currentAgentBubble = null;
      setStatus('listening', 'Call Active');
      break;
  }
}

async function stopPhoneMode() {
  state.isConnected = false;
  state.currentCallSid = null;
  if (state.uiWebSocket) {
    if (state.uiWebSocket.readyState === WebSocket.OPEN) {
      state.uiWebSocket.close();
    }
    state.uiWebSocket = null;
  }
  setStatus('disconnected', 'Disconnected');
  logSystem('Call Session disconnected.');
}


/* ==========================================================================
   BULK MODE: HIGH-CONCURRENCY CAMPAIGN MANAGER
   ========================================================================== */

// Switches view between dashboard log list and call transcripts
function switchMonitorView(viewSid) {
  state.monitoredCallSid = viewSid;
  
  if (viewSid === 'dashboard') {
    elements.bulkDashboardContainer.style.display = 'block';
    elements.transcriptContainer.style.display = 'none';
    elements.transcriptHeaderTitle.textContent = 'Campaign Logs Dashboard';
  } else {
    elements.bulkDashboardContainer.style.display = 'none';
    elements.transcriptContainer.style.display = 'block';
    
    // Load Call Details
    let number = 'Unknown';
    if (state.campaignStats) {
      const activeCall = state.campaignStats.activeCallsList.find(c => c.sid === viewSid);
      const historyCall = state.campaignStats.history.find(c => c.sid === viewSid);
      const call = activeCall || historyCall;
      if (call) number = call.number;
    }
    
    elements.transcriptHeaderTitle.textContent = `Call: ${number}`;
    
    // Populate transcript container with cached lines
    elements.transcriptContainer.innerHTML = '';
    const transcript = state.campaignTranscripts.get(viewSid) || [];
    
    if (transcript.length === 0) {
      elements.transcriptContainer.innerHTML = `<div class="system-message">Call connected. Waiting for conversation transcription...</div>`;
    } else {
      transcript.forEach(line => {
        // Feed into standard chat log UI
        const bubble = document.createElement('div');
        bubble.className = line.isUser ? 'transcript-bubble user' : 'transcript-bubble agent';
        bubble.innerHTML = `
          <span class="bubble-sender">${line.sender}</span>
          <div class="bubble-content"></div>
        `;
        bubble.querySelector('.bubble-content').textContent = line.text;
        elements.transcriptContainer.appendChild(bubble);
      });
      scrollTranscriptToBottom();
    }
  }
}

// Start campaign triggers
async function handleBulkStartToggle() {
  if (state.isConnected) {
    // If active, stop it
    await pauseBulkCampaign();
  } else {
    await startBulkCampaign();
  }
}

async function startBulkCampaign() {
  const numbersText = elements.bulkNumbersInput.value.trim();
  
  if (!numbersText || !state.bulkGeminiKey || !state.bulkPublicUrl || !state.bulkTwilioSid || !state.bulkTwilioToken || !state.bulkTwilioNumber) {
    alert('Please fill out all settings including Gemini Key, public server URL, Twilio Credentials, and add target phone numbers.');
    elements.settingsPanel.classList.remove('card-hidden');
    return;
  }
  
  // Parse numbers (split by comma/new line)
  const numbers = numbersText.split(/[\n,]+/).map(n => n.trim()).filter(n => n.length > 0);
  
  if (numbers.length === 0) {
    alert('No valid phone numbers found in the list.');
    return;
  }
  
  setBulkStatus('calling', 'Active');
  logSystem(`Starting Campaign with ${numbers.length} numbers...`);
  
  // Reset logs
  state.campaignTranscripts.clear();
  elements.bulkLogTbody.innerHTML = '';
  
  try {
    // Connect WebSocket UI stream first
    if (!state.uiWebSocket || state.uiWebSocket.readyState !== WebSocket.OPEN) {
      const loc = window.location;
      const wsProto = loc.protocol === 'https:' ? 'wss:' : 'ws';
      const wsUrl = `${wsProto}://${loc.host}/api/ui-stream`;
      state.uiWebSocket = new WebSocket(wsUrl);
      
      state.uiWebSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleCallBridgeMessage(data);
      };
      
      state.uiWebSocket.onopen = () => {
        console.log('[Bulk WS] UI stream connected.');
        postBulkStart(numbers);
      };
      
      state.uiWebSocket.onclose = () => {
        console.log('[Bulk WS] Connection closed.');
        setBulkStatus('inactive', 'Inactive');
      };
    } else {
      postBulkStart(numbers);
    }
  } catch (err) {
    logSystem(err.message, true);
    setBulkStatus('inactive', 'Inactive');
  }
}

async function postBulkStart(numbers) {
  const payload = {
    numbers,
    maxConcurrent: state.bulkConcurrency,
    twilioSid: state.bulkTwilioSid,
    twilioToken: state.bulkTwilioToken,
    twilioNumber: state.bulkTwilioNumber,
    publicUrl: state.bulkPublicUrl,
    apiKey: state.bulkGeminiKey,
    model: state.phoneModel,
    voice: state.bulkVoice,
    systemInstruction: state.systemInstruction
  };
  
  const response = await fetch('/api/start-bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || 'Failed to trigger campaign on server.');
  }
  
  logSystem('Campaign manager active.');
}

async function pauseBulkCampaign() {
  try {
    const response = await fetch('/api/stop-bulk', { method: 'POST' });
    if (response.ok) {
      logSystem('Campaign paused by user.');
      setBulkStatus('inactive', 'Paused');
    }
  } catch (e) {
    console.error(e);
  }
}

// Handles socket stream updates for bulk progress
function handleBulkProgressMessage(data) {
  if (data.event === 'bulk-status') {
    state.campaignStats = data;
    
    // Update Stats counters
    elements.statBulkQueued.textContent = data.queued;
    elements.statBulkActive.textContent = data.active;
    elements.statBulkCompleted.textContent = data.completed;
    elements.statBulkFailed.textContent = data.failed;
    
    // Calculate progress percentage
    const processed = data.completed + data.failed;
    const progress = data.total > 0 ? Math.round((processed / data.total) * 100) : 0;
    
    elements.bulkProgressPercent.textContent = `${progress}%`;
    elements.bulkProgressBarFill.style.width = `${progress}%`;
    
    // Update status tag
    if (data.finished) {
      setBulkStatus('finished', 'Completed');
      logSystem('Outbound Campaign completed successfully.');
    } else if (state.isConnected) {
      setBulkStatus('calling', 'Active');
    }
    
    // Update dashboard log table
    renderBulkLogTable(data.activeCallsList, data.history);
    
    // Update dropdown options
    updateMonitorDropdown(data.activeCallsList, data.history);
  }
  
  // Handles incoming real-time speech line updates
  if (data.event === 'bulk-transcript') {
    const { callSid, line } = data;
    
    // Add to local transcript cache
    if (!state.campaignTranscripts.has(callSid)) {
      state.campaignTranscripts.set(callSid, []);
    }
    state.campaignTranscripts.get(callSid).push(line);
    
    // If currently monitoring this specific call, append it to UI immediately
    if (state.monitoredCallSid === callSid) {
      const bubble = document.createElement('div');
      bubble.className = line.isUser ? 'transcript-bubble user' : 'transcript-bubble agent';
      bubble.innerHTML = `
        <span class="bubble-sender">${line.sender}</span>
        <div class="bubble-content"></div>
      `;
      bubble.querySelector('.bubble-content').textContent = line.text;
      
      const systemMsg = elements.transcriptContainer.querySelector('.system-message');
      if (systemMsg) systemMsg.remove();
      
      elements.transcriptContainer.appendChild(bubble);
      scrollTranscriptToBottom();
    }
  }
}

// Renders the logs table rows dynamically
function renderBulkLogTable(activeCalls, history) {
  const tbody = elements.bulkLogTbody;
  tbody.innerHTML = '';
  
  if (activeCalls.length === 0 && history.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="table-empty">No calls active. Waiting for dial queues...</td></tr>`;
    return;
  }
  
  // Render active calls first
  activeCalls.forEach(call => {
    const tr = document.createElement('tr');
    
    const duration = Math.round((Date.now() - call.startTime) / 1000);
    
    tr.innerHTML = `
      <td><strong>${call.number}</strong></td>
      <td><span class="call-badge active">Active</span></td>
      <td>${duration}s</td>
      <td><button class="action-link-btn" onclick="switchMonitorView('${call.sid}')">Monitor</button></td>
    `;
    tbody.appendChild(tr);
  });
  
  // Render completed history
  history.forEach(call => {
    const tr = document.createElement('tr');
    const badgeClass = call.status === 'completed' ? 'completed' : 'failed';
    const duration = call.duration || 0;
    
    tr.innerHTML = `
      <td>${call.number}</td>
      <td><span class="call-badge ${badgeClass}">${call.status}</span></td>
      <td>${duration}s</td>
      <td><button class="action-link-btn" onclick="switchMonitorView('${call.sid}')">Logs</button></td>
    `;
    tbody.appendChild(tr);
  });
}

// Populates active calls to select dropdown in panel header
function updateMonitorDropdown(activeCalls, history) {
  const select = elements.bulkCallMonitorSelect;
  const currentVal = select.value;
  
  select.innerHTML = '<option value="dashboard">📋 Campaign Dashboard Grid</option>';
  
  // Add active calls
  activeCalls.forEach(call => {
    const opt = document.createElement('option');
    opt.value = call.sid;
    opt.textContent = `📞 Call: ${call.number} (Active)`;
    select.appendChild(opt);
  });
  
  // Add completed calls
  history.forEach(call => {
    const opt = document.createElement('option');
    opt.value = call.sid;
    opt.textContent = `📄 Logs: ${call.number} (${call.status})`;
    select.appendChild(opt);
  });
  
  select.value = currentVal;
  
  // If selected option was lost (e.g. call disconnected), revert to dashboard grid
  if (!select.value) {
    select.value = 'dashboard';
    switchMonitorView('dashboard');
  }
}

// Make switchMonitorView accessible globally so inline buttons work
window.switchMonitorView = switchMonitorView;

/* ==========================================================================
   VISUALIZER CANVAS RENDERING
   ========================================================================== */

const canvasCtx = elements.canvas.getContext('2d');
let visualizerPhase = 0;

function drawVisualizer() {
  requestAnimationFrame(drawVisualizer);
  
  const width = elements.canvas.width = elements.canvas.clientWidth;
  const height = elements.canvas.height = elements.canvas.clientHeight;
  const centerY = height / 2;
  
  canvasCtx.clearRect(0, 0, width, height);
  
  let micLevel = 0;
  let speakerLevel = 0;
  let mode = 'disconnected';
  
  if (state.activeMode === 'browser') {
    if (!state.isConnected) {
      mode = 'disconnected';
    } else if (state.isMuted) {
      mode = 'muted';
    } else if (state.isSpeechSpeaking) {
      mode = 'speaking';
      speakerLevel = state.simulatedSpeakerVolume;
    } else if (elements.statusLabel.textContent === 'Thinking...') {
      mode = 'thinking';
    } else {
      mode = 'listening';
      if (state.browserMicAnalyser) {
        const inputData = new Uint8Array(state.browserMicAnalyser.frequencyBinCount);
        state.browserMicAnalyser.getByteFrequencyData(inputData);
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i];
        }
        micLevel = sum / inputData.length;
      }
    }
  } else if (state.activeMode === 'phone') {
    if (!state.isConnected) {
      mode = 'disconnected';
    } else if (elements.statusLabel.textContent === 'Dialing...') {
      mode = 'thinking';
    } else if (elements.statusLabel.textContent === 'AI Agent speaking') {
      mode = 'speaking';
      speakerLevel = state.outputVolume * 2.0;
    } else {
      mode = 'listening';
      micLevel = state.inputVolume * 2.0;
    }
  } else {
    // Bulk mode visualizer stays inactive
    mode = 'disconnected';
  }
  
  if (mode === 'disconnected' || mode === 'muted') {
    drawSineWave(3, 0.2, 0.01, '#4b5563', width, centerY, visualizerPhase);
  } else if (mode === 'listening') {
    const ampScale = 5 + (micLevel / 4);
    drawSineWave(ampScale, 0.4, 0.02, 'rgba(0, 240, 255, 0.25)', width, centerY, visualizerPhase);
    drawSineWave(ampScale * 0.6, 0.6, 0.03, 'rgba(189, 0, 255, 0.2)', width, centerY, -visualizerPhase * 0.7);
    drawSineWave(ampScale * 0.3, 0.8, 0.015, '#00f0ff', width, centerY, visualizerPhase * 1.3);
  } else if (mode === 'speaking') {
    const ampScale = 8 + (speakerLevel / 3);
    drawSineWave(ampScale, 0.4, 0.025, 'rgba(189, 0, 255, 0.35)', width, centerY, visualizerPhase);
    drawSineWave(ampScale * 0.7, 0.6, 0.012, 'rgba(0, 240, 255, 0.2)', width, centerY, -visualizerPhase * 0.8);
    drawSineWave(ampScale * 0.4, 0.8, 0.035, '#bd00ff', width, centerY, visualizerPhase * 1.2);
  } else if (mode === 'thinking') {
    drawSineWave(12, 0.5, 0.05, '#f59e0b', width, centerY, visualizerPhase * 2);
    drawSineWave(6, 0.7, 0.08, 'rgba(245, 158, 11, 0.3)', width, centerY, -visualizerPhase * 1.5);
  }
  
  visualizerPhase += 0.03;
}

function drawSineWave(amplitude, opacity, frequency, color, width, centerY, phase) {
  canvasCtx.beginPath();
  canvasCtx.strokeStyle = color;
  canvasCtx.globalAlpha = opacity;
  canvasCtx.lineWidth = 2.5;
  canvasCtx.shadowBlur = 12;
  canvasCtx.shadowColor = color;
  
  for (let x = 0; x < width; x++) {
    const edgeFade = Math.sin((x / width) * Math.PI);
    const y = centerY + Math.sin(x * frequency + phase) * amplitude * edgeFade;
    if (x === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }
  }
  canvasCtx.stroke();
  canvasCtx.shadowBlur = 0;
  canvasCtx.globalAlpha = 1.0;
}

// Start Visualizer rendering
drawVisualizer();

// Initialize app elements on load
document.addEventListener('DOMContentLoaded', () => {
  initUI();
  switchMode('browser');
  console.log('VenuMind AI bulk voice client loaded.');
});
