import { History } from './history'
import { Snapshots } from './snapshots'
import { Action } from './action'

export class TimeyWimey {

  private history: History
  private snapshots: Snapshots

  constructor () {
    this.history = new History()
    this.snapshots = new Snapshots()
  }

  addAction (action: Action) {
    this.history.add(action)
    const snapshot = this.snapshots.retrieve(action.time)
    const actions = this.history.from(snapshot.time + 0.1)
    if (actions.length === 0) actions.push(action)
    return { state: snapshot.state, actions }
  }

  addSnapshot (state: any, time: number): void {
    this.snapshots.save(state, time)
    this.snapshots.prune(time - 5000)
  }
}
