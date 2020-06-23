/**
 * coerse a value into an array
 */
export const toArray = (value: any): any[] => {
  if (Array.isArray(value)) return value
  if (value === undefined) return []
  return [value]
}
