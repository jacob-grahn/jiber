import {
  createDictionary,
  createAllowActions,
  Reducer,
  INIT_SOCKET,
  REMOVE_SOCKET,
  ADD_USER
} from '../../../core/index'
import socket from './socket'

const dictionary = createDictionary(socket, 'socketId')

export default createAllowActions(
  dictionary,
  [INIT_SOCKET, REMOVE_SOCKET, ADD_USER]
)

export { Reducer }                                                              // stop the compiler from complaining https://github.com/Microsoft/TypeScript/issues/6307
