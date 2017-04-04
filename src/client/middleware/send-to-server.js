/**
 * Send events to the master server
 * @param  {string} server  url of the server to connect to
 * @return {function}       middleware
 */
export default function sendToServer (server) {
  if (!server) return (action) => action                                        // if there is no server, return an empty middleware

  let socket
  let retryCount = 0


  return (action) => {
    queue.push(action)
    sendQueue()
    return action
  }


}
