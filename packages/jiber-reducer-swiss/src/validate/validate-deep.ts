import { get, forEach } from 'jiber-core'
import { validate, ValidateOptions } from './validate'
import { flatten } from './flatten'

export const validateDeep = (options: ValidateOptions): boolean => {
  if (typeof options.newValue === 'object') {
    const flat = flatten(options.newValue, `${options.path}.`)
    const badPaths: string[] = []
    forEach(flat, (subValue: string | number, subPath: string) => {
      if (!validate({
        ...options,
        path: subPath,
        newValue: subValue,
        oldValue: get(options.state, subPath)
      })) {
        badPaths.push(subPath)
      }
    })
    return badPaths.length === 0
  } else {
    return validate(options)
  }
}
