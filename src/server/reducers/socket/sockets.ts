import {
  dictionary,
  allowActions,
  Reducer,
  INIT_SOCKET,
  REMOVE_SOCKET,
  ADD_USER
} from '../../../core/index'
import socket from './socket'

export default allowActions(
  dictionary(socket, 'socketId'),
  [INIT_SOCKET, REMOVE_SOCKET, ADD_USER]
)

export { Reducer }                                                              // stop the compiler from complaining https://github.com/Microsoft/TypeScript/issues/6307
