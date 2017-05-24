export interface SetterState {
  [key: string]: any
}

export interface SetterAction {
  type: string,
  key: string,
  value: any
}

// Actions
const SET = 'hope/simpleSetter/SET'

// Reducer
export default function reducer (
  state: SetterState = {},
  action: SetterAction
): SetterState {
  switch (action.type) {
    case SET:
      const key: string = action.key
      return {
        ...state,
        [key]: action.value
      }

    default:
      return state
  }
}

// Action Creators
export function set (roomId: string, key: string, value: any) {
  return {type: SET, $hope: roomId, key, value}
}
