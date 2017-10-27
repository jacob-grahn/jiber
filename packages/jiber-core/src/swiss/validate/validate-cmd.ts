import { runFuncStr } from './run-func-str'
import { ruleFuncs } from './rule-funcs'

export const validateCmd = (newValue: any, str: string|undefined): boolean => {
  if (!str) return true

  const ctx = {
    room,
    me,
    newValue
  }
  return runFuncStr(ruleFuncs, ctx, str)
}
