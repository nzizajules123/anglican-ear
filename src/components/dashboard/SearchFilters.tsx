import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { FilterOptions } from '../../hooks/useAdvancedSearch'

interface SearchFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void
  showStatusFilter?: boolean
  showDateFilter?: boolean
  showCreatorFilter?: boolean
  statuses?: string[]
  creators?: { id: string; name: string }[]
}

export function SearchFilters({
  onFiltersChange,
  showStatusFilter = true,
  showDateFilter = true,
  showCreatorFilter = false,
  statuses = ['draft', 'published', 'archived'],
  creators = [],
}: SearchFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [status, setStatus] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical'>('newest')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [createdBy, setCreatedBy] = useState('')
  const [expanded, setExpanded] = useState(false)

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onFiltersChange({
      searchTerm: value,
      status: status || undefined,
      sortBy,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
      createdBy: createdBy || undefined,
    })
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    onFiltersChange({
      searchTerm: searchTerm || undefined,
      status: value || undefined,
      sortBy,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
      createdBy: createdBy || undefined,
    })
  }

  const handleSortChange = (value: 'newest' | 'oldest' | 'alphabetical') => {
    setSortBy(value)
    onFiltersChange({
      searchTerm: searchTerm || undefined,
      status: status || undefined,
      sortBy: value,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
      createdBy: createdBy || undefined,
    })
  }

  const handleDateFromChange = (value: string) => {
    setDateFrom(value)
    onFiltersChange({
      searchTerm: searchTerm || undefined,
      status: status || undefined,
      sortBy,
      dateFrom: value ? new Date(value) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
      createdBy: createdBy || undefined,
    })
  }

  const handleDateToChange = (value: string) => {
    setDateTo(value)
    onFiltersChange({
      searchTerm: searchTerm || undefined,
      status: status || undefined,
      sortBy,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: value ? new Date(value) : undefined,
      createdBy: createdBy || undefined,
    })
  }

  const handleCreatorChange = (value: string) => {
    setCreatedBy(value)
    onFiltersChange({
      searchTerm: searchTerm || undefined,
      status: status || undefined,
      sortBy,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
      createdBy: value || undefined,
    })
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Quick Filters */}
      <div className="grid gap-3 sm:grid-cols-3">
        {/* Sort */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-stone-700">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as any)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="alphabetical">A to Z</option>
          </select>
        </div>

        {/* Status Filter */}
        {showStatusFilter && (
          <div>
            <label className="mb-1 block text-xs font-semibold text-stone-700">Status</label>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Expand Advanced Filters Button */}
        {(showDateFilter || showCreatorFilter) && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex w-full items-center justify-between rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              More filters
              <ChevronDown size={16} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {expanded && (
        <div className="space-y-3 rounded-lg bg-stone-50 p-4">
          {showDateFilter && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-stone-700">From date</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => handleDateFromChange(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-stone-700">To date</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => handleDateToChange(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          )}

          {showCreatorFilter && creators.length > 0 && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-stone-700">Creator</label>
              <select
                value={createdBy}
                onChange={(e) => handleCreatorChange(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">All creators</option>
                {creators.map((creator) => (
                  <option key={creator.id} value={creator.id}>
                    {creator.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
