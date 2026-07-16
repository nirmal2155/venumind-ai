class PCMProcessor extends AudioWorkletProcessor {
  process(inputs, _outputs, _parameters) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;
    
    const channelData = input[0]; // Get the first (mono) channel
    if (!channelData || channelData.length === 0) return true;
    
    const len = channelData.length;
    const pcmData = new Int16Array(len);
    
    for (let i = 0; i < len; i++) {
      // Clamp the float sample to the [-1.0, 1.0] range to prevent clipping
      const s = Math.max(-1.0, Math.min(1.0, channelData[i]));
      // Convert float sample to 16-bit signed integer PCM
      pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    
    // Send the raw ArrayBuffer to the main thread using transferable objects
    // to achieve zero-copy transfer and avoid garbage collection overhead.
    this.port.postMessage(pcmData.buffer, [pcmData.buffer]);
    return true;
  }
}

registerProcessor('pcm-processor', PCMProcessor);
