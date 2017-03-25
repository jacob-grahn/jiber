import {
  ADD_CONFIRMED_ACTION,
  SET_CONFIRMED_SATE
} from './constants/action-types'

export const ActionCreators = {
  addConfirmedAction (confirmedAction, timeMs) {
    return {type: ADD_CONFIRMED_ACTION, confirmedAction, timeMs}
  },
  setConfirmedState (confirmedState, timeMs) {
    return {type: SET_CONFIRMED_SATE, confirmedState, timeMs}
  }
}
