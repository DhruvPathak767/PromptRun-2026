import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { FinanceProvider } from '../state/FinanceProvider'
import { BalanceHero } from '../components/dashboard/BalanceHero'

// Mock Three.js FinanceScene to avoid WebGL canvas requirements in jsdom
vi.mock('../components/visualization/FinanceScene', () => ({
  default: () => <div data-testid="finance-scene-mock">Finance 3D WebGL Canvas</div>,
}))

describe('BalanceHero Component', () => {
  it('renders starting budget and liquid cash figures accurately', () => {
    render(
      <MemoryRouter>
        <FinanceProvider>
          <BalanceHero />
        </FinanceProvider>
      </MemoryRouter>
    )

    // Verify presence of core financial headings
    expect(screen.getByText(/Current Cash In Hand/i)).toBeInTheDocument()
    expect(screen.getByText(/Truly Safe to Spend/i)).toBeInTheDocument()
    expect(screen.getByText(/30-Day Budget Allocation/i)).toBeInTheDocument()

    // Verify Financial Health tag exists
    expect(screen.getByText(/Financial Health:/i)).toBeInTheDocument()
  })

  it('renders safe daily spending allowance and budget consumption', () => {
    render(
      <MemoryRouter>
        <FinanceProvider>
          <BalanceHero />
        </FinanceProvider>
      </MemoryRouter>
    )

    expect(screen.getByText(/Safe Daily Spending Allowance/i)).toBeInTheDocument()
    expect(screen.getByText(/Cycle Budget Consumption/i)).toBeInTheDocument()
  })
})
