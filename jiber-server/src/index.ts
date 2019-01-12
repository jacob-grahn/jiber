import { SocketServer } from './socket-server'
import { ServerSettingsInput, ServerSettings, ServerState } from './interfaces'
import { defaultServerSettings } from './default-server-settings'
import { linkMiddleware } from './utils/link-middleware'
import { broadcast, history, subscriptions } from './middleware'

export class JiberServer {
  private state: ServerState

  constructor (input: ServerSettingsInput) {
    const settings: ServerSettings = { ...defaultServerSettings, ...input }
    const socketServer = new SocketServer(settings)

    this.state = {
      history: {},
      settings,
      socketServer,
      subscriptions: {}
    }

    const actionHandler: any = linkMiddleware(this.state, [subscriptions, history, broadcast])
    socketServer.on('action', actionHandler)
  }

  close = () => {
    this.state.socketServer.close()
  }
}
