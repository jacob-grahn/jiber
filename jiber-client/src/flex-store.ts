import { Action } from './action'
import { Reducer } from './interfaces'
import { SERVER, SELF, PEER } from './constants'

export class FlexStore {

  private reducer: Reducer
  private state: any
  private untrusted: Action[] = []
  private recentConfirmed: {[key: string]: number} = {}
  private cleanInterval: number = 5000
  private lastClean: number = 0

  constructor (reducer: Reducer, state: any = undefined) {
    this.reducer = reducer
    this.state = state
  }

  public receive = (action: Action) => {
    // trusted updates from the server
    if (action.trust === SERVER) {
      this.recentConfirmed[action.id] = Date.now()
      this.state = this.reducer(this.state, action)
      this.untrusted = this.untrusted.filter(p => p.id !== action.id)
      this.clean()
    } else {

      // don't add this action if a confirmed version of it already exists
      // (this optimistic update is too late)
      if (this.recentConfirmed[action.id]) return

      // add optimistic
      this.untrusted.push(action)
    }
  }

  public getState = (trust: number = SELF) => {
    if (trust === SERVER) {
      return this.state
    } else if (trust === SELF) {
      const selfActions = this.untrusted.filter(p => p.trust === SELF)
      return this.fastForward(this.state, selfActions)
    } else if (trust === PEER) {
      return this.fastForward(this.state, this.untrusted)
    }
  }

  private clean = () => {
    const now = Date.now()
    if (now - this.lastClean < this.cleanInterval) return
    this.lastClean = now
    const minTime = now - this.cleanInterval
    this.untrusted = this.untrusted.filter(p => p.time <= minTime)
    Object.keys(this.recentConfirmed).forEach(key => {
      const time = this.recentConfirmed[key]
      if (time < minTime) delete this.recentConfirmed[key]
    })
  }

  private fastForward = (state: any, actions: Action[]) => {
    actions.forEach(action => {
      state = this.reducer(state, action)
    })
    return state
  }
}
