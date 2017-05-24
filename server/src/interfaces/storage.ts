import { Action } from '../../../core/index'

interface Storage {
  addAction: (roomId: string, action: Action) => Promise<any>,
  getNewActions: (roomId: string, minTimeMs: number) => Promise<Action[]>,
  removeOldActions: (roomId: string, maxTimeMs: number) => Promise<any>
  getState: (roomId: string) => Promise<any>,
  setState: (roomId: string, state: any) => Promise<boolean>
}

export { Storage as default }
