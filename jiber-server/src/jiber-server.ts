import { SocketServer } from './socket-server'
import { DocStream } from './doc-stream'
import { ServerSettingsInput, ServerSettings } from './interfaces'
import { defaultServerSettings } from './default-server-settings'
import { linkMiddleware } from './utils/link-middleware'
import {
  broadcast,
  init,
  openAndClose,
  wrtc,
  securityRules
} from './middleware'
import { PACKET_FROM_CLIENT } from './constants'

export class JiberServer {
  public settings: ServerSettings
  public socketServer: SocketServer
  public docs: { [key: string]: DocStream } = {}

  constructor (input: ServerSettingsInput = {}) {
    this.settings = { ...defaultServerSettings, ...input }
    this.socketServer = new SocketServer(this.settings)

    const actionHandler: any = linkMiddleware(this, [
      init,
      openAndClose,
      wrtc,
      securityRules(this.settings.securityRules),
      broadcast
    ])
    this.socketServer.on(PACKET_FROM_CLIENT, actionHandler)
  }

  close = () => {
    this.socketServer.close()
  }
}
