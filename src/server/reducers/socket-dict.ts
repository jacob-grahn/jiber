import socketReducer from './socket'
import dict from './dict'

const namespace = 'hope/socket/'
export default dict(socketReducer, namespace)
