import { DiffList, del, set } from '../../core/index'

const DEL = 'DEL'
const SET = 'SET'

export default function patch (data: any, diffs: DiffList) {
  return diffs.reduce((data, [type, path, value]) => {
    if (type === DEL) {
      del(data, path)
    }
    if (type === SET) {
      set(data, path, value)
    }
  }, data)
}
