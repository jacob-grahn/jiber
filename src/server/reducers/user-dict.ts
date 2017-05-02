import userReducer from './user'
import dict from './dict'

const namespace = 'hope/user/'
export default dict(userReducer, namespace)
