import { Action, CONFIRM_ACTION, JOIN_ROOM, get } from '../../core/index'
import ClientStore from '../interfaces/client-store'

export interface ServerConnection {
  send: (action: Action) => void
}

export interface ServerConnectionOptions {
  url: string,
  socketPort: number,
  credential?: string,
  store: ClientStore
}

type TryToConnect = (
  url: string,
  credential: any,
  backoffMs?: number
) => Promise<WebSocket>

// Attepts to keep an open connection with the specified server
// Messages are held in a queue until the server sends back a confirmation
export default function createServerConnection (
  {url, socketPort, credential, store}: ServerConnectionOptions,
  tryToConnect: TryToConnect,
  writeQueue: {write: (socket: WebSocket, message: string) => void}
): ServerConnection {
  let socket: WebSocket

  if (url) {
    connect()
  }

  async function connect () {
    const fullUrl = `ws://${url}:${socketPort}`
    socket = await tryToConnect(fullUrl, credential)
    socket.onmessage = onMessage
    socket.onclose = connect                                                    // try to reconnect if the connection is lost
    rejoinRooms()
    return socket
  }

  // Event handlers
  function onMessage (event: MessageEvent): void {
    const action = JSON.parse(event.data)
    if (!action.$hope || !action.$hope.roomId) return
    const roomId = action.$hope.roomId
    store.dispatch({type: CONFIRM_ACTION, action, $hope: {roomId}})
  }

  // Add a message to be sent
  function send (action: Action): void {
    const roomId = get(action, '$hope.roomId')
    const smallerAction = {...action, $hope: {roomId}}
    const strAction = JSON.stringify(smallerAction)
    writeQueue.write(socket, strAction)
  }

  function rejoinRooms () {
    const state = store.getState()
    Object.keys(state.rooms).forEach(roomId => {
      const action = {type: JOIN_ROOM, $hope: {roomId}}
      send(action)
    })
  }


  // public methods
  return {
    send
  }
}
