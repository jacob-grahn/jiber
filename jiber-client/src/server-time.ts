export class ServerTime {

  private serverTime: number = 0
  private averageOffset: number = 0
  private smoothing: number = 0.1 // 1 = no smothing, 0 = no movement

  setTime (ms: number): void {
    const localTime = Date.now()
    const offset = ms - localTime
    if (this.serverTime) {
      this.averageOffset += (offset - this.averageOffset) * this.smoothing
    } else {
      this.averageOffset = offset
    }
    this.serverTime = ms
  }

  getTime (): Number {
    return Date.now() + this.averageOffset
  }
}
