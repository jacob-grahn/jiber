import { dictionary, Reducer } from '../../../core/index'
import socket from './socket'

export default dictionary(socket, 'socketId')
export { Reducer }                                                              // stop the compiler from complaining https://github.com/Microsoft/TypeScript/issues/6307
