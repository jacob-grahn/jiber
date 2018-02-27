import { CLOSE } from '../constants/action-types'
import { watchers } from './watchers'

test('add users to rooms', () => {
  const action = { type: 'test', $userId: 'sue', $user: { uid: 'sue', name: 'Sue' }, $docId: 'bees' }
  const state = watchers(undefined, action)
  expect(state).toEqual({
    bees: {
      sue: { uid: 'sue', name: 'Sue' }
    }
  })
})

test('remove users from rooms', () => {
  const action = { type: CLOSE, $userId: 'sue', $user: { uid: 'sue', name: 'Sue' }, $docId: 'bees' }
  const existingState = {
    bees: {
      sue: { uid: 'sue', name: 'Sue' }
    }
  }
  const state = watchers(existingState, action)
  expect(state).toEqual({
    bees: {}
  })
})
