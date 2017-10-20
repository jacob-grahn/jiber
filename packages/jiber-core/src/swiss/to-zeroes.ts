/**
 * Convert numbers in a path to 0
 * Example: assets.55.name becomes assets.0.name
 */
export const toZeroes = (arr: string[]): string[] => {
  return arr.map(key => /^[0-9].*$/.test(key) ? '0' : key)
}
