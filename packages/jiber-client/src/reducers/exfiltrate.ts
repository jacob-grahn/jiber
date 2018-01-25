import { Action, Reducer } from 'jiber-core'

/**
 * Shady non-pure reducer that smuggles the resulting state into the action
 * This is handy if a later reducer needs this state
 */
export const exfiltrate = (reducer: Reducer, key: string) => (state: any, action: Action) => {
  const newState = reducer(state, action)
  action[key] = newState
  return newState
}
