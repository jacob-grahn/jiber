import { Store } from '../../core/index'
import ServerState from './server-state'

interface ServerStore extends Store {
  getState: () => ServerState
}

export default ServerStore
