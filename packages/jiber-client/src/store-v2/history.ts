import { Action } from './action'

export class History {

  private arr: Action[] = []
  private dict: { [key: string]: Action } = {}

  add (action: Action) {
    if (this.dict[action.id]) {
      if ((this.dict[action.id].trust) < (action.trust)) {
        Object.assign(this.dict[action.id], action)
      }
    }
    else {
      this.dict[action.id] = action
      this.arr.push(action)
    }
    this.arr.sort((a, b) => a.time - b.time)
  }

  from (time: number) {
    return this.arr.filter(action => action.time >= time)
  }
}
