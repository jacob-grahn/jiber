import { validate } from './validate'
import { flatten } from './flatten'
import { forEach } from '../utils/for-each'

export const validateDeep = (rules: any, path: string, value: any): boolean => {
  if (typeof value === 'object') {
    const flat = flatten(value, path)
    const badPaths: string[] = []
    forEach(flat, (subValue: string|number, subPath: string) => {
      if (!validate(rules, subPath, subValue))
        badPaths.push(subPath)
    })
    return badPaths.length === 0
  } else {
    return validate(rules, path, value)
  }
}
