import { dictionary, Reducer } from '../../../core/index'
import socket from './socket'

const keyName = 'socketId'

export default dictionary(socket, keyName)
export { Reducer }                                                              // stop the compiler from complaining https://github.com/Microsoft/TypeScript/issues/6307
