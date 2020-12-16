import { get } from '../swiss/get'

const strRegex = new RegExp(`(^".*"$|^'.*'$)`)

export const getParamValue = (state: any, param: any) => {
  // ignore non-strings
  if (typeof param !== 'string') {
    return param
  }

  // treat a quoted string as a string
  if (strRegex.test(param)) {
    return param.substring(1, param.length - 1)
  }

  // treat a non-quoted string as a path
  let value: any = get(state, param)

  // get by reference
  if (value && value.$ref) {
    value = get(state, value.$ref)
  }

  return value
}
