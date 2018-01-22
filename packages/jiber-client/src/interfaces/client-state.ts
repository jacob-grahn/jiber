import { UserDict, User } from 'jiber-core'
import { ClientDocState } from '../reducers/client-doc/client-doc'

/**
 * Overview of what state the client will store
 */
export interface ClientState {
  users: UserDict,
  docs: {
    [docId: string]: ClientDocState
  },
  me: User
}
