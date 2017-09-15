import {
  createDictionary,
  createAllowActions,
  Reducer,
  INIT_SOCKET,
  REMOVE_SOCKET,
  ADD_USER
} from 'jiber-core'
import { socket } from './socket'

/**
 * Dictionary to look up sockets by id
 */
const dictionary = createDictionary(socket, 'socketId')

export const sockets = createAllowActions(
  dictionary,
  [INIT_SOCKET, REMOVE_SOCKET, ADD_USER]
)

export { Reducer }                                                              // stop the compiler from complaining https://github.com/Microsoft/TypeScript/issues/6307
