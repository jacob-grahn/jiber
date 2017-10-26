import { getRule } from './get-rule'

/* const rules = {
  books: [{
    title: {
      '.type': 'string',
      '.min': 0,
      '.max': 50,
      '.equal': 'room.nextTitle',
      '.notEqual': 'room.lastTitle',
      '.in': ['one', 'two'],
      '.notIn': ['three', 'four'],
      '.regex': '^bloop',
      ".if": "gte(me.rank, 5)"
    }
  }]
} */

export const validateType = (value: any, type: string|undefined): boolean => {
  if (type === 'any') return true
  if (Array.isArray(value)) return type === 'array'
  if (typeof value === type) return true // tslint:disable-line
  return false
}

export const validate = (rules: any, path: string, value: any): boolean => {
  const rule = getRule(rules, path)
  return validateType(value, rule['.type'])
}

/* export const validateCustom = (value: any, custom: string[]): boolean => {
  return !!value && !!custom
} */
