import React, { useRef, useState } from 'react'
import {
  FiAlertCircle,
  FiBarChart2,
  FiCpu,
  FiLayers,
  FiX,
  FiZap
} from 'react-icons/fi'
import Header from './components/Header.jsx'
import CustomerForm from './components/CustomerForm.jsx'
import PredictionCard from './components/PredictionCard.jsx'
import { predictChurn } from './services/api.js'

const HERO_PILLS = [
  { icon: FiLayers, text: '25 Model Features' },
  { icon: FiCpu, text: 'Trained ML Model' },
  { icon: FiBarChart2, text: 'Risk Scoring' }
]

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-24 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-2 pt-12 text-center sm:px-6 lg:px-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300">
          <FiZap size={13} aria-hidden="true" />
          ML-Powered Retention
        </span>

        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl">
          Predict Customer Churn{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Before It Happens
          </span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
          Enter a customer&apos;s profile and our trained model returns a churn
          probability, a clear risk level, and the feature snapshot it scored —
          in real time.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {HERO_PILLS.map(({ icon: Icon, text }) => (
            <span
              key={text}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/70 px-3.5 py-2 text-xs font-medium text-slate-300"
            >
              <Icon size={14} className="text-indigo-400" aria-hidden="true" />
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function ResultSkeleton() {
  return (
    <div
      className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
      aria-hidden="true"
    >
      <div className="mb-5 h-5 w-40 rounded bg-slate-800" />
      <div className="mb-5 h-16 rounded-xl bg-slate-800/80" />
      <div className="flex items-center gap-5">
        <div className="h-44 w-44 rounded-full bg-slate-800" />
        <div className="flex-1 space-y-3">
          <div className="h-3 w-24 rounded bg-slate-800" />
          <div className="h-8 w-32 rounded bg-slate-800" />
          <div className="h-3 w-full rounded bg-slate-800" />
        </div>
      </div>
      <div className="mt-6 h-40 rounded-xl bg-slate-800/60" />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-400">
        <FiBarChart2 size={26} aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-200">
        No prediction yet
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
        Fill in the customer profile and press{' '}
        <strong className="text-slate-300">Predict Churn</strong> to see the
        model&apos;s verdict, probability and risk meter here.
      </p>
    </div>
  )
}

export default function App() {
  const [result, setResult] = useState(null)
  const [formSnapshot, setFormSnapshot] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const resultRef = useRef(null)

  async function handleSubmit(payload) {
    setLoading(true)
    setError(null)
    try {
      const prediction = await predictChurn(payload)
      setResult(prediction)
      setFormSnapshot(payload)
      requestAnimationFrame(() => {
        setTimeout(() => {
          resultRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }, 120)
      })
    } catch (err) {
      setResult(null)
      setFormSnapshot(null)
      setError(err?.message || 'Failed to get a prediction. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setResult(null)
    setFormSnapshot(null)
    setError(null)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <Hero />

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <div className="grid items-start gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7 xl:col-span-8">
              <CustomerForm
                onSubmit={handleSubmit}
                onReset={handleReset}
                loading={loading}
              />
            </div>

            <div
              ref={resultRef}
              className="space-y-4 lg:col-span-5 lg:sticky lg:top-20 xl:col-span-4"
            >
              {error && (
                <div
                  role="alert"
                  className="animate-fade-in-up flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-4"
                >
                  <FiAlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-red-400"
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-red-400">
                      Prediction failed
                    </p>
                    <p className="mt-1 break-words text-sm text-red-300/90">
                      {error}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    aria-label="Dismiss error"
                    className="shrink-0 rounded-md p-1 text-red-400/80 transition-colors hover:bg-red-500/15 hover:text-red-300"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              )}

              {loading ? (
                <ResultSkeleton />
              ) : result ? (
                <PredictionCard result={result} formData={formSnapshot} />
              ) : (
                !error && <EmptyState />
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center sm:flex-row sm:text-left sm:px-6 lg:px-8">
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-slate-400">ChurnPredict</span>{' '}
            · ML-powered customer retention insights
          </p>
          <p className="text-xs text-slate-500">
            Predictions served by your FastAPI backend
          </p>
        </div>
      </footer>
    </div>
  )
}
