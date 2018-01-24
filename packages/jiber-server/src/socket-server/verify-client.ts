import { ServerStore } from '../server-store'

type Info = {req: any}
type CB = (result: boolean) => void

/**
 * called when a http request tries to upgrade to a socket connection
 * sec-websocket-protocol is abused as a way to pass along an access credential
 * the credential is passed to loginRequestHandler, which may be user supplied
 * if no error is thrown, then the user is considered logged in
 */
export const verifyClient = (store: ServerStore) => async (info: Info, cb: CB) => {
  const credential = info.req.headers['sec-websocket-protocol']
  return store.settings.login(info.req, credential)
    .then(user => {
      info.req.verified = user
      cb(true)
    })
    .catch(() => {
      cb(false)
    })
}
