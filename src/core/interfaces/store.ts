import Action from './action'

interface Store {
  state: any,
  commit: {(action: Action): any},
  dispatch: {(action: Action): Promise<any>}
}

export { Store as default }
