import { Action } from '../action'
import {
  WEBRTC_OFFER,
  WEBRTC_ANSWER,
  WEBRTC_SOLICIT,
  WEBRTC_CANDIDATE,
  PEER
} from '../constants'

export class Peer {

  private sendToServer: Function
  private sendToStore: Function
  private docId: string
  private peerId: string
  private connection: RTCPeerConnection
  private channel?: RTCDataChannel
  private channelSettings = { ordered: false, maxRetransmits: 0 }

  constructor (
    docId: string,
    peerId: string,
    sendToServer: Function,
    sendToStore: Function,
    stunServers: string[] = []
  ) {
    this.docId = docId
    this.peerId = peerId
    this.sendToServer = sendToServer
    this.sendToStore = sendToStore
    this.connection = new RTCPeerConnection({
      iceServers: stunServers.map(url => ({ urls: url }))
    })
    this.connection.addEventListener('icecandidate', (event) => {
      if (!event.candidate) return
      this.sendToServer(new Action({
        type: WEBRTC_CANDIDATE,
        doc: this.docId,
        candidate: event.candidate,
        peerId: this.peerId
      }))
    })
    this.connection.addEventListener('datachannel', (event: any) => {
      this.channel = (event.channel) as RTCDataChannel
      this.channel.addEventListener('message', this.receiveFromPeer)
    })
  }

  public send = (action: Action) => {
    if (this.channel && this.channel.readyState === 'open') {
      this.channel.send(JSON.stringify(action))
    }
  }

  public receiveFromServer = async (action: Action) => {
    if (action.type === WEBRTC_SOLICIT) {
      this.createChannel()
      await this.sendOffer()
    } else if (action.type === WEBRTC_OFFER) {
      await this.sendAnswer(action.offer)
    } else if (action.type === WEBRTC_ANSWER) {
      await this.connection.setRemoteDescription(action.answer)
    } else if (action.type === WEBRTC_CANDIDATE) {
      await this.connection.addIceCandidate(action.candidate)
    }
  }

  public close = () => {
    this.connection.close()
  }

  private sendOffer = async (): Promise<void> => {
    const offer = await this.connection.createOffer()
    await this.connection.setLocalDescription(offer)
    this.sendToServer(new Action({
      type: WEBRTC_OFFER,
      doc: this.docId,
      offer,
      peerId: this.peerId
    }))
  }

  private sendAnswer = async (offer: any) => {
    await this.connection.setRemoteDescription(offer)
    const answer = await this.connection.createAnswer()
    await this.connection.setLocalDescription(answer)
    this.sendToServer(new Action({
      type: WEBRTC_ANSWER,
      doc: this.docId,
      answer,
      peerId: this.peerId
    }))
  }

  private createChannel = (name: string = 'data') => {
    this.channel = this.connection.createDataChannel(
      name,
      this.channelSettings
    )
    this.channel.addEventListener('message', this.receiveFromPeer)
  }

  private receiveFromPeer = (event: any) => {
    const data: any = JSON.parse(event.data)
    const action = new Action({ ...data, trust: PEER, time: Date.now() })
    this.sendToStore(action)
  }
}
