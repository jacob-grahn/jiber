import { createToughSocket } from './tough-socket'

const settings: any = {
  url: 'testurl',
  socketPort: 123,
  credential: '',
  backoffMs: 1
}

it('socket should be a thing', () => {
  const socket = createToughSocket(settings)
  expect(socket).toBeTruthy()
})
