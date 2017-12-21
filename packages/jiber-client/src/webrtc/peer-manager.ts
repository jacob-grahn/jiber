import {
  Action,
  Store,
  LEAVE_ROOM,
  JOIN_ROOM,
  WEBRTC_OFFER,
  forEach,
  reduce
} from 'jiber-core'
import { Peer } from './peer'
import { ClientSettings } from '../interfaces/client-settings'
import { prefixFix } from './prefix-fix'

/**
 * When we join a room, existing members send us offers (WEBRTC_OFFER)
 * When another user joins, we send an offer (we are now an existing member)
 * @hidden
 */
export class PeerManager {
  private store: Store
  private settings: ClientSettings
  private connections: {[userId: string]: Peer} = {}

  constructor (store: Store, settings: ClientSettings) {
    this.store = store
    this.settings = settings
    prefixFix()

    // add and remove connections as needed
    store.subscribe((state: any, action: Action) => {
      if (!action.$confirmed) return

      switch (action.type) {
        case LEAVE_ROOM:
          return this.removeUnusedConnections()
        case JOIN_ROOM:
          if (!action.$userId) return
          if (action.$userId === state.me.userId) return
          return this.addConnection(action.$userId)
        case WEBRTC_OFFER:
          if (!action.$userId) return
          return this.addConnection(action.$userId, action.offer)
      }
    })
  }

  // create a list of all userIds that you should be connected to
  private allMembers = (): string[] => {
    const state = this.store.getState()
    return reduce(state.rooms, (members, room) => {
      return Object.assign(members, room.members)
    }, {})
  }

  // remove a connection that we no longer want
  private remove = (userId: string): void => {
    const connection = this.connections[userId]
    if (!connection) return
    connection.close()
    delete this.connections[userId]
  }

  // remove connections we no longer want
  private removeUnusedConnections = () => {
    const allMembers = this.allMembers()
    forEach(this.connections, connection => {
      if (!allMembers[connection.peerUserId]) this.remove(connection.peerUserId)
    })
  }

  // add a new connection
  private addConnection = (userId: string, offer?: any): void => {
    if (this.connections[userId]) return
    if (Object.keys(this.connections).length >= this.settings.maxPeers) return
    this.connections[userId] = new Peer(
      userId,
      this.store,
      this.settings,
      offer
    )
  }
}
