import { funcs } from './funcs'
import { parseParams } from './parse-params'
import { swiss } from '../swiss'
import { determineAudience } from './determine-audience'

export const runSteps = (state: any, action: any) => {

  const logic: any = state._logic
  const type: string = action.type
  const steps: any[] = logic[type] || []
  const performedActions: any[] = []

  for (let i = 0; i < steps.length; i++) {
    const step: any[] = steps[i]
    const [funcName, ...params] = step

    // The RUN command is a special case, it needs to be able to pull steps from the logic object
    if (funcName === 'RUN') {
      const targetFuncName = params[0]
      const targetSteps = logic[targetFuncName]
      steps.splice(i + 1, 0, ...targetSteps)
      continue
    }

    // All other functions are handled by callings functions from funcs.ts
    const parsedParams = params.map(param => parseParams(state, param))
    const func: Function = funcs[funcName]
    if (func) {
      const result = func(state, ...parsedParams)
      // a false result means we should stop execution of remaining steps
      if (result === false) {
        break
      } else if (result === true) {
        continue
      } else if (result && result.addSteps) {
        if (result.addSteps.length > 0) {
          steps.splice(i + 1, 0, ...result.addSteps)
        }
      } else if (Array.isArray(result)) {
        result.forEach(subAction => {
          state = swiss(state, subAction)
          determineAudience(subAction)
          performedActions.push(subAction)
        })
      } else if (result) {
        const subAction = result
        state = swiss(state, subAction)
        determineAudience(subAction)
        performedActions.push(result)
      }
    }
  }

  action.$subActions = performedActions
  return performedActions
}
