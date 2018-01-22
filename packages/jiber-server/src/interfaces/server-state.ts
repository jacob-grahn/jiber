import { User } from 'jiber-core'

export interface ServerState {
  [docId: string]: {
    state: any,
    members: {[uid: string]: User}
  }
}
