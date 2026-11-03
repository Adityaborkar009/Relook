/** Preserve Google's explanation without echoing submitted secrets or photos. */
export function redactProviderMessage(message, sensitiveValues = []) {
  if (typeof message !== 'string' || !message.trim()) return undefined
  // Never truncate first: doing so could leave a partial credential visible.
  if (message.length > 16_384) return 'Google returned a long error message; details omitted.'
  let safe = message
  for (const value of sensitiveValues) {
    if (typeof value !== 'string' || !value) continue
    const representations = [value, encodeURIComponent(value), JSON.stringify(value).slice(1, -1)]
    for (const representation of representations) safe = safe.replaceAll(representation, '[redacted]')
  }
  safe = safe
    .replace(/(?:AIza[\w-]+|AQ\.[\w.-]+)/g, '[redacted key]')
    .replace(/https?:\/\/[^\s<>"']+/g, '[redacted URL]')
    .replace(/\bprojects\/[\w-]+/g, 'projects/[redacted]')
    .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '[redacted email]')
    .replace(/[A-Za-z0-9+/_=-]{80,}/g, '[redacted data]')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return safe.slice(0, 1200)
}
