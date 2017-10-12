import { addActionId } from './add-action-id'
import { Action } from 'jiber-core'

let lastAction: Action
const next = (action: Action) => lastAction = action
const inner = addActionId()(next)

test('actionId is added to the metadata', () => {
  const action: Action = {type: 'test', $r: 'testRoom'}
  inner(action)
  expect(lastAction.$id).toBeGreaterThan(0)
})
