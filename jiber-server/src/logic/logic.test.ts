import { logic as logicReducer } from './logic'

test("set a user's logic", () => {
  const logic = {
    OPEN_BOX: [
      ['SET', 'box', 'open']
    ]
  }
  const logicMd5 = '86553009d1742bed9fcfdb557dfebb36'
  const state = {}
  const action: any = { type: 'SET_LOGIC', logic, user: {} }
  logicReducer(state, action)
  expect(action.user._logic).toBe(logicMd5)
})

test('set doc logic', () => {
  let state: any = {}
  const logic = { OPEN_BOX: [['SET', 'box', 'open']] }
  const user: any = { userId: 123 }
  const cheatLogic = { CLOSE_BOX: [['SET', 'box', 'closed']] }
  const cheatUser: any = { _logic: 'cheatLogic', userId: 456 }

  // set user's logic
  const uAction: any = { type: 'SET_LOGIC', logic, user }
  state = logicReducer(state, uAction)

  // set cheat user's logic
  const cAction: any = { type: 'SET_LOGIC', logic: cheatLogic, user: cheatUser }
  state = logicReducer(state, cAction)

  // set doc's logic
  const docCreateAction: any = { type: 'OPEN', doc: 'bookstore', user }
  state = logicReducer(state, docCreateAction)

  // doc's logic can not be changed, cheating is prevented?
  const cheatDocCreateAction: any = { type: 'OPEN', doc: 'bookstore', user: cheatUser }
  state = logicReducer(state, cheatDocCreateAction)

  // assertions
  expect(state._logic).toEqual(logic) // logic was not changed to cheatLogic
})

test('pass along actions if doc has no logic', () => {
  let state: any = {}
  const action: any = { type: 'SET', path: 'row', value: 7 }
  state = logicReducer(state, action)
  expect(state.row).toEqual(7)
})

test("if there is logic, throw out actions that don't use one of the logic types", () => {
  let state: any = {
    _logic: {
      OPEN_BOX: [
        ['SET', 'box', 'open']
      ]
    }
  }
  const action: any = { type: 'SET', path: 'row', value: 7 }
  state = logicReducer(state, action)
  expect(state.row).toEqual(undefined)
})

test('run logic and send out the resulting actions', () => {
  let state: any = {
    _logic: {
      OPEN_BOXES: [
        ['SET', 'box1', 'open'],
        ['SET', 'box2', 'open']
      ]
    }
  }
  const action: any = { type: 'OPEN_BOXES' }
  state = logicReducer(state, action)
  expect(action.$subActions[0].type).toEqual('SET')
  expect(action.$subActions[0].path).toEqual('box1')
  expect(action.$subActions[0].id).toEqual(action.id)
  expect(action.$subActions[1].type).toEqual('SET')
  expect(action.$subActions[1].path).toEqual('box2')
  expect(action.$subActions[1].id).toEqual(action.id)
})

test('make user account available as $self', () => {
  let state: any = {
    _logic: {
      OPEN_BOX: [
        ['SET', '$self.box', '"open"']
      ]
    },
    $users: {
      abc: {}
    }
  }
  const user = { userId: 'abc' }
  const action: any = { type: 'OPEN_BOX', user }
  state = logicReducer(state, action)
  expect(state.$users.abc.box).toBe('open')
})
