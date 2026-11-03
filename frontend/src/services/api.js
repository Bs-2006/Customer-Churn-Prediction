import axios from 'axios'

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000'

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

/**
 * Translate axios errors into clear, user-friendly messages.
 */
function normalizeError(err) {
  if (err.response) {
    const detail = err.response.data?.detail
    let message
    if (typeof detail === 'string') {
      message = detail
    } else if (Array.isArray(detail)) {
      message = detail
        .map((d) => d?.msg || JSON.stringify(d))
        .join('; ')
    } else {
      message = `The server responded with an error (HTTP ${err.response.status}).`
    }
    const wrapped = new Error(message)
    wrapped.status = err.response.status
    return wrapped
  }

  if (err.request) {
    const wrapped = new Error(
      `Cannot reach the prediction API at ${API_BASE_URL}. Make sure the FastAPI backend is running (uvicorn main:app --reload).`
    )
    wrapped.code = 'NETWORK_ERROR'
    return wrapped
  }

  return err
}

/**
 * Normalize the backend response into a stable shape for the UI.
 * prediction: "CHURN" | "NOT CHURN", churn_probability: 0-1, risk_level: "LOW"|"MEDIUM"|"HIGH"
 * explanations: { increasing_churn_risk: [], reducing_churn_risk: [] }
 */
function normalizeResponse(data) {
  const rawPrediction = String(data?.prediction ?? '').trim().toUpperCase()
  const isChurn =
    rawPrediction === 'CHURN' ||
    rawPrediction === '1' ||
    rawPrediction === 'YES' ||
    rawPrediction === 'TRUE'

  let probability = Number(data?.churn_probability)
  if (!Number.isFinite(probability)) probability = 0
  // Accept both 0-1 and 0-100 formats from the API
  if (probability > 1 && probability <= 100) probability = probability / 100
  probability = Math.min(1, Math.max(0, probability))

  const explanations = data?.explanations

  return {
    prediction: isChurn ? 'CHURN' : 'NOT CHURN',
    churn_probability: probability,
    risk_level: String(data?.risk_level ?? '').trim().toUpperCase(),
    explanations:
      explanations && typeof explanations === 'object'
        ? {
            increasing_churn_risk: Array.isArray(
              explanations.increasing_churn_risk
            )
              ? explanations.increasing_churn_risk
              : [],
            reducing_churn_risk: Array.isArray(
              explanations.reducing_churn_risk
            )
              ? explanations.reducing_churn_risk
              : []
          }
        : null
  }
}

/**
 * POST customer features to /predict and return the normalized result.
 * @param {Object} payload - exactly the 25 model fields
 */
export async function predictChurn(payload) {
  try {
    const { data } = await client.post('/predict', payload)
    return normalizeResponse(data)
  } catch (err) {
    throw normalizeError(err)
  }
}
