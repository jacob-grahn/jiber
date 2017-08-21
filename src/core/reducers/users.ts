import { ADD_USER, REMOVE_USER } from '../constants/action-types'
import { createAllowActions } from './allow-actions'
import { createDictionary } from './dictionary'
import Reducer from '../interfaces/reducer'
import { user } from './user'

const dictionary = createDictionary(user, 'user.userId')
const allowedActions = createAllowActions(dictionary, [ADD_USER, REMOVE_USER])
export const users = allowedActions

export { Reducer }                                                              // make the compiler happy
