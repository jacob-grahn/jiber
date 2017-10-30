import { paramMatch, runStr, funcRegex } from './run-str'

export const runFuncStr = (
  funcs: {[key: string]: Function},
  ctx: any,
  str: string = ''
): any => {
  const result = funcRegex.exec(str)
  if (!result || result.length < 2) return false

  const funcStr = result[1]
  const paramStr = result[2]
  const func = funcs[funcStr]
  if (!func) return false

  // the regex needs to run in a loop to find all of the params
  const paramGrabber = new RegExp(paramMatch, 'g')
  const params = []
  while (true) {
    const m = paramGrabber.exec(paramStr)
    if (!m) break
    params.push(m[1])
  }

  const ranParams = params.map(param => runStr(funcs, ctx, param))
  return func(...ranParams)
}
