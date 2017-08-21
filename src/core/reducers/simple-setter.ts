import Action from '../interfaces/action'

export interface SimpleSetterState {
  [key: string]: any
}

// Actions
const SET = 'SET'

// Reducer
export const simpleSetter = (
  state: SimpleSetterState = {},
  action: Action
): SimpleSetterState => {
  switch (action.type) {
    case SET:
      return {...state, [action.key]: action.value}
    default:
      return state
  }
}
