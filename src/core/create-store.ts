import memStorage from './mem-storage'
import Store from './store'
import simpleSetter from './reducers/simple-setter'
import optimistic from './reducers/optimistic'

interface IOptions {
  reducer?: Function,
  storage?: Function,
  middleware?: Array<Function>
}

/**
 * Set up a sync state
 */
export default function createStore (options: IOptions = {}) {
  const reducer = options.reducer || simpleSetter
  const storage = options.storage || memStorage
  const middleware = options.middleware || []
  const optimisticReducer = optimistic(reducer)
  const store = Store(optimisticReducer, storage, middleware)
  return store
}
