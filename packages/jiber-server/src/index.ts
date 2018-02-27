import { SocketServer } from './socket-server'
import { ServerSettingsInput, ServerSettings, ServerState } from './interfaces'
import { defaultServerSettings } from './default-server-settings'
import { linkMiddleware } from './utils/link-middleware'
import { subscriptions } from './middleware/subscriptions'
import { broadcast } from './middleware/broadcast'

export class JiberServer {
  private state: ServerState

  constructor (input: ServerSettingsInput) {
    const settings: ServerSettings = { ...defaultServerSettings, ...input }

    const { port, verifyClient, server } = settings
    const socketServer = new SocketServer(port, verifyClient, server)

    this.state = {
      socketServer,
      subscriptions: {}
    }

    const actionHandler: any = linkMiddleware(this.state, [subscriptions, broadcast])
    socketServer.on('action', actionHandler)
  }

  close = () => {
    this.state.socketServer.close()
  }
}
