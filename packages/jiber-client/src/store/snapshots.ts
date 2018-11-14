interface Snapshot {state: any, time: number}

export class Snapshots {

  history: Snapshot[]

  constructor () {
    this.history = []
  }

  save (state: any, time: number) {
    this.history.push({state, time})
  }

  prune (time: number) {
    this.history = this.history.filter(obj => obj.time > time)
  }

  mostRecent (): number {
    if (this.history.length === 0) return 0
    return this.history[this.history.length - 1].time
  }

  retrieve (time: number): Snapshot | undefined {
    let mostRecent: Snapshot | undefined
    this.history.forEach(obj => {
      if (obj.time <= time) mostRecent = obj
    })
    return mostRecent
  }
}
