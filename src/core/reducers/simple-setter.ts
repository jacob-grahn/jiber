const SET = 'SET'

interface SetterState {
  [key: string]: any
}

interface SetterAction {
  type?: string,
  key?: string,
  value?: any
}

export default function simpleSetter (
  state: SetterState,
  action: SetterAction = {}
): SetterState {
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
