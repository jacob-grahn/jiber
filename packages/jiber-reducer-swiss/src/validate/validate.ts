import { getRule } from './get-rule'
import { ruleFuncs } from './rule-funcs'
import { runFuncStr } from './run-func-str'

export type ValidateOptions = {
  state: any,
  me: any,
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
  const ctx = {state: options.state, me: options.me, newValue: options.newValue}
  return (
    validateType(options.newValue, rule['.type']) &&
    runFuncStr(ruleFuncs, ctx, rule['.validate'])
  )
}
