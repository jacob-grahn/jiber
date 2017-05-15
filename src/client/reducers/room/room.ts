import { Action, Reducer } from '../../../core/index'
import HopeAction from '../../interfaces/hope-action'
import actionIds from './action-ids'
import confirmedStateFactory from './confirmed-state'
import memberIds from './member-ids'
import myUserId from './my-user-id'
import optimisticActions from './optimistic-actions'
import optimisticStateFactory from './optimistic-state'
import status from './status'
import { NOT_JOINING } from './room-states'

export interface RoomState {
  actionIds: {[key: string]: number},
  confirmedState: any,
  memberIds: string[],
  myUserId: string,
  optimisticActions: HopeAction[],
  optimisticState: any,
  status: string
}

const defaultRoomState: RoomState = {
  actionIds: {},
  confirmedState: undefined,
  memberIds: [],
  myUserId: '',
  optimisticActions: [],
  optimisticState: undefined,
  status: NOT_JOINING
}

export default function roomFactory (subReducer: Reducer): Reducer {
  const confirmedState = confirmedStateFactory(subReducer)
  const optimisticState = optimisticStateFactory(subReducer)
  return function roomReducer (
    state: RoomState = defaultRoomState,
    action: Action
  ): RoomState {
    return {
      actionIds: actionIds(state.actionIds, action),
      confirmedState: confirmedState(state.confirmedState, action),
      memberIds: memberIds(state.memberIds, action),
      myUserId: myUserId(state.myUserId, action),
      optimisticActions: optimisticActions(state.optimisticActions, action),
      optimisticState: optimisticState(state, state.optimisticState, action),
      status: status(state.status, action)
    }
  }
}
