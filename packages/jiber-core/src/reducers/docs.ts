import { Reducer } from '../interfaces/reducer'
import { dictionary } from './dictionary'
import { doc } from './doc'

export const docs = (reducer: Reducer) => dictionary(doc(reducer), '$did')
