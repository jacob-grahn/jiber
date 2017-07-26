export default function writeQueue () {
  const queue: string[] = []

  function write (socket: WebSocket, message: string): void {
    queue.push(message)
    flush(socket)
  }

  function flush (socket: WebSocket): void {
    if (!isWritable(socket)) return
    queue.forEach((message) => write(socket, message))
    queue.splice(0, queue.length)
  }

  function isWritable (socket: WebSocket): boolean {
    if (!socket) return false
    if (socket.readyState !== socket.OPEN) return false
    return true
  }

  return {
    write
  }
}
