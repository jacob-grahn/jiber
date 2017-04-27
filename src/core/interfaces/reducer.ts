import Action from './action'

interface Reducer {
  (state: any, action: Action): any
}

export { Reducer as default }
