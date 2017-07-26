export default function createWebSocket (
  url: string,
  credential: string = ''
): WebSocket {
  if (!WebSocket) throw new Error('WEBSOCKET_UNDEFINED')
  return new WebSocket(url, credential || undefined)
}
