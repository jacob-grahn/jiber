import { ActionCreators, Reducer } from './interfaces'
import { swiss, swissActionCreators } from './swiss'

export interface CustomSettings {
  actionCreators?: ActionCreators,
  backoffMs?: number,
  credential?: string
  initialState?: any,
  maxPeers?: number,
  reducer?: Reducer,
  stunServers?: string[],
  url?: string
}

export class Settings {

  public actionCreators: ActionCreators = swissActionCreators
  public backoffMs: number = 1000
  public credential?: string = undefined
  public initialState: any = undefined
  public maxPeers: number = 0
  public reducer: Reducer = swiss
  public stunServers: string[] = []
  public url?: string = 'ws://localhost:8080'

  constructor (custom: CustomSettings) {
    Object.assign(this, custom)
  }
}
