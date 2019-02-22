import { SocketServer } from './socket-server'
import { DocStream } from './doc-stream'
import { ServerSettingsInput, ServerSettings } from './interfaces'
import { defaultServerSettings } from './default-server-settings'
import { linkMiddleware } from './utils/link-middleware'
import { wrtc } from './middleware'

export class JiberServer {
  public settings: ServerSettings
  public socketServer: SocketServer
  public docs: { [key: string]: DocStream } = {}

  constructor (input: ServerSettingsInput = {}) {
    this.settings = { ...defaultServerSettings, ...input }
    this.socketServer = new SocketServer(this.settings)

    const packetHandler: any = linkMiddleware(this, [wrtc])
    this.socketServer.on('action', packetHandler)
  }

  close = () => {
    this.socketServer.close()
  }
}
