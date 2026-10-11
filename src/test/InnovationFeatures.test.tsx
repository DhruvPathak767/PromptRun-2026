import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { FinanceProvider } from '../state/FinanceProvider'
import { ImpulseBusterModal } from '../components/innovation/ImpulseBusterModal'
import { SurvivalStreakBadge } from '../components/innovation/SurvivalStreakBadge'
import { MoneyVibeCardModal } from '../components/innovation/MoneyVibeCardModal'
import { BrokeModeModal } from '../components/innovation/BrokeModeModal'
import { TimeTravelScrubber } from '../components/innovation/TimeTravelScrubber'
import { KeyboardShortcutsModal } from '../components/innovation/KeyboardShortcutsModal'

describe('Gen Z Innovation & Creativity Features', () => {
  it('ImpulseBusterModal accurately converts impulse prices into Chai and Campus Meal metrics', () => {
    const handleClose = vi.fn()

    render(
      <MemoryRouter>
        <FinanceProvider>
          <ImpulseBusterModal isOpen={true} onClose={handleClose} />
        </FinanceProvider>
      </MemoryRouter>
    )

    expect(screen.getByText(/Impulse Buy Reality Checker/i)).toBeInTheDocument()
    expect(screen.getByText(/Cups of Tapri Chai/i)).toBeInTheDocument()
    expect(screen.getByText(/Campus Thali Meals/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Lock in 24h Cool-Down Chamber/i })).toBeInTheDocument()
  })

  it('SurvivalStreakBadge renders Day-by-Day cycle gamification and badges', () => {
    render(
      <FinanceProvider>
        <SurvivalStreakBadge />
      </FinanceProvider>
    )

    expect(screen.getByText(/Survive the Month Challenge/i)).toBeInTheDocument()
    expect(screen.getByText(/Survival Probability/i)).toBeInTheDocument()
    expect(screen.getByText(/Discretionary Discipline/i)).toBeInTheDocument()
    expect(screen.getByText(/Zen Cash Buffer/i)).toBeInTheDocument()
  })

  it('MoneyVibeCardModal renders personalized financial archetype and copy action', () => {
    const handleClose = vi.fn()

    render(
      <FinanceProvider>
        <MoneyVibeCardModal isOpen={true} onClose={handleClose} />
      </FinanceProvider>
    )

    expect(screen.getByText(/My 30-Day Financial Vibe Card/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Copy Shareable Vibe/i })).toBeInTheDocument()
  })

  it('BrokeModeModal renders 3-step prioritized triage and emergency bailout button', () => {
    const handleClose = vi.fn()

    render(
      <FinanceProvider>
        <BrokeModeModal isOpen={true} onClose={handleClose} />
      </FinanceProvider>
    )

    expect(screen.getByText(/Broke Mode Auto-Triage/i)).toBeInTheDocument()
    expect(screen.getByText(/Algorithmic 3-Step Rescue Plan/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Execute 1-Tap Emergency Bailout/i })).toBeInTheDocument()
  })

  it('TimeTravelScrubber renders interactive cycle timeline and deficit forecast', () => {
    render(
      <FinanceProvider>
        <TimeTravelScrubber />
      </FinanceProvider>
    )

    expect(screen.getByText(/30-Day Time-Travel Engine/i)).toBeInTheDocument()
    expect(screen.getByText(/Auto-Play Cycle/i)).toBeInTheDocument()
    expect(screen.getByText(/Zero-Cash Crash Date/i)).toBeInTheDocument()
  })

  it('KeyboardShortcutsModal renders accessible shortcut bindings', () => {
    const handleClose = vi.fn()

    render(
      <KeyboardShortcutsModal isOpen={true} onClose={handleClose} />
    )

    expect(screen.getByText(/Keyboard Navigation Shortcuts/i)).toBeInTheDocument()
    expect(screen.getByText(/Open Add Expense Modal/i)).toBeInTheDocument()
    expect(screen.getByText(/Alt \+ N/i)).toBeInTheDocument()
  })
})
