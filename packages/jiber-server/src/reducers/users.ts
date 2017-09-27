import {
  ADD_USER,
  REMOVE_USER,
  createAllowActions,
  createDictionary,
  user
} from 'jiber-core'

/**
 * Keep track of the users that are connected to the server
 */
const dictionary = createDictionary(user, 'user.userId')
const allowedActions = createAllowActions(dictionary, [ADD_USER, REMOVE_USER])
export const users = allowedActions
