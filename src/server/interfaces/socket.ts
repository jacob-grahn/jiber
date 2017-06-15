export interface Socket {
  send: (str: string) => void,
  readyState: number
}
