// Sanitize player name: strip HTML tags, collapse whitespace, limit length
export function sanitizeName(raw) {
  return raw
    .replace(/<[^>]*>/g, '')          // strip HTML
    .replace(/[<>"'`]/g, '')          // strip remaining dangerous chars
    .replace(/\s+/g, ' ')            // collapse whitespace
    .trim()
    .slice(0, 20)
}

// Validate score: must be a non-negative integer within the possible range
export function isValidScore(score, maxCards = 120) {
  return Number.isInteger(score) && score >= 0 && score <= maxCards
}

// Validate mode
const VALID_MODES = ['normal', 'yamete']
export function isValidMode(mode) {
  return VALID_MODES.includes(mode)
}

// Simple client-side rate limit: returns true if the action is allowed.
// Stores the last action timestamp in localStorage.
const RATE_LIMITS = {}
export function checkRateLimit(key, minIntervalMs = 10000) {
  const now = Date.now()
  const last = RATE_LIMITS[key] ?? 0
  if (now - last < minIntervalMs) return false
  RATE_LIMITS[key] = now
  return true
}
