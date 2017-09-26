/**
 * This reducer offers some generic functionality which could work well for
 * a variety of applications.
 * In an effort to offer a default setup that just works, this reducer
 * will be included in the client bundle. If you are using a custom reducer,
 * then you can safely exclude this file
 */

import { Action } from '../interfaces/action'
import { set } from '../utils/set'
import { get } from '../utils/get'
import { splice } from './splice'
import { isAllowedPath } from './is-allowed-path'

export interface SwissState {
  [key: string]: any
}

export const SET = 'SET'
export const DELETE = 'DELETE'
export const ADD = 'ADD'
export const SUBTRACT = 'SUBTRACT'
export const PUSH = 'PUSH'
export const POP = 'POP'
export const SHIFT = 'SHIFT'
export const UNSHIFT = 'UNSHIFT'
export const SPLICE = 'SPLICE'

export const swissActionCreators = {
  set: (path: string, value: any) => ({type: SET, path, value}),
  delete: (path: string) => ({type: DELETE, path}),
  add: (path: string, value: any) => ({type: ADD, path, value}),
  subtract: (path: string, value: any) => ({type: SUBTRACT, path, value}),
  push: (path: string, value: any) => ({type: PUSH, path, value}),
  pop: (path: string, value: any) => ({type: POP, path, value}),
  shift: (path: string, value: any) => ({type: SHIFT, path, value}),
  unshift: (path: string, value: any) => ({type: UNSHIFT, path, value}),
  splice: (path: string, start: number, count: number, ...items: any[]) => {
    return {type: SPLICE, path, start, count, items}
  }
}

export const swiss = (state: SwissState = {}, action: Action): SwissState => {
  const path = action.path
  const value = action.value
  const oldValue = get(state, path)
  const grantWrite = get(action, '$user.grantWrite') || ''

  if (!isAllowedPath(grantWrite, path)) return state

  switch (action.type) {
    case SET:
      return set(state, path, value)
    case DELETE:
      return set(state, path, undefined)
    case ADD:
      return set(state, path, oldValue + value)
    case SUBTRACT:
      return set(state, path, oldValue - value)
    case PUSH:
      return set(state, path, splice(oldValue, Infinity, 0, ...value))
    case POP:
      return set(state, path, splice(oldValue, -1, 1))
    case SHIFT:
      return set(state, path, splice(oldValue, 0, 1))
    case UNSHIFT:
      return set(state, path, splice(oldValue, 0, 0, ...value))
    case SPLICE:
      const {start, count, items} = action
      return set(state, path, splice(oldValue, start, count, ...items))
    default:
      return state
  }
}
