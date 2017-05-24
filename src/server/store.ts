import { createStore, simpleSetter, Store } from '../core/index'

const storeInstance = createStore(simpleSetter)

export { storeInstance as default }
