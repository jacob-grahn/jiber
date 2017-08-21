export interface Action {
  type: string,
  $roomId?: string,
  $userId?: string,
  $actionId?: number,
  $timeMs?: number,
  $source?: string
  [key: string]: any
}
