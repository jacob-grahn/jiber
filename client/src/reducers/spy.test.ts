import { Action } from '../../../core/index'
import spy from './spy'

const adder = (state: any = '', action: Action): any => {
  return state + action.value
}

test('callback with state as it updates', () => {
  let state
  const onUpdate = (newState: any) => state = newState
  const reducer = spy(adder, onUpdate)
  reducer('abc', {type: 'add', value: 'def'})
  expect(state).toBe('abcdef')
})
