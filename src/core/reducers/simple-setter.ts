import { Action } from '../interfaces/action'

export interface SetterState {
  [key: string]: any
}

// Actions
const SET = 'SET'

// Reducer
export default function simpleSetter (
  state: SetterState = {},
  action: Action
): SetterState {
  switch (action.type) {
    case SET:
      const data = action.data || {}
      return {
        ...state,
        ...data
      }

    default:
      return state
  }
}

// Action Creators
export function set (roomId: string, data: {[key: string]: any}) {
  return {type: SET, $hope: roomId, data}
}
