interface Action { time: number }

export class History {

  private arr: Action[]

  constructor () {
    this.arr = []
  }

  save (action: Action) {
    this.arr.push(action)
  }

  from (time: number) {
    return this.arr.filter(action => action.time >= time)
  }
}
