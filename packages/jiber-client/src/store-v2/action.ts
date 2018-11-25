import { uuidv4 } from './uuidv4'

export interface ActionConfig {
  payload?: any,
  time?: number,
  trust?: number
  id?: string
}

export class Action {
  public id: string = uuidv4()
  public payload: any = undefined
  public time: number = 0
  public trust: number = 0

  constructor (config?: ActionConfig) {
    if (config) Object.assign(this, config)
  }
}
