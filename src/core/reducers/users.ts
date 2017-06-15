import { default as user, ADD_USER, REMOVE_USER } from './user'
import allowActions from './allow-actions'
import dictionary from './dictionary'
import { Reducer } from '../interfaces/reducer'

export default allowActions(
  dictionary(user, 'user.userId'),
  [ADD_USER, REMOVE_USER]
)

export { Reducer }
