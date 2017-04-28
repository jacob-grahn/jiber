import { Action } from '../../core'

interface Storage {
  addAction: (roomId: string, action: Action) => Promise<any>,
  getNewActions: (roomId: string, minTimeMs: number) => Promise<Action[]>,
  removeOldActions: (roomId: string, maxTimeMs: number) => Promise<any>
  getState: (roomId: string) => any,
  setState: (roomId: string, state: any) => void
}

export { Storage as default }
