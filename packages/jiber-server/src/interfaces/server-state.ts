import { User } from 'jiber-core'

export interface ServerState {
  docs: {
    [docId: string]: any
  },
  watchers: {
    [docId: string]: {
      [uid: string]: User
    }
  }
}
