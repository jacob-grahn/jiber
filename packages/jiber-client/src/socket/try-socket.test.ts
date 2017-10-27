import { createTrySocket } from './try-socket'

const settings: any = {
  url: 'testurl',
  socketPort: 123,
  credential: '',
  backoffMs: 1
}

it('socket should be a thing', () => {
  const socket = createTrySocket(settings)
  expect(socket).toBeTruthy()
})
