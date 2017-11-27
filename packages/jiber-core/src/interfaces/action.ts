import { User } from './user'

export interface Action {
  type: string,
  $roomId?: string,  // roomId
  $userId?: string,  // userId
  $user?: User, // full user object
  $source?: string, // where the action came from
  $actionId?: number, // actionId
  $timeMs?: number,  // time, in ms
  $confirmed?: boolean  // confirmed
  [key: string]: any
}
