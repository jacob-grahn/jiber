import { logic as logicCreator } from './logic'
import { SELF } from '../constants'

test('pass along actions if doc has no logic', () => {
  let state: any = {}
  const action: any = { type: 'SET', path: 'row', value: 7 }
  const logicReducer = logicCreator()
  state = logicReducer(state, action)
  expect(state.row).toEqual(7)
})

test("if there is logic, throw out actions that don't use one of the logic types", () => {
  const logic = {
    OPEN_BOX: [
      ['SET', 'box', 'open']
    ]
  }
  let state: any = {}
  const action: any = { type: 'SET', path: 'row', value: 7, trust: SELF }
  const logicReducer = logicCreator(logic)
  state = logicReducer(state, action)
  expect(state.row).toEqual(undefined)
})

test('run logic and send out the resulting actions', () => {
  const logic = {
    OPEN_BOXES: [
      ['SET', 'box1', 'open'],
      ['SET', 'box2', 'open']
    ]
  }
  let state: any = {}
  const action: any = { type: 'OPEN_BOXES', trust: SELF }
  const logicReducer = logicCreator(logic)
  state = logicReducer(state, action)
  expect(action.$subActions[0].type).toEqual('SET')
  expect(action.$subActions[0].path).toEqual('box1')
  expect(action.$subActions[0].id).toEqual(action.id)
  expect(action.$subActions[1].type).toEqual('SET')
  expect(action.$subActions[1].path).toEqual('box2')
  expect(action.$subActions[1].id).toEqual(action.id)
})

test('make user account available as $self', () => {
  const logic = {
    OPEN_BOX: [
      ['SET', '$self.box', '"open"']
    ]
  }
  const user = { userId: 'abc' }
  let state: any = { _logic: logic, $users: { abc: user } }
  const action: any = { type: 'OPEN_BOX', user, trust: SELF }
  const logicReducer = logicCreator(logic)
  state = logicReducer(state, action)
  expect(state.$users.abc.box).toBe('open')
})
