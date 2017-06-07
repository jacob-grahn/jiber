import { createStore, simpleSetter } from '../core/index'

const storeInstance = createStore(simpleSetter)

export { storeInstance as default }
