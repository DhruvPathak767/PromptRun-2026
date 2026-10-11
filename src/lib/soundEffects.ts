/**
 * Zero-dependency Web Audio API Sound Synthesizer
 * Generates pleasant, accessible audio feedback without external audio assets.
 */

let isMuted = false

export function setAudioMuted(muted: boolean) {
  isMuted = muted
  try {
    localStorage.setItem('rupeeflow_audio_muted', String(muted))
  } catch {
    // Ignore
  }
}

export function getAudioMuted(): boolean {
  if (typeof window === 'undefined') return true
  try {
    return localStorage.getItem('rupeeflow_audio_muted') === 'true'
  } catch {
    return false
  }
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  if (!AudioCtx) return null
  try {
    return new AudioCtx()
  } catch {
    return null
  }
}

/**
 * Pleasant soft chime for transactions & saves
 */
export function playChimeSound() {
  if (isMuted || getAudioMuted()) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12) // A5

    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.3)
  } catch {
    // Graceful silent fallback
  }
}

/**
 * Warning cue for deficit or over-budget alert
 */
export function playWarningSound() {
  if (isMuted || getAudioMuted()) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(320, ctx.currentTime)
    osc.frequency.setValueAtTime(240, ctx.currentTime + 0.08)

    gain.gain.setValueAtTime(0.06, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.25)
  } catch {
    // Graceful silent fallback
  }
}

/**
 * Fanfare for streak milestones and badge unlock
 */
export function playFanfareSound() {
  if (isMuted || getAudioMuted()) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07)

      gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.07)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.25)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime + idx * 0.07)
      osc.stop(ctx.currentTime + idx * 0.07 + 0.25)
    })
  } catch {
    // Graceful silent fallback
  }
}
