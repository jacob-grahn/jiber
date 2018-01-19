import {
  ADD_USER,
  REMOVE_USER,
  createAllowActions,
  dictionary,
  user
} from 'jiber-core'

/**
 * Keep track of the users that are connected to the server
 */
const userDict = dictionary(user, 'user.userId')
const allowedActions = createAllowActions(userDict, [ADD_USER, REMOVE_USER])
export const users = allowedActions
