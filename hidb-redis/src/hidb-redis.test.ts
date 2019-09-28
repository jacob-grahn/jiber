import { hidbRedis } from './hidb-redis'
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
  const middleware = hidbRedis(settings)(state)(next)

  const action = { type: 'OGRE', doc: 'hidb-redis-test' }
  middleware(action)
})
