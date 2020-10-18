import { get } from '../swiss/get'
import { parseParamsStr } from './parse-params-str'

const strRegex = new RegExp(`(^".*"$|^'.*'$)`)

export const parseParams = (state: any, param: any, getValue: boolean = false) => {
  if (typeof param !== 'string') {
    return param
  }

  if (strRegex.test(param)) {
    return param.substring(1, param.length - 1)
  }

  const path: string = parseParamsStr(state, param)

  if (getValue) {
    return get(state, path)
  } else {
    return path
  }
}
