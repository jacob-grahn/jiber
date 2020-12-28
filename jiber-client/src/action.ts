import { uuidv4 } from './uuidv4'

export interface ActionConfig {
  type?: string,
  time?: number,
  trust?: number
  id?: string,
  doc?: string,
  user?: any,
  [key: string]: any
}

export class Action {
  public id: string = uuidv4()
  public time: number = 0
  public trust: number = 0
  public doc: string = ''
  public type?: string = undefined
  public user?: any = undefined
  public peerId?: string = undefined
  public offer?: any = undefined
  public answer?: any = undefined
  public candidate?: any = undefined

  constructor (config?: ActionConfig) {
    if (config) Object.assign(this, config)
  }
}
