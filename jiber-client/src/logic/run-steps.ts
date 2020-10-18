import { funcs } from './funcs'
import { parseParams } from './parse-params'

export const runSteps = (state: any, steps: any[]) => {
  const actionsToPerform = []
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
        actionsToPerform.push(action)
      })
    } else if (result) {
      actionsToPerform.push(result)
    }
  }
  return actionsToPerform
}
