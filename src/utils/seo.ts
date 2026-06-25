import type { FieldHook } from 'payload'

export const populateSeoTitle: FieldHook = ({ value, data }) => {
  const fallback = data?.title || data?.loanTypeName || data?.accountTypeName || data?.name || data?.serviceName
  if (!value && fallback) {
    return fallback
  }
  return value
}

export const populateSeoDescription: FieldHook = ({ value, data }) => {
  // Try various description-like fields
  const fallback =
    data?.excerpt ||
    data?.shortDescription ||
    data?.description ||
    data?.introMessage ||
    data?.visionDescription ||
    data?.missionDescription
  if (!value && fallback) {
    // If it's a string, return it.
    if (typeof fallback === 'string') {
      return fallback
    }
  }
  return value
}
