import { get } from '../utils/get'
import { functionify } from './functionify'
import { runInterpolateStr } from './run-interpolate-str'
import { runFuncStr } from './run-func-str'

export const paramMatch =
'\\s*(\\w+ ?(\\(.*\\))|true|false|".*"|\'.*\'|\\`.*\\`|\\d+|[\\w.]+)\\s*,?\\s*'
const doubleStrRegex = /^".*"$/
const singleStrRegex = /^'.*'$/
const interpolateStrRegex = /^\`.*\`$/
const numberRegex = /^\d+$/
const boolRegex = /^true|false$/
export const funcRegex = /^\s*(\w+)\s*\((.*)\)$/
const pathRegex = /^[\w.]+$/

export const runStr = (
  funcs: {[key: string]: Function},
  ctx: any,
  str: string
): any => {
  str = functionify(str)

  if (doubleStrRegex.test(str) || singleStrRegex.test(str)) {
    return str.substr(1, str.length - 2)
  }

  if (interpolateStrRegex.test(str)) {
    return runInterpolateStr(funcs, ctx, str.substr(1, str.length - 2))
  }

  if (boolRegex.test(str)) {
    return str === 'true'
  }

  if (numberRegex.test(str)) {
    return Number(str)
  }

  if (pathRegex.test(str)) {
    return get(ctx, str)
  }

  if (funcRegex.test(str)) {
    return runFuncStr(funcs, ctx, str)
  }
}
