interface Socket {
  send: (str: string) => void,
  readyState: number
}

export default Socket
