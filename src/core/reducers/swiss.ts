/**
 * This reducer offers some generic functionality which could work well for
 * a variety of applications.
 * In an effort to offer a default setup that just works, this reducer
 * will be included in the client bundle. If you are creating your own build
 * and providing a custom reducer, then you can safely exclude this file
 */

import { Action } from '../interfaces/action'
import { set } from '../utils/set'
import { del } from '../utils/del'
import { get } from '../utils/get'

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

const getAsArray = (obj: any, path: any): any[] => {
  const value = get(obj, path)
  if (value === undefined) return []
  if (!Array.isArray(value)) return [value]
  return value
}

const push = (obj: any, path: any, values: any[]) => {
  const oldArray = getAsArray(obj, path)
  oldArray.push(...values)
  return oldArray
}

const pop = (obj: any, path: any): any[] => {
  const oldArray = getAsArray(obj, path)
  oldArray.pop()
  return oldArray
}

const shift = (obj: any, path: any): any[] => {
  const oldArray = getAsArray(obj, path)
  oldArray.shift()
  return oldArray
}

const unshift = (obj: any, path: any, values: any[]): any[] => {
  const oldArray = getAsArray(obj, path)
  oldArray.unshift(...values)
  return oldArray
}

const splice = (
  obj: any,
  path: any,
  start: number,
  count: number,
  items: any[] = []
): any[] => {
  const array = getAsArray(obj, path)
  array.splice(start, count, ...items)
  return array
}

export const swiss = (state: SwissState = {}, action: Action): SwissState => {
  const path = action.path
  const value = action.value

  switch (action.type) {
    case SET:
      return set(state, path, value)
    case DELETE:
      return del(state, path)
    case ADD:
      return set(state, path, get(state, path) + value)
    case SUBTRACT:
      return set(state, path, get(state, path) - value)
    case PUSH:
      return set(state, path, push(state, path, value))
    case POP:
      return set(state, path, pop(state, path))
    case SHIFT:
      return set(state, path, shift(state, path))
    case UNSHIFT:
      return set(state, path, unshift(state, path, value))
    case SPLICE:
      return set(state, path, splice(state, path, action.start, action.count, action.items))
    default:
      return state
  }
}
