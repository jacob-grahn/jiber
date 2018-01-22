import { User } from './user'

export interface Action {
  type: string,
  $doc?: string, // doc id
  $user?: User, // user account
  $src?: string, // where the action came from
  $madeAt?: number, // when this was created by a client, in ms
  $ranAt?: number, // when the server processed the event, in ms
  [key: string]: any
}
