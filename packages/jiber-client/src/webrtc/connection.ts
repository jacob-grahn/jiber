// todo: createOffer() and createAnswer()
// todo: create middleware to pass events to webrtc
// todo: get typescript to stop complaining about createDataChannel
// todo: when to close connections?
// todo: set a maximum number of connections
// todo: I have no idea what I am doing
// todo: send offer when a new user joins a room
// https://shanetully.com/2014/09/a-dead-simple-webrtc-example/
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling
import {
  Store,
  Action,
  WEBRTC_OFFER,
  WEBRTC_ANSWER,
  WEBRTC_CANDIDATE
} from 'jiber-core'

export type Connection = {
  userId: string,
  sendOffer: Function
}

export const createConnection = (config: {
  userId: string,
  roomId: string,
  store: Store
}): Connection => {
  const { store, roomId, userId } = config
  // todo: remove these public stun servers and supply them via config
  // pc is short for peerConnection
  const pc = createPC()
  setupChannel(pc)

  const sendOffer = (): void => {
    pc.createOffer()
    .then((offer: RTCSessionDescription): void => {
      pc.setLocalDescription(offer)
      store.dispatch({
        type: WEBRTC_OFFER,
        offer,
        $roomId: roomId,
        toUserId: userId
      })
    })
  }

  const sendAnswer = (): void => {
    pc.createAnswer()
    .then((answer) => {
      pc.setLocalDescription(answer)
      store.dispatch({
        type: WEBRTC_ANSWER,
        answer,
        $roomId: roomId,
        toUserId: userId
      })
    })
  }

  const sendCandidate = (candidate: RTCIceCandidate): void => {
    store.dispatch({
      type: WEBRTC_CANDIDATE,
      candidate,
      $roomId: roomId,
      toUserId: userId
    })
  }

  const onAction = (action: Action): void => {
    if (!action.$confirmed) return
    if (action.$userId === store.getState().me.userId) return
    switch (action.type) {
      case WEBRTC_OFFER:
        pc.setRemoteDescription(action.offer).then(sendAnswer)
      case WEBRTC_ANSWER:
        pc.setRemoteDescription(action.answer)
      case WEBRTC_CANDIDATE:
        pc.addIceCandidate(action.candidate)
    }
  }

  store.subscribe(onAction)

  pc.onicecandidate = (event) => {
    if (!event.candidate) return
    sendCandidate(event.candidate)
  }

  const connection: Connection = {
    userId: config.userId,
    sendOffer
  }

  return connection
}

const createPC = () => {
  const pcConfig: RTCConfiguration = {
    iceServers: [
      {urls: 'stun:stun3.l.google.com:19302'},
      {urls: 'stun:stunserver.org'}
    ]
  }

  const pc = new RTCPeerConnection(pcConfig)
  return pc
}

const setupChannel = (pc: RTCPeerConnection) => {
  console.log('setupChannel', pc)
  const channelConfig: any = {
      ordered: false,
      negotiated: true,
      maxRetransmits: 0
  }
  const channel = (pc as any).createDataChannel('testChannel', channelConfig)

  channel.onerror = (error: any) => {
    console.log("channel.onerror", error)
  }

  channel.onmessage = (event: MessageEvent) => {
    console.log("channel.onmessage", event.data)
  }

  channel.onopen = () => {
    console.log('channel.onopen')
    channel.send("Hello World!")
  }

  channel.onclose = () => {
    console.log("channel.onclonse")
  }
}
