import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../features/auth/AuthProvider'
import {
  subscribeToCollection,
  createRecord,
  removeRecord,
  ChurchRecord,
} from '../../../lib/church-data'
import { useExport } from '../../../hooks/useExport'
import {
  DollarSign,
  TrendingUp,
  Download,
  Plus,
  Trash2,
  CheckCircle,
  PieChart as PieIcon,
  ShieldCheck,
  CreditCard,
  Building2,
  HeartHandshake,
} from 'lucide-react'

export function FinanceDashboard() {
  const { profile } = useAuth()
  const [givingRecords, setGivingRecords] = useState<ChurchRecord[]>([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const { exportToCSV } = useExport()
  const [feedback, setFeedback] = useState<string | null>(null)

  // Quick donation entry form
  const [showAddForm, setShowAddForm] = useState(false)
  const [entryTitle, setEntryTitle] = useState('')
  const [entryAmount, setEntryAmount] = useState('')
  const [entryCategory, setEntryCategory] = useState('General Tithe')
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0])
  const [entryNotes, setEntryNotes] = useState('')

  useEffect(() => {
    return subscribeToCollection('giving', (items) => setGivingRecords(items))
  }, [])

  const handleAddGiving = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!entryTitle || !entryAmount) return
    try {
      await createRecord('giving', {
        title: entryTitle,
        amount: Number(entryAmount),
        category: entryCategory,
        date: entryDate,
        description: entryNotes,
        status: 'Verified',
      })
      setShowAddForm(false)
      setEntryTitle('')
      setEntryAmount('')
      setEntryNotes('')
      setFeedback('Financial record logged to parish stewardship ledger.')
      setTimeout(() => setFeedback(null), 3500)
    } catch {
      setFeedback('Failed to log giving entry.')
    }
  }

  const handleDeleteRecord = async (id: string) => {
    try {
      await removeRecord('giving', id)
      setFeedback('Giving entry removed.')
      setTimeout(() => setFeedback(null), 3000)
    } catch {
      setFeedback('Could not remove entry.')
    }
  }

  const handleExportFinance = () => {
    const data = givingRecords.map((r) => ({
      Title: r.title,
      Category: r.category || 'General',
      Amount: `$${(r.amount || 0).toLocaleString()}`,
      Date: r.date || 'N/A',
      Status: r.status || 'Verified',
      Notes: r.description || '',
    }))
    exportToCSV(data, 'anglican-parish-stewardship-ledger')
  }

  const totalGivingAmount = givingRecords.reduce((sum, r) => sum + (Number(r.amount) || 0), 0)

  const filteredRecords = givingRecords.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || (r.description || '').toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter ? r.category === categoryFilter : true
    return matchSearch && matchCat
  })

  return (
    <section className="space-y-8">
      {/* Banner */}
      <div className="rounded-3xl border border-brand-500/20 bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 p-6 text-white shadow-xl md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
                <DollarSign size={13} /> Parish Treasury & Stewardship
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-brand-100">
                Parish Finance Committee
              </span>
            </div>
            <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">
              Financial Stewardship & Treasury Ledger
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-brand-100">
              Welcome, <span className="font-semibold text-white">{profile?.displayName || 'Treasurer'}</span>. Managing tithes, Sunday collections, cathedral restoration funds, and diocesan mission contributions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-emerald-400 active:scale-95"
            >
              <Plus size={16} />
              + Log Giving Batch
            </button>
            <button
              onClick={handleExportFinance}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/20 active:scale-95"
            >
              <Download size={16} />
              Export Audit CSV
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-900 border border-emerald-200 shadow-sm animate-fade-in">
          <CheckCircle size={18} className="text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* New Giving Batch Form */}
      {showAddForm && (
        <form onSubmit={handleAddGiving} className="milk-card p-6 space-y-4 border-2 border-emerald-300">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-brand-900">Log New Giving Entry / Batch</h2>
            <span className="text-xs font-semibold text-stone-500">Recorded for audited parish ledger</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700">Description / Contributor *</label>
              <input
                required
                placeholder="e.g. Sunday Holy Eucharist Second Service Tithes"
                value={entryTitle}
                onChange={(e) => setEntryTitle(e.target.value)}
                className="field mt-1"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700">Amount ($) *</label>
              <input
                required
                type="number"
                step="0.01"
                min="1"
                placeholder="0.00"
                value={entryAmount}
                onChange={(e) => setEntryAmount(e.target.value)}
                className="field mt-1"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700">Fund Category</label>
              <select
                value={entryCategory}
                onChange={(e) => setEntryCategory(e.target.value)}
                className="field mt-1"
              >
                <option value="General Tithe">General Tithe</option>
                <option value="Sunday Offering">Sunday Offering</option>
                <option value="Building Fund">Cathedral Building Fund</option>
                <option value="Thanksgiving">Harvest Thanksgiving</option>
                <option value="Benevolence">Benevolence & Outreach</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700">Audit Reference / Notes</label>
            <input
              placeholder="e.g. Bank Deposit Ref #4819, Verified by Churchwarden"
              value={entryNotes}
              onChange={(e) => setEntryNotes(e.target.value)}
              className="field mt-1"
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="button-primary bg-emerald-700 hover:bg-emerald-800">
              Save to Ledger
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-xl bg-stone-200 px-4 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Stewardship Metrics */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="milk-card p-5">
          <p className="text-xs font-semibold text-stone-500">Total Recorded Giving</p>
          <p className="mt-1 font-serif text-3xl font-bold text-emerald-800">
            ${totalGivingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-[11px] text-emerald-700">All active fund streams</p>
        </div>
        <div className="milk-card p-5">
          <p className="text-xs font-semibold text-stone-500">General Tithes & Offerings</p>
          <p className="mt-1 font-serif text-3xl font-bold text-brand-900">$4,850.00</p>
          <p className="mt-1 text-[11px] text-brand-700">Parish operational funds</p>
        </div>
        <div className="milk-card p-5">
          <p className="text-xs font-semibold text-stone-500">Cathedral Building Fund</p>
          <p className="mt-1 font-serif text-3xl font-bold text-blue-700">$2,300.00</p>
          <p className="mt-1 text-[11px] text-blue-700">Pipe organ & facility repair</p>
        </div>
        <div className="milk-card p-5">
          <p className="text-xs font-semibold text-stone-500">Benevolence & Charity</p>
          <p className="mt-1 font-serif text-3xl font-bold text-purple-700">$1,200.00</p>
          <p className="mt-1 text-[11px] text-purple-700">Community support fund</p>
        </div>
      </div>

      {/* Financial Ledger Table */}
      <div className="milk-card p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-brand-900">Parish Stewardship Ledger</h2>
            <p className="mt-1 text-xs text-stone-600">All verified church transactions and contribution batches.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <input
              placeholder="Search ledger entries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="field w-48 text-xs py-1.5"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="field w-auto text-xs py-1.5"
            >
              <option value="">All Funds</option>
              <option value="General Tithe">General Tithe</option>
              <option value="Building Fund">Building Fund</option>
              <option value="Thanksgiving">Thanksgiving</option>
              <option value="Benevolence">Benevolence</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-stone-200">
          <table className="w-full text-left text-xs min-w-[500px]">
            <thead className="bg-stone-50 text-stone-700 font-bold">
              <tr>
                <th className="p-3">Batch / Description</th>
                <th className="p-3">Fund Category</th>
                <th className="p-3">Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Audit Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-stone-50/80 transition">
                  <td className="p-3">
                    <p className="font-bold text-stone-900">{r.title}</p>
                    {r.description && <p className="text-[11px] text-stone-500">{r.description}</p>}
                  </td>
                  <td className="p-3">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-semibold text-emerald-800 text-[11px]">
                      {r.category || 'General'}
                    </span>
                  </td>
                  <td className="p-3 text-stone-600">{r.date || 'Recent'}</td>
                  <td className="p-3 font-serif font-bold text-emerald-900 text-sm">
                    ${(r.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                      <ShieldCheck size={13} /> {r.status || 'Verified'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDeleteRecord(r.id)}
                      className="text-stone-400 hover:text-red-600"
                      title="Remove entry"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
