import { runStr } from './run-str'

const interpolateGrabber = /\${(.+?)}/

/**
 * Convert 'Hello ${name}' to 'Hello Bob'
 */
export const runInterpolateStr = (
  funcs: {[key: string]: Function},
  ctx: any,
  str: string
): string => {
  return str.replace(interpolateGrabber, (match) => {
    const inner = match.substring(2, match.length - 1)
    const value = runStr(funcs, ctx, inner)
    return String(value)
  })
}
