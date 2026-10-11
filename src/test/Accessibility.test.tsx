import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from '../components/common/Modal'
import { ConfirmDialog } from '../components/common/ConfirmDialog'

describe('Accessibility & Keyboard Navigation Audits', () => {
  it('Modal renders with proper ARIA attributes (role=dialog, aria-modal=true)', () => {
    const handleClose = vi.fn()

    render(
      <Modal isOpen={true} onClose={handleClose} title="Accessibility Test Modal">
        <div>Modal Content for Screen Readers</div>
      </Modal>
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title')
    expect(screen.getByText('Accessibility Test Modal')).toHaveAttribute('id', 'modal-title')
  })

  it('Modal closes gracefully when Escape key is pressed', () => {
    const handleClose = vi.fn()

    render(
      <Modal isOpen={true} onClose={handleClose} title="Escape Key Test">
        <div>Press escape to close</div>
      </Modal>
    )

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('ConfirmDialog provides accessible destructive action buttons', () => {
    const handleConfirm = vi.fn()
    const handleClose = vi.fn()

    render(
      <ConfirmDialog
        isOpen={true}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title="Delete Transaction"
        message="Are you sure you want to permanently delete this transaction?"
        confirmText="Yes, Delete"
        isDestructive={true}
      />
    )

    expect(screen.getByRole('button', { name: /Yes, Delete/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Yes, Delete/i }))
    expect(handleConfirm).toHaveBeenCalledTimes(1)
  })
})
