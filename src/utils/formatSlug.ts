import { FieldHook } from 'payload'

const format = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

const formatSlug =
  (fallback: string): FieldHook =>
  ({ value, data }) => {
    // If the fallback field (e.g. 'title') is being updated, always recalculate the slug from it
    if (data && typeof data[fallback] === 'string' && data[fallback].length > 0) {
      return format(data[fallback])
    }

    // Otherwise, if the slug field itself has a value (e.g. manual edit or existing record), format and use it
    if (typeof value === 'string' && value.length > 0) {
      return format(value)
    }

    return value
  }

export default formatSlug
