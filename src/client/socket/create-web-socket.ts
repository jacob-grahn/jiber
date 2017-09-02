/**
 * Just creates a new WebSocket and returns it. This makes unit tests
 * a little easier to run
 * todo: maybe this isn't needed, maybe a WebSocket mock would work
 */
export const createWebSocket = (
  url: string,
  credential: string|undefined
): WebSocket => {
  if (!WebSocket) throw new Error('WEBSOCKET_UNDEFINED')
  return new WebSocket(url, credential)
}
