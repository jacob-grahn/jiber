// todo: add a forEach and map util function to jiber-core
import { Action, Store, LEAVE_ROOM, JOIN_ROOM, WEBRTC_OFFER } from 'jiber-core'
import { PeerConnection, createPeerConnection } from './peer-connection'
import { ClientSettings } from '../interfaces/client-settings'
import { ClientState } from '../interfaces/client-state'
import { prefixFix } from './prefix-fix'

const connections: {[userId: string]: PeerConnection} = {}

/**
 * When we join a room, existing members send us offers (WEBRTC_OFFER)
 * When another user joins, we send an offer (we are now an existing member)
 */
export const createPeerManager = (store: Store, settings: ClientSettings): void => {
  // standardize browser prefixes
  prefixFix()

  // create a list of all userIds that you should be connected to
  const toAllMemberIds = (state: ClientState): string[] => {
    const roomIds = Object.keys(state.rooms)
    const allMemberDict = roomIds.reduce((collector, roomId) => {
      const room = state.rooms[roomId]
      return Object.assign(collector, room.members)
    }, {})
    return Object.keys(allMemberDict)
  }

  // remove a connection that we no longer want
  const remove = (userId: string): void => {
    const connection = connections[userId]
    if (!connection) return
    connection.close()
    delete connections[userId]
  }

  // remove connections we no longer want
  const removeUnusedConnections = () => {
    const allMemberIds = toAllMemberIds(store.getState())
    const connectedMemberIds = Object.keys(connections)
    connectedMemberIds.forEach(connectedMemberId => {
      if (allMemberIds.indexOf(connectedMemberId) === -1) {
        remove(connectedMemberId)
      }
    })
  }

  // add a new connection
  const addConnection = (action: Action, sendOffer: Boolean = false): void => {
    const userId = action.$userId
    if (connections[userId]) return
    const connection = createPeerConnection(userId, store, settings)
    connections[connection.userId] = connection
    if (sendOffer) connection.sendOffer()
  }

  // trigger events when actions are dispatched
  store.subscribe((action: Action) => {
    console.log('peer-manager', action)
    // no need to mess with optimistic ations here
    if (!action.$confirmed) return

    // add and remove connections as needed
    switch (action.type) {
      case LEAVE_ROOM:
        removeUnusedConnections()
        break
      case JOIN_ROOM:
        if (action.$userId === store.getState().me.userId) return
        addConnection(action, true)
        break
      case WEBRTC_OFFER:
        addConnection(action)
        break
    }

    // each connection responds to actions as well
    Object.keys(connections).forEach(userId => {
      connections[userId].onAction(action)
    })
  })
}
