export interface Action {
  type: string,
  $doc?: string,  // doc id
  $uid?: string,  // user id
  $src?: string, // where the action came from
  $madeAt?: number,  // when this was created by a client, in ms
  $ranAt?: number, // when the server processed the event, in ms
  [key: string]: any
}
