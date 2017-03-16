export const ActionTypes = {
  ADD_CONFIRMED_ACTION: 'duck-duck/ADD_CONFIRMED_ACTION',
  SET_CONFIRMED_STATE: 'duck-duck/SET_CONFIRMED_SATE'
}

export const ActionCreators = {
  addConfirmedAction (confirmedAction, timeMs) {
    return {type: ActionTypes.ADD_CONFIRMED_ACTION, confirmedAction, timeMs}
  },
  setConfirmedState (confirmedState, timeMs) {
    return {type: ActionTypes.SET_CONFIRMED_SATE, confirmedState, timeMs}
  }
}
