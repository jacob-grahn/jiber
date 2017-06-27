import { SourceType } from '../constants/source-types'
import Action from './action'

interface HopeAction extends Action {
  $hope: {
    roomId: string,
    userId: string,
    actionId: number,
    source: SourceType,
    timeMs: number
  }
}

export default HopeAction
