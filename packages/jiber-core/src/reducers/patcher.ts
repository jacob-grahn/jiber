import { Action } from '../interfaces/action'

export const SET = 'patcher/SET'

/**
 * A very simple reducer that conbines the old state with whatever new values
 * you provide
 */
export const patcher = (state: any = {}, action: Action): any => {
  switch (action.type) {
    case SET:
      if (typeof action.set !== 'object') return state
      return { ...state, ...action.set }
    default:
      return state
  }
}

export const patcherActionCreators = {
  set: (obj: any) => ({ type: SET, set: obj })
}
