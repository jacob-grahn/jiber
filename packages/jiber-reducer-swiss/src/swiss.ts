import { Action, set, get } from 'jiber-core'
import { splice } from './splice'
// import { validateDeep } from './validate'

/**
 * This reducer offers some generic functionality which could work well for
 * a variety of applications.
 * In an effort to offer a default setup that just works, this reducer
 * will be included in the client bundle. If you are using a custom reducer,
 * then you can safely exclude this file
 */

export interface SwissState {
  [key: string]: any
}

export const SET = 'SET'
export const DELETE = 'DELETE'
export const ADD = 'ADD'
export const PUSH = 'PUSH'
export const SPLICE = 'SPLICE'

const toSplice = (path: string, start: number, count: number, ...items: any[]) => {
  return { type: SPLICE, path, start, count, items }
}

export const swissActionCreators = {
  set: (path: string, value: any) => ({ type: SET, path, value }),
  delete: (path: string) => ({ type: DELETE, path }),
  add: (path: string, value: any) => ({ type: ADD, path, value }),
  subtract: (path: string, value: number) => ({ type: ADD, path, value: -value }),
  push: (path: string, value: any) => ({ type: PUSH, path, value }),
  pop: (path: string, value: any) => splice(path, -1, 1, value),
  shift: (path: string) => splice(path, 0, 1),
  unshift: (path: string, value: any) => splice(path, 0, 0, value),
  splice: toSplice
}

export const swiss = (state: SwissState = {}, action: Action): SwissState => {
  const path = action.path
  const newValue = action.value
  const oldValue = get(state, path)
  // const me = action.$user

  /* if (!validateDeep({
    state,
    me,
    newValue,
    oldValue,
    rules: {}, // todo: get rules from settings somehow,
    path
  })) return state */

  switch (action.type) {
    case SET:
      return set(state, path, newValue)
    case DELETE:
      return set(state, path, undefined)
    case ADD:
      return set(state, path, oldValue + newValue)
    case PUSH:
      return set(state, path, splice(oldValue, Infinity, 0, ...newValue))
    case SPLICE:
      const { start, count, items } = action
      return set(state, path, splice(oldValue, start, count, ...items))
    default:
      return state
  }
}
