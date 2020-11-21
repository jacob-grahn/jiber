import { ActionCreators, Reducer } from './interfaces'
import { swissActionCreators } from './swiss'
import { logic } from './logic'

export interface CustomSettings {
  actionCreators?: ActionCreators,
  backoffMs?: number,
  credential?: string
  initialState?: any,
  maxPeers?: number,
  reducer?: Reducer,
  stunServers?: string[],
  url?: string,
  logic?: {}
}

export class Settings {

  public actionCreators: ActionCreators = swissActionCreators
  public backoffMs: number = 1000
  public credential?: string = undefined
  public initialState: any = undefined
  public maxPeers: number = 0
  public reducer: Reducer = logic
  public stunServers: string[] = []
  public url?: string = 'ws://localhost:8080'
  public logic?: {}

  constructor (custom: CustomSettings) {
    Object.assign(this, custom)
  }
}
