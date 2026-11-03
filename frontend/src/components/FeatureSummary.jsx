import React from 'react'
import { FiLayers } from 'react-icons/fi'

function formatValue(value) {
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return value.toLocaleString()
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }
  return String(value)
}

/**
 * Read-only grid summarising every feature that was sent to the model.
 */
export default function FeatureSummary({ data }) {
  if (!data) return null

  const entries = Object.entries(data)

  return (
    <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <FiLayers size={13} aria-hidden="true" />
          Customer Feature Summary
        </h4>
        <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[11px] font-medium text-slate-400">
          {entries.length} features
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
        {entries.map(([key, value]) => (
          <div key={key} className="min-w-0">
            <dt
              className="truncate text-[11px] text-slate-500"
              title={key}
            >
              {key}
            </dt>
            <dd
              className="truncate text-sm font-medium text-slate-200"
              title={String(value)}
            >
              {formatValue(value)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
