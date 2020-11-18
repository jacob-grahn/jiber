import { SEND_TO_CONNECTION, SERVER } from './constants'
import { default as EventEmitter } from 'events'
import { Action } from './action'
const emptyFunc = () => { /* do nothing */ }

export class DocStream extends EventEmitter {

  private members: string[] = []
  private reducer: Function
  private docId: string
  public state: any = {}

  constructor (docId: string = 'default', reducer: Function = emptyFunc) {
    super()
    this.docId = docId
    this.reducer = reducer
  }

  public join = (connectionId: string) => {
    const index = this.members.indexOf(connectionId)
    if (index === -1) {
      this.members.push(connectionId)
      const welcome = new Action({
        doc: this.docId,
        trust: SERVER,
        type: 'SET',
        path: '',
        value: this.state
      })
      this.sendToMember(connectionId, JSON.stringify(welcome))
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
    if (!action.$doNotSend) {
      if (action.$sendOnlyTo) {
        this.sendToMember(action.$sendOnlyTo, message)
      } else {
        this.sendToMembers(message)
      }
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

  public sendToOtherMembers = (omitConnectionId: string, message: string) => {
    this.members.forEach((connectionId: string) => {
      if (connectionId !== omitConnectionId) {
        this.emit(SEND_TO_CONNECTION, connectionId, message)
      }
    })
  }
}
