const SET = 'SET'

interface ISetterState {
  [key: string]: any
}

interface ISetterAction {
  type?: string,
  key?: string,
  value?: any
}

export default function simpleSetter (
  state: ISetterState,
  action: ISetterAction = {}
): ISetterState {
  switch (action.type) {
    case undefined:
      return {}

    case SET:
      return {
        ...state,
        [action.key]: action.value
      }
  }
}
