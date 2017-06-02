import { Action } from '../../core/index'

interface Storage {
  addActions: (roomId: string, actions: Action[]) => Promise<any>,
  getActions: (roomId: string, minTimeMs: number) => Promise<Action[]>,
  removeActions: (roomId: string, maxTimeMs: number) => Promise<any>
  getState: (roomId: string) => Promise<any>,
  setState: (roomId: string, state: any) => Promise<boolean>,
  clear?: () => void
}

export { Storage as default }
