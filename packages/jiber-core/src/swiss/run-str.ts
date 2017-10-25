import { get } from '../utils/get'

const doubleStrRegex = /^".*"$/
const singleStrRegex = /^'.*'$/
const interpolateStrRegex = /^\`.*\`$/
const numberRegex = /^\d+$/
const boolRegex = /^true|false$/
const funcRegex = /^\s*(\w+)\s*\((.*)\)$/ // --need s flag ?
const pathRegex = /^[\w.]+$/
const paramGrabber =
  /\s*(true|false|".*"|'.*'|\`.*\`|\d+|\w+ ?(\(.*\))|[\w.]+)\s*,?\s*/
const interpolateGrabber = /\${(.+?)}/

export const runStr = (
  funcs: {[key: string]: Function},
  ctx: any,
  str: string
): any => {
  if (doubleStrRegex.test(str) || singleStrRegex.test(str))
    return str.substr(1, str.length - 2)

  if (interpolateStrRegex.test(str))
    return runInterpolateStr(funcs, ctx, str.substr(1, str.length - 2))

  if (boolRegex.test(str))
    return str === 'true'

  if (numberRegex.test(str))
    return Number(str)

  if (pathRegex.test(str))
    return get(ctx, str)

  if (funcRegex.test(str))
    return runFuncStr(funcs, ctx, str)
}

/**
 * Convert 'Hello ${name}' to 'Hello Bob'
**/
const runInterpolateStr = (
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

/**
 todo: do {
    m = re.exec(s);
    if (m) {
        console.log(m[1], m[2]);
    }
} while (m);
**/
const runFuncStr = (
  funcs: {[key: string]: Function},
  ctx: any,
  str: string
): any => {
  const result = funcRegex.exec(str)
  if (!result || result.length < 2)
    return false

  const funcStr = result[1]
  const paramStr = result[2]
  const func = funcs[funcStr]
  if (!func)
    return false

  const paramResults = paramGrabber.exec(paramStr)
  const params = paramResults ? paramResults.slice(1) : []
  console.log({
    str,
    funcStr,
    paramStr,
    paramResults,
    params
  })
  const ranParams = params.map(param => runStr(funcs, ctx, param))
  return func(...ranParams)
}
