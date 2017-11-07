import { User } from './user'

export interface Action {
  type: string,
  $r?: string,  // roomId
  $u?: string,  // userId
  $user?: User, // full user object
  $source?: string, // where the action came from
  $id?: number, // actionId
  $t?: number,  // time, in ms
  $confirmed?: boolean  // confirmed
  [key: string]: any
}
