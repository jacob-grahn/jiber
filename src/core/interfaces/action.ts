interface Action {
  type: string,
  $hope?: {
    roomId?: string,
    userId?: string,
    actionId?: number,
    source?: string,
    timeMs?: number
  }
  [key: string]: any
}

export default Action
