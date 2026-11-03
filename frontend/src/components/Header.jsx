import React from 'react'
import { FiActivity } from 'react-icons/fi'
import { API_BASE_URL } from '../services/api.js'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/25">
            <FiActivity className="text-white" size={20} aria-hidden="true" />
          </div>
          <div className="leading-tight">
            <p className="text-lg font-extrabold tracking-tight text-slate-100">
              Churn<span className="text-indigo-400">Predict</span>
            </p>
            <p className="hidden text-xs text-slate-400 sm:block">
              Customer Retention Intelligence
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3.5 py-1.5 text-xs text-slate-400 md:flex">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="font-medium text-slate-300">API</span>
          <code className="rounded bg-slate-800/80 px-1.5 py-0.5 font-mono text-[11px] text-slate-300">
            {API_BASE_URL.replace(/^https?:\/\//, '')}
          </code>
        </div>
      </div>
    </header>
  )
}
