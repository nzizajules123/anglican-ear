import { useState } from 'react'
import { Check, Trash2, Archive, Send, AlertCircle, X } from 'lucide-react'
import { useBulkActions } from '../../hooks/useBulkActions'

interface BulkActionsToolbarProps {
  collectionName: string
  selectedIds: string[]
  onComplete?: () => void
  onClear: () => void
  allowedActions?: ('publish' | 'draft' | 'archive' | 'delete')[]
}

export function BulkActionsToolbar({
  collectionName,
  selectedIds,
  onComplete,
  onClear,
  allowedActions = ['publish', 'draft', 'archive', 'delete'],
}: BulkActionsToolbarProps) {
  const [confirmAction, setConfirmAction] = useState<string | null>(null)
  const { updateStatus, deleteItems, loading, result } = useBulkActions(collectionName)

  if (selectedIds.length === 0) {
    return null
  }

  const handlePublish = async () => {
    await updateStatus(selectedIds, 'published')
    setConfirmAction(null)
    setTimeout(() => {
      onClear()
      onComplete?.()
    }, 1000)
  }

  const handleDraft = async () => {
    await updateStatus(selectedIds, 'draft')
    setConfirmAction(null)
    setTimeout(() => {
      onClear()
      onComplete?.()
    }, 1000)
  }

  const handleArchive = async () => {
    await updateStatus(selectedIds, 'archived')
    setConfirmAction(null)
    setTimeout(() => {
      onClear()
      onComplete?.()
    }, 1000)
  }

  const handleDelete = async () => {
    await deleteItems(selectedIds)
    setConfirmAction(null)
    setTimeout(() => {
      onClear()
      onComplete?.()
    }, 1000)
  }

  return (
    <div className="mb-6 rounded-lg bg-brand-50 p-4">
      {/* Status Message */}
      {result && (
        <div
          className={`mb-4 rounded-lg p-3 text-sm ${
            result.failed === 0
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {result.failed === 0 ? (
              <Check size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>
              {result.success} succeeded
              {result.failed > 0 && `, ${result.failed} failed`}
            </span>
          </div>
          {result.errors.length > 0 && (
            <ul className="mt-2 space-y-1 text-xs">
              {result.errors.map((error, i) => (
                <li key={i}>• {error}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-brand-900">
          {selectedIds.length} selected
        </span>

        {allowedActions.includes('publish') && (
          <button
            onClick={() => setConfirmAction('publish')}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            <Check size={16} />
            Publish
          </button>
        )}

        {allowedActions.includes('draft') && (
          <button
            onClick={() => setConfirmAction('draft')}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg bg-yellow-600 px-3 py-2 text-sm font-medium text-white hover:bg-yellow-700 disabled:opacity-50"
          >
            <Send size={16} />
            Save as Draft
          </button>
        )}

        {allowedActions.includes('archive') && (
          <button
            onClick={() => setConfirmAction('archive')}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Archive size={16} />
            Archive
          </button>
        )}

        {allowedActions.includes('delete') && (
          <button
            onClick={() => setConfirmAction('delete')}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            <Trash2 size={16} />
            Delete
          </button>
        )}

        <button
          onClick={() => {
            onClear()
            setConfirmAction(null)
          }}
          disabled={loading}
          className="ml-auto flex items-center gap-1.5 rounded-lg bg-stone-300 px-3 py-2 text-sm font-medium text-stone-900 hover:bg-stone-400 disabled:opacity-50"
        >
          <X size={16} />
          Clear
        </button>
      </div>

      {/* Confirmation Dialog */}
      {confirmAction && (
        <div className="mt-4 rounded-lg bg-white p-4">
          <p className="font-medium text-stone-900">
            Are you sure? This will {confirmAction} {selectedIds.length} item(s).
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={
                confirmAction === 'publish'
                  ? handlePublish
                  : confirmAction === 'draft'
                    ? handleDraft
                    : confirmAction === 'archive'
                      ? handleArchive
                      : handleDelete
              }
              disabled={loading}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm'}
            </button>
            <button
              onClick={() => setConfirmAction(null)}
              disabled={loading}
              className="rounded-lg bg-stone-200 px-4 py-2 text-sm font-medium text-stone-900 hover:bg-stone-300 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
