import { Action, RoomState } from '../../core/index'

interface Storage {
  addActions: (roomId: string, actions: Action[]) => Promise<void>,
  getActions: (roomId: string, minTimeMs: number) => Promise<Action[]>,
  removeActions: (roomId: string, maxTimeMs: number) => Promise<void>
  getState: (roomId: string) => Promise<RoomState>,
  setState: (roomId: string, state: RoomState) => Promise<boolean>,
  clear?: () => void
}

export default Storage
