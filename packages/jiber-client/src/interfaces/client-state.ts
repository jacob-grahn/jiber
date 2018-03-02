import { Action } from './action'
import { User } from './user'

/**
 * Overview of what state the client will store
 */
export interface ClientState {
  docs: {
    [docId: string]: any
  },
  watchers: {
    [docId: string]: {
      [userId: string]: User
    }
  },
  peerTimes: {
    [userId: string]: number
  },
  optimisticActions: Action[],
  optimisticDocs: {
    [docId: string]: any
  },
  me: User
}
