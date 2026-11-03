import React from 'react'

/**
 * Groups related form fields under an icon + title + description header.
 */
export default function FormSection({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 shadow-lg shadow-black/20 transition-colors duration-300 hover:border-slate-700/80 md:p-6">
      <div className="mb-5 flex items-start gap-3">
        {Icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
            <Icon size={18} aria-hidden="true" />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-wide text-slate-100">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 text-xs text-slate-400">{description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {children}
      </div>
    </section>
  )
}
