import { set } from './set'
import { get } from './get'

export const runLogic = (state: any, steps: any[]) => {
  for (let i = 0; i < steps.length; i++) {
    const step: any[] = steps[i]
    const [func, ...params] = step
    const result = funcs[func](state, ...params)
    if (result === false) {
      break
    }
    if (Array.isArray(result)) {
      steps.splice(i, 0, ...result)
    }
  }
}

const funcs: any = {

  SET: (state: any, path: string, value: any) => {
    set(state, path, value)
  },

  ADD: (state: any, path: string, value: any) => {
    set(state, path, get(state, path) + value)
  },

  PUSH: (state: any, path: string, value: any) => {
    get(state, path, []).push(value)
  },

  POP: (state: any, path: string, destPath: string) => {
    const value = get(state, path).pop()
    set(state, destPath, value)
  },

  SPLICE: (state: any, path: string, start: number, count: number, destPath: string, ...items: any) => {
    const values = get(state, path, []).splice(start, count, ...items)
    set(state, destPath, values)
  },

  CHECK: (state: any, path: string, comparison: string, val2: any) => {
    const val1 = get(state, path)
    switch (comparison) {
      case '==':
        return val1 == val2
      case '>=':
        return val1 >= val2
      case '<=':
        return val1 <= val2
      case '~=':
        return new RegExp(val2).test(val1)
      case '!=':
        return val1 != val2
    }
  },

  IF: (state: any, path: string, comparison: string, value: any, trueSteps: any[] = [], falseSteps: any[] = []) => {
    const result = funcs.CHECK(state, path, comparison, value)
    return result ? trueSteps: falseSteps
  }
}