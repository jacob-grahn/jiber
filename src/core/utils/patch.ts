import DiffList from '../interfaces/diff-list'
import del from './del'
import set from './set'
import { SET, DEL } from '../constants/delta-types'

export default function patch (data: any, diffs: DiffList) {
  return diffs.reduce((data, [type, path, value]) => {
    if (type === DEL) return del(data, path)
    if (type === SET) return set(data, path, value)
  }, data)
}
