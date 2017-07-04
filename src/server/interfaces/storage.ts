import { Action, RoomState } from '../../core/index'

interface Storage {
  pushAction: (roomId: string, action: Action) => Promise<void>,
  fetchActions: (roomId: string, minTimeMs: number) => Promise<Action[]>,
  removeActions: (roomId: string, maxTimeMs: number) => Promise<void>
  fetchState: (roomId: string) => Promise<RoomState>,
  storeState: (roomId: string, state: RoomState) => Promise<boolean>,
  clear?: () => void
}

export default Storage
