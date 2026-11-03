import React, { useState } from 'react'
import {
  FiUser,
  FiUsers,
  FiWifi,
  FiCloud,
  FiCreditCard,
  FiDollarSign,
  FiBarChart2,
  FiSend,
  FiRotateCcw,
  FiAlertCircle,
  FiAlertTriangle
} from 'react-icons/fi'
import FormSection from './FormSection.jsx'
import { validateCharges } from '../validation/chargesValidation.js'

const YES_NO = ['Yes', 'No']

export const DEFAULTS = {
  Gender: 'Male',
  Age: 45,
  Married: 'Yes',
  Dependents: 'Yes',
  'Tenure in Months': 24,
  Offer: 'No Offer',
  'Phone Service': 'Yes',
  'Multiple Lines': 'No',
  'Internet Service': 'Yes',
  'Internet Type': 'Fiber Optic',
  'Online Security': 'No',
  'Online Backup': 'Yes',
  'Device Protection Plan': 'No',
  'Premium Tech Support': 'No',
  'Streaming TV': 'Yes',
  'Streaming Movies': 'Yes',
  'Streaming Music': 'No',
  'Unlimited Data': 'Yes',
  Contract: 'Month-to-Month',
  'Paperless Billing': 'Yes',
  'Payment Method': 'Bank Withdrawal',
  'Monthly Charge': 94.35,
  'Total Charges': 2264.4,
  'Satisfaction Score': 3,
  CLTV: 5321
}

const SECTIONS = [
  {
    icon: FiUser,
    title: 'Personal Information',
    description: 'Demographics and household profile',
    fields: [
      { name: 'Gender', type: 'select', options: ['Male', 'Female'] },
      { name: 'Age', type: 'number', min: 18, max: 100, integer: true },
      { name: 'Married', type: 'select', options: YES_NO },
      { name: 'Dependents', type: 'select', options: YES_NO }
    ]
  },
  {
    icon: FiUsers,
    title: 'Tenure & Offer',
    description: 'Customer tenure and current offer',
    fields: [
      {
        name: 'Tenure in Months',
        type: 'number',
        min: 0,
        max: 120,
        integer: true
      },
      {
        name: 'Offer',
        type: 'select',
        options: ['No Offer', 'Offer A', 'Offer B', 'Offer C', 'Offer D', 'Offer E']
      }
    ]
  },
  {
    icon: FiWifi,
    title: 'Phone & Internet Services',
    description: 'Core connectivity services',
    fields: [
      { name: 'Phone Service', type: 'select', options: YES_NO },
      { name: 'Multiple Lines', type: 'select', options: YES_NO },
      { name: 'Internet Service', type: 'select', options: YES_NO },
      {
        name: 'Internet Type',
        type: 'select',
        options: ['DSL', 'Fiber Optic', 'Cable', 'No Internet']
      }
    ]
  },
  {
    icon: FiCloud,
    title: 'Online Services',
    description: 'Value-added add-ons and streaming',
    fields: [
      { name: 'Online Security', type: 'select', options: YES_NO },
      { name: 'Online Backup', type: 'select', options: YES_NO },
      { name: 'Device Protection Plan', type: 'select', options: YES_NO },
      { name: 'Premium Tech Support', type: 'select', options: YES_NO },
      { name: 'Streaming TV', type: 'select', options: YES_NO },
      { name: 'Streaming Movies', type: 'select', options: YES_NO },
      { name: 'Streaming Music', type: 'select', options: YES_NO },
      { name: 'Unlimited Data', type: 'select', options: YES_NO }
    ]
  },
  {
    icon: FiCreditCard,
    title: 'Contract & Billing',
    description: 'Commitment terms and billing preferences',
    fields: [
      {
        name: 'Contract',
        type: 'select',
        options: ['Month-to-Month', 'One Year', 'Two Year']
      },
      { name: 'Paperless Billing', type: 'select', options: YES_NO },
      {
        name: 'Payment Method',
        type: 'select',
        options: ['Bank Withdrawal', 'Credit Card', 'Mailed Check']
      }
    ]
  },
  {
    icon: FiDollarSign,
    title: 'Financial Information',
    description: 'Monthly and lifetime charges',
    fields: [
      { name: 'Monthly Charge', type: 'number', min: 0, step: 0.01 },
      { name: 'Total Charges', type: 'number', min: 0, step: 0.01 }
    ]
  },
  {
    icon: FiBarChart2,
    title: 'Customer Metrics',
    description: 'Satisfaction and lifetime value scores',
    fields: [
      {
        name: 'Satisfaction Score',
        type: 'number',
        min: 1,
        max: 5,
        integer: true
      },
      { name: 'CLTV', type: 'number', min: 0, integer: true }
    ]
  }
]

