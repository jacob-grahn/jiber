export const createWebSocket = (
  url: string,
  credential: string|undefined
): WebSocket => {
  if (!WebSocket) throw new Error('WEBSOCKET_UNDEFINED')
  return new WebSocket(url, credential)
}
