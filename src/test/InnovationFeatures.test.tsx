import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { FinanceProvider } from '../state/FinanceProvider'
import { ImpulseBusterModal } from '../components/innovation/ImpulseBusterModal'
import { SurvivalStreakBadge } from '../components/innovation/SurvivalStreakBadge'
import { MoneyVibeCardModal } from '../components/innovation/MoneyVibeCardModal'

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
})
