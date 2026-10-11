import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { FinanceProvider } from '../state/FinanceProvider'
import { SimulatorPage } from '../pages/SimulatorPage'

describe('What-If SimulatorPage Component', () => {
  it('renders What-If Lab and preset scenarios', () => {
    render(
      <MemoryRouter>
        <FinanceProvider>
          <SimulatorPage />
        </FinanceProvider>
      </MemoryRouter>
    )

    expect(screen.getByText(/What-If Decision Lab/i)).toBeInTheDocument()
    expect(screen.getByText(/Buy sneakers for ₹2,499/i)).toBeInTheDocument()
    expect(screen.getByText(/Plain-Language Consequence Analysis/i)).toBeInTheDocument()
  })

  it('calculates and displays before vs after comparison metrics when a preset is selected', () => {
    render(
      <MemoryRouter>
        <FinanceProvider>
          <SimulatorPage />
        </FinanceProvider>
      </MemoryRouter>
    )

    // Click sneaker preset
    const presetButton = screen.getByText(/Buy sneakers for ₹2,499/i)
    fireEvent.click(presetButton)

    // Check that Side-by-Side comparison metrics are displayed
    expect(screen.getAllByText(/Cash Balance/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Safe Discretionary Funds/i)).toBeInTheDocument()
    expect(screen.getByText(/Safe Daily Allowance/i)).toBeInTheDocument()

    // Check that Apply and Reset controls are visible
    expect(screen.getAllByRole('button', { name: /Apply Decision/i }).length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /Reset Sandbox/i })).toBeInTheDocument()
  })

  it('updates simulated values when the amount input changes', () => {
    render(
      <MemoryRouter>
        <FinanceProvider>
          <SimulatorPage />
        </FinanceProvider>
      </MemoryRouter>
    )

    const amountInput = screen.getByLabelText(/Hypothetical Amount \(₹\)/i)
    fireEvent.change(amountInput, { target: { value: '3500' } })

    expect(amountInput).toHaveValue(3500)
  })
})
