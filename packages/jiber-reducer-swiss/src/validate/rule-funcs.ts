export const ruleFuncs = {
  eq: (a: any, b: any): boolean => a === b,
  neq: (a: any, b: any): boolean => a !== b,
  gt: (a: number, b: number): boolean => a > b,
  lt: (a: number, b: number): boolean => a < b,
  gte: (a: number, b: number): boolean => a >= b,
  lte: (a: number, b: number): boolean => a <= b
}
