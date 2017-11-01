import { get } from 'jiber-core'
import { toZeroes } from './to-zeroes'

type Rule = {
  '.type'?: string,
  '.min'?: number,
  '.max'?: number,
  '.equal'?: string|number,
  '.notEqual'?: string|number,
  '.in'?: string[],
  '.notIn'?: string[],
  '.regex'?: string,
  '.validate'?: string
}

/**
 * Return the validation rules for a given path
 */
export const getRule = (rules: any, path: string): Rule => {
  const keys = toZeroes(path.split('.'))
  const rulePath = keys.join('.')
  const wildcardPath = [...keys.slice(0, keys.length - 1), '*'].join('.')
  const rule = get(rules, rulePath) || get(rules, wildcardPath)
  if (!rule) return {}

  let type: string|undefined = undefined
  if (rule['.type']) {
    type = rule['.type']
  } else if (Array.isArray(rule)) {
    type = 'array'
  } else if (Object.keys(rule).filter(k => k.charAt(0) !== '.').length > 0) {
    type = 'object'
  }

  return { ...rule, '.type': type }
}
