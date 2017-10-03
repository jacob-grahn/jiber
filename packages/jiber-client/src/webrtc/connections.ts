import { Action } from 'jiber-core'
import { Connection, createConnection } from './connection'
import { prefixFix } from './prefix-fix'

prefixFix()

const connections: {[userId: string]: Connection} = {}

const remove = (userId: string): void => {
  delete connections[userId]
}

const add (connection: Connection): void => {
  connection.onRemove = () => remove(connection.userId)
  connections[connection.userId] = connection
}

export const onOffer = (action: Action): void => {
  const userId = action.$userId
  if (connections[userId]) return
  add(createConnection(userId, action.offer))
}

export const onJoinRoom = (action: Action): void => {
  const userId = action.$userId
  if (connections[userId]) return
  add(createConnection(userId))
}
