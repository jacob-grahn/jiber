import { Store } from '../../core/index'
import ClientState from './client-state'

export interface ClientStore extends Store {
  getState: () => ClientState,
  createRoom: (roomId: string) => any
}

export default ClientStore
