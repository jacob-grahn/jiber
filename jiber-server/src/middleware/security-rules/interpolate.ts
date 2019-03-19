import { get, trim } from 'lodash'

const interpolateGrabber = /\${(.+?)}/g

/**
 * Convert 'Hello ${name}' to 'Hello Bob'
 */
export const interpolate = (ctx: any, str: string): string => {
  return str.replace(interpolateGrabber, (match) => {
    const inner = match.substring(2, match.length - 1)
    const value = get(ctx, trim(inner))
    return String(value)
  })
}
