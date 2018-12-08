import { uuidv4 } from './uuidv4'

export interface PacketConfig {
  payload?: any,
  time?: number,
  trust?: number
  id?: string
}

export class Packet {
  public id: string = uuidv4()
  public payload: any = undefined
  public time: number = 0
  public trust: number = 0

  constructor (config?: PacketConfig) {
    if (config) Object.assign(this, config)
  }
}
