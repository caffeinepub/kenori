export type SoundType = "rain" | "cafe" | "night";

let ctx: AudioContext | null = null;
let _gainNode: GainNode | null = null;
let sourceNode: AudioBufferSourceNode | null = null;
let currentType: SoundType | null = null;

function getCtx() {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function generateNoise(
  audioCtx: AudioContext,
  duration: number,
  type: SoundType,
): AudioBuffer {
  const sampleRate = audioCtx.sampleRate;
  const bufLen = sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufLen, sampleRate);
  const data = buffer.getChannelData(0);

  if (type === "rain") {
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    for (let i = 0; i < bufLen; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.11;
    }
  } else if (type === "cafe") {
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    let b3 = 0;
    let b4 = 0;
    for (let i = 0; i < bufLen; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      data[i] = (b0 + b1 + b2 + b3 + b4) * 0.06;
    }
  } else {
    let b0 = 0;
    let b1 = 0;
    for (let i = 0; i < bufLen; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0250759;
      data[i] = (b0 + b1) * 0.05;
    }
  }
  return buffer;
}

export function playSound(type: SoundType) {
  stopSound();
  const audioCtx = getCtx();
  if (audioCtx.state === "suspended") audioCtx.resume();

  const buffer = generateNoise(audioCtx, 4, type);
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const gain = audioCtx.createGain();
  gain.gain.value = 0.7;

  source.connect(gain);
  gain.connect(audioCtx.destination);
  source.start();

  sourceNode = source;
  _gainNode = gain;
  currentType = type;
}

export function stopSound() {
  if (sourceNode) {
    try {
      sourceNode.stop();
    } catch {
      // already stopped
    }
    sourceNode = null;
  }
  _gainNode = null;
  currentType = null;
}

export function getCurrentSound(): SoundType | null {
  return currentType;
}
