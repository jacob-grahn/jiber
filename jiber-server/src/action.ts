import { v4 as uuidv4 } from 'uuid'

export interface ActionConfig {
  time?: number,
  trust?: number
  id?: string,
  doc?: string,
  type?: string,
  user?: any,
  conn?: any,
  [key: string]: any
}

export class Action {
  public id: string = uuidv4()
  public time: number = 0
  public trust: number = 0
  public doc: string = 'default'
  public type?: string = undefined
  public user: any = undefined
  public conn: string = 'default'
  public peerId?: string = undefined
  public offer?: any = undefined
  public answer?: any = undefined
  public candidate?: any = undefined

  constructor (config?: ActionConfig) {
    if (config) Object.assign(this, config)
  }
}
