import React, { useState, useMemo } from 'react'
import {
  Receipt,
  Search,
  Plus,
  Trash2,
  Edit2,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'
import { useFinance } from '../state/useFinance'
import { formatRupees } from '../finance/financeEngine'
import {
  EXPENSE_CATEGORIES,
  type ExpenseCategory,
  type Transaction,
} from '../finance/financeTypes'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { Modal } from '../components/common/Modal'
import { TransactionFormModal } from '../components/finance/TransactionFormModal'

export const TransactionsPage: React.FC = () => {
  const { state, deleteTransaction, updateTransaction } = useFinance()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Edit form state
  const [editDesc, setEditDesc] = useState('')
  const [editAmount, setEditAmount] = useState('')
  const [editCategory, setEditCategory] = useState<ExpenseCategory>('Food & Dining')
  const [editDay, setEditDay] = useState(state.currentDay)

  const handleStartEdit = (tx: Transaction) => {
    setEditingTx(tx)
    setEditDesc(tx.description)
    setEditAmount(tx.amount.toString())
    setEditCategory(tx.category)
    setEditDay(tx.cycleDay)
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTx) return

    const parsedAmount = parseFloat(editAmount)
    if (!editDesc.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return

    updateTransaction({
      ...editingTx,
      description: editDesc.trim(),
      amount: parsedAmount,
      category: editCategory,
      cycleDay: editDay,
      date: `Day ${editDay} • Modified`,
    })

    setEditingTx(null)
  }

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return state.transactions.filter((tx) => {
      const matchesSearch =
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.note && tx.note.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory =
        selectedCategory === 'all' || tx.category === selectedCategory

      const matchesType = selectedType === 'all' || tx.type === selectedType

      return matchesSearch && matchesCategory && matchesType
    })
  }, [state.transactions, searchQuery, selectedCategory, selectedType])

  const totalSpentFiltered = filteredTransactions
    .filter((tx) => tx.type === 'expense' || tx.type === 'bill_payment')
    .reduce((sum, tx) => sum + tx.amount, 0)

  return (
    <div className="space-y-6">
      {/* Search, Filter, and Action Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#141822] border border-[#263045] shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A5ADBE] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by description, merchant, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] placeholder-[#6B778C] focus:outline-none focus:border-[#C8FF4D]"
          />
        </div>

        {/* Category & Type Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
          >
            <option value="all">All Categories</option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
          >
            <option value="all">All Types</option>
            <option value="expense">Expenses</option>
            <option value="income">Income</option>
            <option value="savings_transfer">Savings Transfers</option>
            <option value="bill_payment">Bill Payments</option>
          </select>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#C8FF4D] hover:bg-[#B5F530] text-[#0B0D12] transition-all shadow-md shadow-[#C8FF4D]/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Transaction</span>
          </button>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="flex items-center justify-between text-xs text-[#A5ADBE] px-1">
        <span>
          Showing <strong className="text-[#F5F7FA]">{filteredTransactions.length}</strong> of{' '}
          {state.transactions.length} entries
        </span>
        <span className="font-mono">
          Filtered Spend: <strong className="text-[#F5F7FA]">{formatRupees(totalSpentFiltered)}</strong>
        </span>
      </div>

      {/* Transactions Table / List */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#141822] border border-[#263045] shadow-xl overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#A5ADBE]">
            <Receipt className="w-8 h-8 text-[#6B778C] mx-auto mb-2" />
            No transactions match the selected filters.
          </div>
        ) : (
          <div className="divide-y divide-[#263045]/50">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-[#1B2130]/30 -mx-4 px-4 sm:-mx-6 sm:px-6 transition-colors group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      tx.type === 'income'
                        ? 'bg-[#C8FF4D]/20 text-[#C8FF4D]'
                        : tx.type === 'savings_transfer'
                        ? 'bg-[#63E5F4]/20 text-[#63E5F4]'
                        : 'bg-[#1C2433] text-[#A5ADBE]'
                    }`}
                  >
                    {tx.type === 'income' ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : tx.type === 'savings_transfer' ? (
                      <Sparkles className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-[#F5F7FA] truncate">
                        {tx.description}
                      </span>
                      {tx.isFixed && (
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-[#1C2433] text-[#A5ADBE] border border-[#263045]">
                          Fixed
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#A5ADBE] mt-0.5">
                      <span>{tx.date}</span>
                      <span>•</span>
                      <span>{tx.category}</span>
                      {tx.note && (
                        <>
                          <span>•</span>
                          <span className="truncate italic text-[#6B778C]">{tx.note}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span
                      className={`text-xs sm:text-sm font-bold font-mono block ${
                        tx.type === 'income'
                          ? 'text-[#C8FF4D]'
                          : tx.type === 'savings_transfer'
                          ? 'text-[#63E5F4]'
                          : 'text-[#F5F7FA]'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : tx.type === 'savings_transfer' ? '' : '−'}
                      {formatRupees(tx.amount)}
                    </span>
                    <span className="text-[10px] text-[#6B778C] capitalize">
                      {tx.type.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleStartEdit(tx)}
                      className="p-1.5 rounded-lg text-[#A5ADBE] hover:text-[#F5F7FA] hover:bg-[#1C2433] transition-colors"
                      title="Edit transaction"
                      aria-label={`Edit ${tx.description}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(tx.id)}
                      className="p-1.5 rounded-lg text-[#A5ADBE] hover:text-[#FF5C5C] hover:bg-[#FF5C5C]/10 transition-colors"
                      title="Delete transaction"
                      aria-label={`Delete ${tx.description}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Transaction Modal */}
      <TransactionFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteTransaction(deleteTargetId)
            setDeleteTargetId(null)
          }
        }}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? All balances and budget pace will be recalculated."
        confirmText="Delete"
        isDestructive={true}
      />

      {/* Edit Modal */}
      <Modal
        isOpen={editingTx !== null}
        onClose={() => setEditingTx(null)}
        title="Edit Transaction"
        description="Update transaction details and recalculate 30-day budget."
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#A5ADBE] mb-1">Description</label>
            <input
              type="text"
              required
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#A5ADBE] mb-1">Amount (₹)</label>
              <input
                type="number"
                required
                min="1"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A5ADBE] mb-1">Cycle Day</label>
              <input
                type="number"
                min="1"
                max="30"
                value={editDay}
                onChange={(e) => setEditDay(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A5ADBE] mb-1">Category</label>
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value as ExpenseCategory)}
              className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#263045]">
            <button
              type="button"
              onClick={() => setEditingTx(null)}
              className="px-4 py-2 text-xs font-medium text-[#A5ADBE] bg-[#1B2130] rounded-xl hover:bg-[#263045]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-[#C8FF4D] text-[#0B0D12] rounded-xl hover:bg-[#B5F530]"
            >
              Update Transaction
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
