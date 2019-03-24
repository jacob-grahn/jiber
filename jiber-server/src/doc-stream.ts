import { SEND_TO_CONNECTION } from './constants'
import { default as EventEmitter } from 'events'
const emptyFunc = () => { /* do nothing */ }

export class DocStream extends EventEmitter {

  private members: string[] = []
  private history: string[] = []
  private maxHistory: number
  private reducer: Function
  public state: any = undefined

  constructor (reducer: Function = emptyFunc, maxHistory: number = 100) {
    super()
    this.reducer = reducer
    this.maxHistory = maxHistory
  }

  public join = (connectionId: string) => {
    const index = this.members.indexOf(connectionId)
    if (index === -1) {
      this.members.push(connectionId)
      this.sendHistoryToConnection(connectionId)
    }
  }

  public leave = (connectionId: string) => {
    const index = this.members.indexOf(connectionId)
    if (index !== -1) {
      this.members.splice(index, 1)
    }
  }

  public addAction = (action: any) => {
    const message = typeof action === 'string' ? action : JSON.stringify(action)
    this.history.push(message)
    this.sendToMembers(message)
    if (this.history.length > this.maxHistory) {
      this.history.shift()
    }
    this.state = this.reducer(this.state, action)
  }

  public sendToMember = (connectionId: string, message: string) => {
    const index = this.members.indexOf(connectionId)
    if (index !== -1) {
      this.emit(SEND_TO_CONNECTION, connectionId, message)
    }
  }

  public sendToMembers = (message: string) => {
    this.members.forEach((connectionId: string) => {
      this.emit(SEND_TO_CONNECTION, connectionId, message)
    })
  }

  private sendHistoryToConnection = (connectionId: string) => {
    this.history.forEach((message: string) => {
      this.emit(SEND_TO_CONNECTION, connectionId, message)
    })
  }
}
