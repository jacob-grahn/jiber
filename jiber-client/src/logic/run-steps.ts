import { funcs } from './funcs'
import { parseParams } from './parse-params'
import { swiss } from '../swiss'

export const runSteps = (state: any, action: any) => {

  const logic: any = state._logic
  const type: string = action.type
  let steps: any[] = logic[type] || []
  let skipParent = ''
  const performedActions: any[] = []

  for (let i = 0; i < steps.length; i++) {
    const step: any[] = steps[i]
    const stepParent: string = (step as any)._parent
    const [funcName, ...params] = step

    // if a CHECK failed, skip until the end of this block
    if (stepParent === skipParent) {
      continue
    }

    // The RUN command is a special case, it needs to be able to pull steps from the logic object
    if (funcName === 'RUN') {
      const targetFuncName = params[0]
      // tag these steps with the func they came from
      const targetSteps = logic[targetFuncName].map((step: any) => {
        const taggedStep: any = [...step]
        taggedStep._parent = targetFuncName
        return taggedStep
      })
      // copy the step array so we don't mody the origianl logic
      steps = [...steps]
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
        skipParent = stepParent
        continue
      } else if (result === true) {
        continue
      } else if (result && result.addSteps) {
        if (result.addSteps.length > 0) {
          steps.splice(i + 1, 0, ...result.addSteps)
        }
      } else if (result) {
        const subAction = result
        state = swiss(state, subAction)
        performedActions.push(result)
      }
    }
  }

  action.$subActions = performedActions
  return state
}
