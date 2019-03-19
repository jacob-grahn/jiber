interface Comparisons {
  [key: string]: (a: any, b: any) => boolean
}

export const EQUAL = 'EQUAL'
export const NOT_EQUAL = 'NOT_EQUAL'
export const GREATER_THAN = 'GREATER_THAN'
export const LESS_THAN = 'LESS_THAN'
export const GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL'
export const LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL'

export const comparisons: Comparisons = {
  EQUAL: (a: any, b: any): boolean => a === b,
  NOT_EQUAL: (a: any, b: any): boolean => a !== b,
  GREATER_THAN: (a: number, b: number): boolean => a > b,
  LESS_THAN: (a: number, b: number): boolean => a < b,
  GREATER_THAN_OR_EQUAL: (a: number, b: number): boolean => a >= b,
  LESS_THAN_OR_EQUAL: (a: number, b: number): boolean => a <= b
}
