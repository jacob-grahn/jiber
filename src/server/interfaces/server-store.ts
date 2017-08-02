import { Store } from '../../core/index'
import ServerState from './server-state'

interface ServerStore extends Store {
  getState: () => ServerState,
  start: () => void,
  stop: () => void
}

export default ServerStore
