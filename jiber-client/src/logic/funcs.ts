import { get } from '../swiss/get'
import { getParamValue } from './get-param-value'

export const funcs: any = {

  SET: (state: any, path: string, value: any) => {
    return { type: 'SET', path, value: getParamValue(state, value) }
  },

  ADD: (state: any, path: string, value: any) => {
    return { type: 'ADD', path, value: getParamValue(state, value) }
  },

  PUSH: (state: any, path: string, value: any) => {
    return { type: 'PUSH', path, value: getParamValue(state, value) }
  },

  POP: (state: any, path: string, destPath: string) => {
    const arr: any[] = get(state, path)
    if (Array.isArray(arr) && arr.length > 0) {
      return { type: 'POP', path, destPath }
    }
  },

  SPLICE: (state: any, path: string, start: number, count: number, destPath: string, ...items: any) => {
    const arr: any[] = get(state, path)
    if (Array.isArray(arr) && arr.length > 0) {
      return { type: 'SPLICE', path, start, count, items, destPath }
    }
  },

  CHECK: (state: any, path1: string, comparison: string, path2: any) => {
    const val1: any = getParamValue(state, path1)
    const val2: any = getParamValue(state, path2)
    switch (comparison) {
      case '==':
        return val1 === val2
      case '>':
        return (val1 || 0) > (val2 || 0)
      case '<':
        return (val1 || 0) < (val2 || 0)
      case '>=':
        return (val1 || 0) >= (val2 || 0)
      case '<=':
        return (val1 || 0) <= (val2 || 0)
      case '~=':
        return new RegExp(val2).test(val1)
      case '!=':
        return val1 !== val2
      case '?':
        return (val1 !== null && val1 !== undefined) === val2
    }
  },

  IF: (state: any, path: string, comparison: string, value: any, trueSteps: any[] = [], falseSteps: any[] = []) => {
    const result = funcs.CHECK(state, path, comparison, value)
    return { addSteps: result ? trueSteps : falseSteps }
  },

  SHUFFLE: (state: any, path: string) => {
    const array = [...get(state, path)]
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
    return { type: 'SET', path, value: array }
  }
}
