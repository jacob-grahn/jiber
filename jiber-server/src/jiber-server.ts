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
import { PACKET_FROM_CLIENT, SEND_TO_CONNECTION } from './constants'

export class JiberServer {
  private settings: ServerSettings
  public socketServer: SocketServer
  private docs: { [key: string]: DocStream } = {}

  constructor (input: ServerSettingsInput = {}) {
    this.settings = { ...defaultServerSettings, ...input }
    this.socketServer = new SocketServer(this.settings)
    const middleware: any = linkMiddleware(this, [
      init,
      openAndClose,
      wrtc,
      securityRules(this.settings.securityRules),
      broadcast
    ])
    this.socketServer.on(PACKET_FROM_CLIENT, middleware)
  }

  getDoc = (docId: string) => {
    // return an existing doc
    const existingDoc = this.docs[docId]
    if (existingDoc) return existingDoc

    // or create a new one
    const newDoc = new DocStream(this.settings.reducer, this.settings.maxHistory)
    this.docs[docId] = newDoc
    newDoc.on(SEND_TO_CONNECTION, this.socketServer.send)
    return newDoc
  }

  close = () => {
    this.socketServer.close()
  }
}
