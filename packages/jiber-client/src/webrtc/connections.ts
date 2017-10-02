import { Action } from 'jiber-core'

type Connection = {
  userId: string
}

const connections = {}

const add = (connection: Connection): void => {
  connections[connection.userId] = connection
}

const remove = (userId: string): void => {
  delete connections[userId]
}

const onOffer = (action: Action): void => {
  const userId = action.$userId
  if (connections[userId]) return
  connections[userId] = createConnection(userId, action.offer)
}

const onJoinRoom = (action: Action): void => {
  const userIds = Object.keys(action.members)
  userIds.forEach(userId => {
    if (connections[userId]) return
    connections[userId] = createConnection(userId)
  })
}

const onConnectionClose = (connection: Connection): void => {
  remove(connection.userId)
}
