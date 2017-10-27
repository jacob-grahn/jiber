import { getRule } from './get-rule'
import { validateCmd } from './validate-cmd'

export type ValidateOptions = {
  state: any,
  newValue: any,
  oldValue: any,
  rules: any,
  path: string
}

const validateType = (value: any, type: string|undefined): boolean => {
  if (type === 'any') return true
  if (Array.isArray(value)) return type === 'array'
  if (typeof value === type) return true // tslint:disable-line
  return false
}

export const validate = (options: ValidateOptions): boolean => {
  const rule = getRule(options.rules, options.path)
  return (
    validateType(options.newValue, rule['.type']) &&
    validateCmd(options.newValue, rule['.validate'])
  )
}
