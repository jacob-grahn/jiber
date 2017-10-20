import { get } from '../utils/get'
import { toZeroes } from './to-zeroes'

export const validate = (rules: any, path: string, value: any): boolean => {
  const type = getType(rules, path)
  if (type === 'any') return true
  if (type === 'array' && Array.isArray(value)) return true
  if (typeof value === type) return true
  return false
}

const getType = (rules: any, path: string): string => {
  const keys = toZeroes(path.split('.'))
  const rulePath = keys.join('.')
  const rule = get(rules, rulePath)
  if (!rule) return ''

  let type = 'any'
  if (rule['.type'])
    type = rule['.type']
  else if (Array.isArray(rule))
    type = 'array'
  else if (Object.keys(rule).filter(k => k.charAt(0) !== '.').length > 0)
    type = 'object'
  return type
}
