import Action from './action'

interface Store {
  getState: () => any,
  dispatch: {(action: Action): any}
}

export default Store
