import { Action } from 'jiber-core'
import { createClientDoc } from './client-doc'

const adder = (state: any = '', action: Action): any => {
  return state + action.value
}
const docReducer = createClientDoc(adder)

test('defaults to something', () => {
  const state = undefined
  const action = { type: 'test' }
  expect(docReducer(state, action)).toBeTruthy()
})

test('actions from the server update confirmed state', () => {
  const state = {
    confirmed: 'yay'
  }
  const action = {
    type: 'test',
    value: 'ok',
    $actionId: 1,
    $confirmed: true
  }
  expect(docReducer(state, action).confirmed).toBe('yayok')
})
