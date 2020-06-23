import { Action } from '../action'
import { WEBRTC_SOLICIT } from '../constants'
import { Peer } from './peer'

export class PeerGroup {

  private sendToServer: Function
  private sendToStore: Function
  private peers: { [key: string]: Peer } = {}

  constructor (docId: string, sendToServer: Function, sendToStore: Function) {
    this.sendToServer = sendToServer
    this.sendToStore = sendToStore
    this.sendToServer(new Action({ doc: docId, type: WEBRTC_SOLICIT }))
  }

  public receiveFromServer = (action: Action): void => {
    if (!action.doc) return
    if (action.type && action.type.indexOf('WEBRTC_') === 0) {
      const peerId = action.peerId
      if (!peerId) return
      if (!this.peers[peerId]) {
        this.peers[peerId] = new Peer(
          action.doc,
          peerId,
          this.sendToServer,
          this.sendToStore
        )
      }
      this.peers[peerId].receiveFromServer(action).catch(console.log)
    }
  }

  public send = (action: Action): void => {
    Object.keys(this.peers).forEach(peerId => {
      this.peers[peerId].send(action)
    })
  }

  public close = (): void => {
    Object.keys(this.peers).forEach(peerId => {
      this.peers[peerId].close()
      delete this.peers[peerId]
    })
  }
}
