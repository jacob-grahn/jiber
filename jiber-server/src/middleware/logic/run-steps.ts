import { determineAudience } from './determine-audience'
import { funcs } from './funcs'
import { parseParams } from './parse-params'

export const runSteps = (reducer: any, state: any, steps: any[]) => {
  const actionsPerformed = []
  for (let i = 0; i < steps.length; i++) {
    const step: any[] = steps[i]
    const [func, ...params] = step
    const parsedParams = params.map(param => parseParams(state, param))
    const result = funcs[func](state, ...parsedParams)
    if (result === false) {
      break
    } else if (result === true) {
      continue
    } else if (result && result.addSteps) {
      if (result.addSteps.length > 0) {
        steps.splice(i + 1, 0, ...result.addSteps)
      }
    } else if (Array.isArray(result)) {
      result.forEach(action => {
        reducer(state, action)
        actionsPerformed.push(action)
      })
    } else if (result) {
      reducer(state, result)
      actionsPerformed.push(result)
    }
  }
  actionsPerformed.forEach(determineAudience)
  return actionsPerformed
}