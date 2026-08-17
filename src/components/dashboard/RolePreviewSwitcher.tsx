import { useState } from 'react'
import { Role, roleLabels, roles } from '../../types/roles'
import { ShieldCheck, Eye, Sparkles, Check, ChevronDown } from 'lucide-react'

interface RolePreviewSwitcherProps {
  currentRole: Role
  effectiveRole: Role
  onSelectRole: (role: Role) => void
  onReset: () => void
}

export function RolePreviewSwitcher({
  currentRole,
  effectiveRole,
  onSelectRole,
  onReset,
}: RolePreviewSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isSimulating = currentRole !== effectiveRole

  return (
    <div className="relative mb-6 rounded-2xl border border-brand-500/20 bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 p-3.5 text-white shadow-lg backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-brand-50">
            {isSimulating ? <Eye size={18} className="text-amber-300" /> : <ShieldCheck size={18} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-100">
                {isSimulating ? 'Simulated Role View' : 'Active Church Role'}
              </span>
              {isSimulating && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-200">
                  <Sparkles size={10} /> Preview Mode
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-white">
              Viewing as <span className="text-amber-200">{roleLabels[effectiveRole]}</span>
              {isSimulating && <span className="text-xs font-normal text-brand-100"> (Real account: {roleLabels[currentRole]})</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick role selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20 active:scale-95"
            >
              <span>Switch Role Preview</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 top-full z-50 mt-2 w-64 max-w-[calc(100vw-2.5rem)] rounded-2xl border border-stone-200 bg-white p-2 shadow-2xl">
                  <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    Select Role Dashboard
                  </p>
                  <div className="max-h-72 space-y-1 overflow-y-auto">
                    {roles.map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          onSelectRole(r)
                          setIsOpen(false)
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                          effectiveRole === r
                            ? 'bg-brand-700 text-white'
                            : 'text-stone-800 hover:bg-brand-50 hover:text-brand-900'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              r === 'super_admin'
                                ? 'bg-red-400'
                                : r === 'pastor'
                                ? 'bg-purple-400'
                                : r === 'secretary'
                                ? 'bg-blue-400'
                                : r === 'choir_president'
                                ? 'bg-amber-400'
                                : 'bg-emerald-400'
                            }`}
                          />
                          {roleLabels[r]}
                        </span>
                        {effectiveRole === r && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {isSimulating && (
            <button
              onClick={onReset}
              className="rounded-xl bg-amber-400 px-3 py-1.5 text-xs font-bold text-stone-900 transition hover:bg-amber-300 active:scale-95"
            >
              Reset to My Role
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
