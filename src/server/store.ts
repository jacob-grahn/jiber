import { createStore, simpleSetter } from '../core/index'

const store = createStore(simpleSetter)

export { store as default }
