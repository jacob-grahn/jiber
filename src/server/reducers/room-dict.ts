import roomReducer from './room'
import dict from './dict'

const namespace = 'hope/room/'
export default dict(roomReducer, namespace)
