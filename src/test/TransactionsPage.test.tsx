import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { FinanceProvider } from '../state/FinanceProvider'
import { TransactionsPage } from '../pages/TransactionsPage'

describe('TransactionsPage Component', () => {
  it('renders transaction ledger table and search filter', () => {
    render(
      <MemoryRouter>
        <FinanceProvider>
          <TransactionsPage />
        </FinanceProvider>
      </MemoryRouter>
    )

    expect(screen.getByPlaceholderText(/Search by description, merchant, or notes.../i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /New Transaction/i })).toBeInTheDocument()
  })

  it('filters transaction items when search query is entered', () => {
    render(
      <MemoryRouter>
        <FinanceProvider>
          <TransactionsPage />
        </FinanceProvider>
      </MemoryRouter>
    )

    const searchInput = screen.getByPlaceholderText(/Search by description, merchant, or notes.../i)
    fireEvent.change(searchInput, { target: { value: 'Spotify' } })

    // Seeded data contains "Spotify Student Premium"
    expect(screen.getByText(/Spotify Student Premium/i)).toBeInTheDocument()
  })

  it('opens add transaction modal when clicking "New Transaction"', () => {
    render(
      <MemoryRouter>
        <FinanceProvider>
          <TransactionsPage />
        </FinanceProvider>
      </MemoryRouter>
    )

    const addButton = screen.getByRole('button', { name: /New Transaction/i })
    fireEvent.click(addButton)

    expect(screen.getByText(/Record an immediate expense or income in your 30-day ledger/i)).toBeInTheDocument()
  })
})
