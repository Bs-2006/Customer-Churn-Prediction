import React from 'react'
import { FiHelpCircle } from 'react-icons/fi'

function formatValue(value) {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return value.toLocaleString()
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }
  return String(value)
}

function formatContribution(contribution) {
  const n = Number(contribution)
  if (!Number.isFinite(n)) return ''
  const abs = Math.abs(n).toFixed(2)
  return n > 0 ? `+${abs}` : `−${abs}`
}

function explanationText(contribution, isStrongest) {
  const n = Number(contribution)
  const direction = n > 0 ? 'higher' : 'lower'
  if (isStrongest) {
    return `Strong contributor to ${direction} predicted churn risk.`
  }
  return n > 0
    ? 'Increases predicted churn risk.'
    : 'Reduces predicted churn risk.'
}

function FactorList({ items, direction }) {
  const isIncreasing = direction === 'increasing'
  const dotClass = isIncreasing ? 'bg-red-500' : 'bg-emerald-500'
  const label = isIncreasing
    ? 'Factors increasing churn risk'
    : 'Factors reducing churn risk'
  const headingClass = isIncreasing ? 'text-red-400' : 'text-emerald-400'
  const emoji = isIncreasing ? '🔴' : '🟢'

  if (!items?.length) {
    return (
      <div className="min-w-0 flex-1">
        <h4
          className={`mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${headingClass}`}
        >
          <span aria-hidden="true">{emoji}</span>
          {label}
        </h4>
        <p className="text-xs text-slate-500">None for this prediction.</p>
      </div>
    )
  }

  return (
    <div className="min-w-0 flex-1">
      <h4
        className={`mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${headingClass}`}
      >
        <span aria-hidden="true">{emoji}</span>
        {label}
      </h4>
      <ul className="space-y-2">
        {items.map((item, index) => {
          const contribution = Number(item.contribution)
          const isStrongest = index === 0 && Math.abs(contribution) > 0

          return (
            <li
              key={`${direction}-${item.feature}`}
              className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="min-w-0 truncate text-sm font-semibold text-slate-200">
                  {item.feature}:{' '}
                  <span className="font-medium text-slate-300">
                    {formatValue(item.value)}
                  </span>
                </span>
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[11px] font-bold tabular-nums ${
                    isIncreasing
                      ? 'bg-red-500/15 text-red-400'
                      : 'bg-emerald-500/15 text-emerald-400'
                  }`}
                  title="Model contribution (coefficient × scaled value)"
                >
                  {formatContribution(item.contribution)}
                </span>
              </div>
              <div className="mt-1 flex items-start gap-1.5">
                <span
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`}
                  aria-hidden="true"
                />
                <p className="text-xs leading-relaxed text-slate-400">
                  {explanationText(contribution, isStrongest)}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/**
 * "Why This Prediction?" — top model contributions from the backend.
 * Values come from Logistic Regression coefficients × transformed inputs;
 * they are not hard-coded rules.
 */
export default function FeatureExplanation({ explanations }) {
  if (!explanations) return null

  const increasing = explanations.increasing_churn_risk || []
  const reducing = explanations.reducing_churn_risk || []

  if (!increasing.length && !reducing.length) return null

  return (
    <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <FiHelpCircle size={13} aria-hidden="true" />
          Why This Prediction?
        </h4>
        <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[11px] font-medium text-slate-400">
          model factors
        </span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
        <FactorList items={increasing} direction="increasing" />
        <FactorList items={reducing} direction="reducing" />
      </div>

      <p className="mt-3 border-t border-slate-800 pt-2.5 text-[11px] leading-relaxed text-slate-500">
        Based on this trained Logistic Regression model&apos;s coefficients for
        the current customer profile — factors that increase or reduce
        <em className="not-italic text-slate-400"> predicted</em> churn risk for
        this input. Not a statement of causation.
      </p>
    </div>
  )
}
