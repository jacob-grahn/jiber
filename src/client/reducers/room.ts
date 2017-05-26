import { Action, Reducer, combineReducers } from '../../core/index'
import HopeAction from '../interfaces/hope-action'
import actionIds from './action-ids'
import createConfirmedState from './confirmed-state'
import myUserId from './my-user-id'
import optimisticActions from './optimistic-actions'
import createOptimisticState from './optimistic-state'
import status from './status'
import { NOT_JOINING } from './room-states'

export interface RoomState {
  actionIds: {[key: string]: number},
  confirmedState: any,
  myUserId: string,
  optimisticActions: HopeAction[],
  optimisticState: any,
  status: string
}

const defaultRoomState: RoomState = {
  actionIds: {},
  confirmedState: undefined,
  myUserId: '',
  optimisticActions: [],
  optimisticState: undefined,
  status: NOT_JOINING
}

export default function createRoom (subReducer: Reducer): Reducer {
  const confirmedState = createConfirmedState(subReducer)
  const optimisticState = createOptimisticState(subReducer)
  const intermediateReducer = combineReducers({
    actionIds,
    confirmedState,
    myUserId,
    optimisticActions,
    status
  })

  return function roomReducer (
    state: RoomState = defaultRoomState,
    action: HopeAction
  ): RoomState {
    if (!action.$hope) return state
    const intermediateState = intermediateReducer(state, action)
    const finalOptimisticState = optimisticState(state.optimisticState, action, state)
    return {...intermediateState, optimisticState: finalOptimisticState}
  }
}
