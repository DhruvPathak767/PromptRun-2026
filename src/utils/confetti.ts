import type { Options } from 'canvas-confetti'

/**
 * Dynamically loads and triggers canvas-confetti only on user interaction.
 * Keeps initial bundle lightweight by avoiding static imports of canvas-confetti.
 *
 * @param options - Confetti particle configuration options
 */
export async function triggerConfetti(options?: Options): Promise<void> {
  try {
    const confettiModule = await import('canvas-confetti')
    const confetti = confettiModule.default
    confetti(options)
  } catch {
    // Non-blocking fallback for non-DOM or test environments
  }
}
