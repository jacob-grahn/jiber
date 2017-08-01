interface Action {
  type: string,
  $roomId?: string,
  $userId?: string,
  $actionId?: number,
  $timeMs?: number,
  [key: string]: any
}

export default Action
