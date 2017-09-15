import { RoomState, Action } from 'jiber-core'

/**
 * Clients have a few additional fields to handle optimistic state
 */
export interface ClientRoomState extends RoomState {
  optimistic: any,
  optimisticActions: Action[]
}
