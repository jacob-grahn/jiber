import { Action, Reducer, SourceType, PEER, SERVER, CLIENT } from '../../../core/index'
import pruneActions from './prune-actions'
import nextActionId from './next-action-id'


/* export interface RoomState {
  memberIds: string[],                                                          // List of user ids that have joined this room
  confirmed: any,
  optimistic: any,
} */

/* const defaultState: RoomState = {
  memberIds: [],
  confirmed: undefined,
  optimistic: undefined,
} */

// Reducer
export default function reducerEnhancer (reducer: Reducer): Reducer {
  return function roomReducer (
    state: RoomState = defaultState,
    action: Action
  ): RoomState {
    switch (action.type) {
      case JOIN_RESULT:
        const claimedActions = claimActions(state.actions, action.myUserId)
        return {
          ...state,
          confirmed: action.confirmedState,
          optimistic: claimedActions.reduce(reducer, action.confirmedState)
        }

      case CONFIRM_ACTION:
        const cAction = action.action
        const confirmedState = reducer(state.confirmed, cAction)
        const actions = pruneActions(
          state.actions,
          cAction.userId,
          cAction.actionId
        )
        return {
          ...state,
          confirmed: confirmedState,
          optimistic: actions.reduce(reducer, confirmedState),
          actionIds: {
            ...state.actionIds,
            [cAction.userId]: cAction.actionId
          }
        }

      case PEER_ACTION:
        const peerAction: HopeAction = action.action
        const expectedActionId = nextActionId(peerAction.$hope.userId, state)
        const receivedActionId = peerAction.$hope.actionId
        if (receivedActionId !== expectedActionId) return state
        return {
          ...state,
          optimistic: reducer(state.optimistic, peerAction)
        }

      default:
        return {
          ...state,
          optimistic: reducer(state.optimistic, action)
        }
    }
  }
}
