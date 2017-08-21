import { Action, RoomState } from '../../core/index'

export interface Storage {
  pushAction: PushAction,
  fetchActions: FetchActions,
  removeActions: RemoveActions,
  fetchState: FetchState,
  storeState: StoreState,
  clear?: () => void
}

export type PushAction = (roomId: string, action: Action) => Promise<void>
export type FetchActions = (roomId: string, minMs: number) => Promise<Action[]>
export type RemoveActions = (roomId: string, maxMs: number) => Promise<void>
export type FetchState = (roomId: string) => Promise<RoomState>
export type StoreState = (roomId: string, state: RoomState) => Promise<void>
