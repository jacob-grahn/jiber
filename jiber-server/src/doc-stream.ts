import { SEND_TO_CONNECTION } from './constants'
import { default as EventEmitter } from 'events'

export class DocStream extends EventEmitter {

  private members: string[] = []
  private history: string[] = []
  private maxHistory: number

  constructor (maxHistory: number = 100) {
    super()
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

  public addMessage = (message: string) => {
    this.history.push(message)
    this.sendToMembers(message)
    if (this.history.length > this.maxHistory) {
      this.history.shift()
    }
  }

  public sendToMember = (connectionId: string, message: string) => {
    const index = this.members.indexOf(connectionId)
    if (index !== -1) {
      this.emit(SEND_TO_CONNECTION, connectionId, message)
    }
  }

  private sendToMembers = (message: string) => {
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
