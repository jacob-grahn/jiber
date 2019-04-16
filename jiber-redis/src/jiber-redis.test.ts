import { jiberRedis } from './jiber-redis'
import { closeAllConnections } from './get-connection'

afterEach(() => {
  closeAllConnections()
})

test('pump messages through redis', (done) => {
  const settings = {}
  const state = undefined
  const next = (action: any) => {
    expect(action.type).toBe('OGRE')
    expect(action.time).toBeTruthy()
    done()
  }
  const middleware = jiberRedis(settings)(state)(next)

  const action = { type: 'OGRE', doc: 'jiber-redis-test' }
  middleware(action)
})
