import { User } from 'jiber-core'

export interface ServerState {
  [docId: string]: {
    state: any,
    watchers: {[uid: string]: User}
  }
}
