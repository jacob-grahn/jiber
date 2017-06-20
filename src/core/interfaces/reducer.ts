import Action from './action'

interface Reducer {
  (state: any, action: Action): any
}

export default Reducer
