import { ADD_USER, REMOVE_USER } from '../constants/action-types'
import allowActions from './allow-actions'
import dictionary from './dictionary'
import Reducer from '../interfaces/reducer'
import user from './user'

export default allowActions(
  dictionary(user, 'user.userId'),
  [ADD_USER, REMOVE_USER]
)

export { Reducer }
