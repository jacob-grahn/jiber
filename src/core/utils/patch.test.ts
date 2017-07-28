import patch from './patch'
import { SET, DEL } from '../constants/delta-types'
import DiffList from '../interfaces/diff-list'

test('loop through diffs and apply them', () => {
  const data = {color: 'blue'}
  const diffs: DiffList = [
    [SET, 'depth', 'deep'],
    [DEL, 'color', undefined]
  ]
  expect(patch(data, diffs)).toEqual({depth: 'deep'})
})
