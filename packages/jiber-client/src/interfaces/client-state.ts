import { Action, User } from 'jiber-core'

/**
 * Overview of what state the client will store
 */
export interface ClientState {
  docs: {
    [docId: string]: any
  },
  watchers: {
    [docId: string]: {
      [uid: string]: User
    }
  },
  peerTimes: {
    [uid: string]: number
  },
  optimisticActions: Action[],
  optimisticDocs: {
    [docId: string]: any
  },
  me: User
}
