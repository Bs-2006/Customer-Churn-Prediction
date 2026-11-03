export const LOW_TOTAL_CHARGES_WARNING =
  "Total Charges appears unusually low for this customer's tenure and monthly charge. Please verify the entered values."

const LOW_CHARGES_RATIO = 0.5

/**
 * Realistic-data sanity check for the relationship between
 * Tenure in Months, Monthly Charge and Total Charges.
 *
 * expectedCharges = Tenure in Months × Monthly Charge
 * Warn when Total Charges is below 50% of expectedCharges.
 *
 * Deliberately lenient — discounts, offers and billing differences are
 * normal — and never blocking: it only returns a warning message or null.
 */
export function validateCharges({ tenure, monthlyCharge, totalCharges }) {
  const t = Number(tenure)
  const m = Number(monthlyCharge)
  const total = Number(totalCharges)

  if (!Number.isFinite(t) || !Number.isFinite(m) || !Number.isFinite(total)) {
    return null
  }

  if (t < 0 || m < 0 || total < 0) {
    return null
  }

  const expectedCharges = t * m

  if (expectedCharges <= 0) {
    return null
  }

  if (total < expectedCharges * LOW_CHARGES_RATIO) {
    return LOW_TOTAL_CHARGES_WARNING
  }

  return null
}