const ALL_FIELDS = SECTIONS.flatMap((s) => s.fields)
const NUMERIC_FIELDS = new Set(
  ALL_FIELDS.filter((f) => f.type === 'number').map((f) => f.name)
)

function validate(values) {
  const errors = {}

  for (const field of ALL_FIELDS) {
    const raw = values[field.name]

    if (raw === '' || raw === null || raw === undefined) {
      errors[field.name] = 'This field is required'
      continue
    }

    if (field.type !== 'number') continue

    const num = Number(raw)
    if (!Number.isFinite(num)) {
      errors[field.name] = 'Enter a valid number'
      continue
    }
    if (num < 0) {
      errors[field.name] = 'Cannot be negative'
      continue
    }
    if (field.min !== undefined && num < field.min) {
      errors[field.name] = `Must be at least ${field.min}`
      continue
    }
    if (field.max !== undefined && num > field.max) {
      errors[field.name] = `Must be ${field.max} or less`
      continue
    }
    if (field.integer && !Number.isInteger(num)) {
      errors[field.name] = 'Must be a whole number'
    }
  }

  return errors
}

/**
 * Build the exact 25-field payload expected by the trained model.
 */
export function buildPayload(values) {
  const payload = {}
  for (const key of Object.keys(DEFAULTS)) {
    payload[key] = NUMERIC_FIELDS.has(key) ? Number(values[key]) : values[key]
  }
  return payload
}

function Field({ field, value, error, onChange }) {
  const id = `field-${field.name.replace(/\s+/g, '-').toLowerCase()}`
  const invalid = Boolean(error)
  const baseCls =
    'w-full rounded-lg border bg-slate-800/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors duration-200'
  const stateCls = invalid
    ? 'border-red-500/70 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
    : 'border-slate-700 hover:border-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/25'

  return (
    <div data-invalid={invalid || undefined} className="min-w-0">
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium text-slate-400"
      >
        {field.name}
        <span className="ml-0.5 text-indigo-400" aria-hidden="true">
          *
        </span>
      </label>

      {field.type === 'select' ? (
        <select
          id={id}
          name={field.name}
          value={value}
          onChange={onChange}
          className={`${baseCls} ${stateCls} cursor-pointer`}
          aria-invalid={invalid}
        >
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type="number"
          name={field.name}
          value={value}
          onChange={onChange}
          min={field.min}
          max={field.max}
          step={field.step ?? (field.integer ? 1 : 'any')}
          placeholder={field.name}
          className={`${baseCls} ${stateCls}`}
          aria-invalid={invalid}
        />
      )}

      {invalid && (
        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-400">
          <FiAlertCircle className="shrink-0" size={12} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

export default function CustomerForm({ onSubmit, onReset, loading }) {
  const [form, setForm] = useState(() => ({ ...DEFAULTS }))
  const [errors, setErrors] = useState({})

  const chargesWarning = validateCharges({
    tenure: form['Tenure in Months'],
    monthlyCharge: form['Monthly Charge'],
    totalCharges: form['Total Charges']
  })

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate(form)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      requestAnimationFrame(() => {
        document
          .querySelector('[data-invalid="true"]')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
      return
    }

    onSubmit(buildPayload(form))
  }

  function handleReset() {
    setForm({ ...DEFAULTS })
    setErrors({})
    onReset?.()
    requestAnimationFrame(() => {
      document.getElementById('customer-form')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    })
  }

  return (
    <form
      id="customer-form"
      onSubmit={handleSubmit}
      noValidate
      className="animate-fade-in-up space-y-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-100">
            Customer Profile
          </h2>
          <p className="text-sm text-slate-400">
            Enter the 25 features the churn model expects.
          </p>
        </div>
        <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-400">
          {Object.keys(DEFAULTS).length} features
        </span>
      </div>

      {SECTIONS.map((section) => (
        <FormSection
          key={section.title}
          icon={section.icon}
          title={section.title}
          description={section.description}
        >
          {section.fields.map((field) => (
            <Field
              key={field.name}
              field={field}
              value={form[field.name]}
              error={errors[field.name]}
              onChange={handleChange}
            />
          ))}
        </FormSection>
      ))}

      {chargesWarning && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4"
        >
          <FiAlertTriangle
            size={18}
            className="mt-0.5 shrink-0 text-amber-400"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-amber-400">
              Data consistency warning
            </p>
            <p className="mt-1 break-words text-sm text-amber-300/90">
              {chargesWarning}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:flex-row">
        <button
          type="submit"
          disabled={loading}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-400 hover:to-cyan-400 hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Predicting…
            </>
          ) : (
            <>
              <FiSend size={16} aria-hidden="true" />
              Predict Churn
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-300 transition-colors duration-200 hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <FiRotateCcw size={16} aria-hidden="true" />
          Reset
        </button>
      </div>
    </form>
  )
}
