import { get } from '../swiss/get'

const strRegex = new RegExp(`(^".*"$|^'.*'$)`)

export const getParamValue = (state: any, param: any) => {
  if (typeof param !== 'string') {
    return param
  }

  if (strRegex.test(param)) {
    return param.substring(1, param.length - 1)
  }

  return get(state, param)
}
