import React, { useMemo } from 'react'
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts'

const RISK_STYLES = {
  LOW: { color: '#10b981', label: 'Low Risk' },
  MEDIUM: { color: '#f59e0b', label: 'Medium Risk' },
  HIGH: { color: '#ef4444', label: 'High Risk' }
}

function fallbackStyle(pct) {
  if (pct >= 70) return RISK_STYLES.HIGH
  if (pct >= 40) return RISK_STYLES.MEDIUM
  return RISK_STYLES.LOW
}

/**
 * Circular gauge (Recharts RadialBar) visualising churn probability.
 * Color is driven by the backend-provided risk level.
 */
export default function RiskMeter({ probability, riskLevel }) {
  const pct = useMemo(() => {
    const p = Number(probability)
    if (!Number.isFinite(p)) return 0
    return Math.min(100, Math.max(0, p * 100))
  }, [probability])

  const level = String(riskLevel || '').toUpperCase()
  const style = RISK_STYLES[level] ?? fallbackStyle(pct)
  const data = useMemo(
    () => [{ name: 'risk', value: pct, fill: style.color }],
    [pct, style.color]
  )

  return (
    <div
      className="relative h-44 w-44 shrink-0"
      role="img"
      aria-label={`Churn probability ${pct.toFixed(1)} percent, ${style.label}`}
    >
      <RadialBarChart
        width={176}
        height={176}
        data={data}
        innerRadius={62}
        outerRadius={86}
        barSize={14}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar
          dataKey="value"
          angleAxisId={0}
          cornerRadius={7}
          background={{ fill: '#1e293b' }}
          isAnimationActive
          animationDuration={700}
        />
      </RadialBarChart>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-[32px] font-extrabold tabular-nums leading-none"
          style={{ color: style.color }}
        >
          {pct.toFixed(1)}
          <span className="text-xl">%</span>
        </span>
        <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Churn Probability
        </span>
      </div>
    </div>
  )
}
