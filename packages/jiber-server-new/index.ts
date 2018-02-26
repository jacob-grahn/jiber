import { SocketServer } from './socket-server'
import { ServerSettingsInput, ServerSettings } from './server-settings'
import { defaultServerSettings } from './default-server-settings'
import { linkMiddleware } from './utils/link-middleware'

export class JiberServer {
  private socketServer: SocketServer
  private state: any = {}

  constructor (input: ServerSettingsInput) {
    const settings: ServerSettings = { ...defaultServerSettings, ...input }

    const { port, verifyClient, server } = settings
    this.socketServer = new SocketServer(port, verifyClient, server)

    const actionHandler: any = linkMiddleware(this.state, [subscriptions])
    this.socketServer.on('action', actionHandler)
  }

  close = () => {
    this.socketServer.close()
  }
}
