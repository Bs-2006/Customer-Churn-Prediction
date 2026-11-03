import React from 'react'
import {
  FiActivity,
  FiAlertTriangle,
  FiShield,
  FiTrendingUp
} from 'react-icons/fi'
import RiskMeter from './RiskMeter.jsx'
import FeatureSummary from './FeatureSummary.jsx'
import FeatureExplanation from './FeatureExplanation.jsx'

const RISK_STYLES = {
  LOW: {
    badge: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
    text: 'text-emerald-400',
    message:
      'Low churn risk — this customer is likely to stay. Keep delivering great service.'
  },
  MEDIUM: {
    badge: 'border-amber-500/50 bg-amber-500/10 text-amber-400',
    text: 'text-amber-400',
    message:
      'Moderate churn risk — consider a proactive retention offer or loyalty perk.'
  },
  HIGH: {
    badge: 'border-red-500/50 bg-red-500/10 text-red-400',
    text: 'text-red-400',
    message:
      'High churn risk — immediate retention action is strongly recommended.'
  }
}

const FALLBACK_STYLE = {
  badge: 'border-slate-600 bg-slate-800 text-slate-300',
  text: 'text-slate-300',
  message: 'Review the customer profile and risk indicators below.'
}

/**
 * Displays the API prediction result: verdict, probability, risk level,
 * visual risk meter and the submitted feature summary.
 */
export default function PredictionCard({ result, formData }) {
  if (!result) return null

  const {
    prediction,
    churn_probability,
    risk_level,
    explanations
  } = result
  const level = String(risk_level || '').toUpperCase()
  const isChurn = prediction === 'CHURN'
  const style = RISK_STYLES[level] ?? FALLBACK_STYLE
  const badgeLabel = RISK_STYLES[level] ? `${level} RISK` : 'RISK'

  return (
    <div
      className="animate-fade-in-up overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 shadow-2xl shadow-black/40"
      role="region"
      aria-label="Prediction result"
    >
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/80 px-5 py-4">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-200">
          <FiActivity size={16} className="text-indigo-400" aria-hidden="true" />
          Prediction Result
        </h2>
        <span
          className={`rounded-full border px-3 py-1 text-[11px] font-bold tracking-wider ${style.badge}`}
        >
          {badgeLabel}
        </span>
      </div>

      <div className="p-5">
        <div
          className={`mb-5 flex items-start gap-3 rounded-xl border px-4 py-3.5 ${
            isChurn
              ? 'border-red-500/30 bg-red-500/10'
              : 'border-emerald-500/30 bg-emerald-500/10'
          }`}
        >
          {isChurn ? (
            <FiAlertTriangle
              size={20}
              className="mt-0.5 shrink-0 text-red-400"
              aria-hidden="true"
            />
          ) : (
            <FiShield
              size={20}
              className="mt-0.5 shrink-0 text-emerald-400"
              aria-hidden="true"
            />
          )}
          <div className="min-w-0">
            <p
              className={`text-base font-bold ${
                isChurn ? 'text-red-400' : 'text-emerald-400'
              }`}
            >
              {isChurn ? 'Likely to Churn' : 'Likely to Retain'}
            </p>
            <p className="text-sm text-slate-300">
              Model verdict: <strong className="text-slate-100">{prediction}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          <RiskMeter probability={churn_probability} riskLevel={risk_level} />

          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Churn Probability
            </p>
            <p className={`mt-1 text-3xl font-extrabold tabular-nums ${style.text}`}>
              {(churn_probability * 100).toFixed(1)}%
            </p>
            <p className="mt-1 text-xs text-slate-500">
              raw score {churn_probability.toFixed(4)}
            </p>

            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-400 sm:justify-start">
              <FiTrendingUp size={15} aria-hidden="true" />
              <span>{style.message}</span>
            </div>
          </div>
        </div>

        <FeatureExplanation explanations={explanations} />

        {formData && <FeatureSummary data={formData} />}
      </div>
    </div>
  )
}
