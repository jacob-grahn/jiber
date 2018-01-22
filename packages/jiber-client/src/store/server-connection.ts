import { Action, SELF } from 'jiber-core'
import { onServerMessage } from './on-server-message'
import { ClientStore } from './client-store'
import { ToughSocket } from '../tough-socket'
import { ClientSettings } from '../interfaces/client-settings'

export const serverConnection = (store: ClientStore, options: ClientSettings) => {
  const toughSocket = new ToughSocket(options)

  // listen for actions from the server
  toughSocket.onmessage = onServerMessage(store)

  // send local actions to the server
  store.subscribe((_state: any, action: Action) => {
    if (action.$source === SELF) {
      const copy = { ...action }
      copy.$uid = copy.$user = copy.$timeMs = copy.$source = undefined
      toughSocket.send(JSON.stringify(copy))
    }
  })
}
