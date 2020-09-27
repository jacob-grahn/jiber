import { get } from './get'
import { parseParams } from './parse-params'

export const runLogic = (reducer:any, state: any, steps: any[]) => {
  const actionsPerformed = []
  for (let i = 0; i < steps.length; i++) {
    const step: any[] = steps[i]
    const [func, ...params] = step
    const parsedParams = parseParams(params)
    const result = funcs[func](state, ...params)
    if (result === false) {
      break
    }
    else if (result && result.addSteps) {
      steps.splice(i, 0, ...result.addSteps)
    }
    else if (Array.isArray(result)) {
      result.forEach(action => {
        reducer(state, action)
        actionsPerformed.push(action)
      })
    }
    else if (result) {
      reducer(state, result)
      actionsPerformed.push(result)
    }
  }
  return actionsPerformed
}

const funcs: any = {

  SET: (_state: any, path: string, value: any) => {
    return {type: 'SET', path, value}
  },

  ADD: (state: any, path: string, value: any) => {
    const newValue = get(state, path) + value
    return {type: 'SET', path, value: newValue}
  },

  PUSH: (_state: any, path: string, value: any) => {
    return {type: 'PUSH', path, value}
  },

  POP: (state: any, path: string, destPath: string) => {
    const arr: any[] = get(state, path)
    if (Array.isArray(arr) && arr.length > 0) {
      return [
        {type: 'POP', path},
        {type: 'SET', path: destPath, value: arr[-1]}
      ]
    }
  },

  SPLICE: (state: any, path: string, start: number, count: number, destPath: string, ...items: any) => {
    const arr: any[] = get(state, path)
    if (Array.isArray(arr) && arr.length > 0) {
      return [
        {type: 'SPLICE', path, start, count, items},
        {type: 'SET', path: destPath, value: arr.slice(start, start + count)}
      ]
    }
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
    return {addSteps: result ? trueSteps: falseSteps}
  }
}