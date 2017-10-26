import { paramMatch } from './run-str'
import { forEach } from '../utils/for-each'

const swaps = {
  eq: '===?',
  neq: '!==?',
  gt: '>',
  lt: '<',
  gte: '>=',
  lte: '<='
}

export const functionify = (str: string): string => {
  forEach(swaps, (sign, funcName) => {
    const regex = new RegExp(`^${paramMatch}${sign}${paramMatch}$`)
    const result = regex.exec(str)
    if (!result) return

    const param1 = result[1]
    const param2 = result[3]
    str = `${funcName}(${param1}, ${param2})`
  })
  return str
}
