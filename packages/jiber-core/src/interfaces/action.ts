import { User } from './user'

export interface Action {
  type: string,
  $roomId?: string,
  $user?: User,
  $actionId?: number,
  $timeMs?: number,
  $confirmed?: boolean
  [key: string]: any
}
