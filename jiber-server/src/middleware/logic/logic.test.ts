import { logicMiddleware } from './logic'

test("set a user's logic", () => {
  const server: any = {}
  const next = () => { /* do nothing */ }
  const logic = {
    OPEN_BOX: [
      ['SET', 'box', 'open']
    ]
  }
  const action: any = { type: 'SET_LOGIC', logic, user: {} }
  logicMiddleware(server)(next)(action)
  expect(action.user._logic).toEqual(logic)
})

test('pass action along if doc is not specified', () => {
  const server: any = {}
  let nextAction: any
  const next = (a: any) => { nextAction = a }
  const action: any = { type: 'OOGLY' }
  logicMiddleware(server)(next)(action)
  expect(nextAction).toEqual(action)
})

test('set doc logic', () => {
  const doc: any = { state: {} }
  const server: any = { getDoc: () => doc }
  const next = () => { /* do nothing */ }
  const logic = { OPEN_BOX: [['SET', 'box', 'open']] }
  const user: any = { _logic: logic }
  const cheatLogic = { CLOSE_BOX: [['SET', 'box', 'closed']] }
  const cheatUser: any = { _logic: cheatLogic }

  // set doc's logic
  const docCreateAction: any = { type: 'OPEN', doc: 'bookstore', user }
  logicMiddleware(server)(next)(docCreateAction)

  // doc's logic can not be changed, cheating is prevented?
  const cheatDocCreateAction: any = { type: 'OPEN', doc: 'bookstore', user: cheatUser }
  logicMiddleware(server)(next)(cheatDocCreateAction)

  // assertions
  expect(doc.state._logic).toEqual(logic) // logic was not changed to cheatLogic
})

test('pass along actions if doc has no logic', () => {
  const doc: any = { state: {} }
  const server: any = { getDoc: () => doc }
  let passedAction: any
  const next = (a: any) => { passedAction = a }
  const action: any = { type: 'GARBAGE', doc: 'a-doc' }
  logicMiddleware(server)(next)(action)
  expect(passedAction).toEqual(action)
})

test("if there is logic, throw out actions that don't use one of the logic types", () => {
  const logic = {
    OPEN_BOX: [
      ['SET', 'box', 'open']
    ]
  }
  const doc: any = { state: { _logic: logic } }
  const server: any = { getDoc: () => doc }
  let passedAction: any
  const next = (a: any) => { passedAction = a }
  const action: any = { type: 'GARBAGE', doc: 'a-doc' }
  logicMiddleware(server)(next)(action)
  expect(passedAction).toEqual(undefined)
})

test('run logic and send out the resulting actions', () => {
  const logic = {
    OPEN_BOXES: [
      ['SET', 'box1', 'open'],
      ['SET', 'box2', 'open']
    ]
  }
  const doc: any = { state: { _logic: logic } }
  const server: any = { getDoc: () => doc }
  const passedActions: any[] = []
  const next = (a: any) => { passedActions.push(a) }
  const action: any = { type: 'OPEN_BOXES', doc: 'a-doc', id: 123 }
  logicMiddleware(server)(next)(action)
  expect(passedActions[0].type).toEqual('SET')
  expect(passedActions[0].path).toEqual('box1')
  expect(passedActions[0].id).toEqual(action.id)
  expect(passedActions[1].type).toEqual('SET')
  expect(passedActions[1].path).toEqual('box2')
  expect(passedActions[1].id).toEqual(action.id)
})
