import { SourceType } from '../../core/index'

export interface HopeMeta {
  roomId: string,
  userId: string,
  actionId: number,
  source: SourceType,
  timeMs: number,
  type?: string
}

interface HopeAction {
  $hope: HopeMeta,
  type: string,
  [key: string]: any
}

export default HopeAction
