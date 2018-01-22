import { ServerStore } from '../server-store'

/**
 * called when a http request tries to upgrade to a socket connection
 * sec-websocket-protocol is abused as a way to pass along an access credential
 * the credential is passed to loginRequestHandler, which may be user supplied
 * if no error is thrown, then the user is considered logged in
 */
export const verifyClient = (store: ServerStore) => (
  info: {req: any},
  cb: (result: boolean) => void
) => {
    const credential = info.req.headers['sec-websocket-protocol']
    store.settings.login(info.req, credential)
      .then(user => {
        info.req.verified = user
        cb(true)
      })
      .catch(() => {
        cb(false)
      })
}
