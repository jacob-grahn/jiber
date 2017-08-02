import createServerRoom from './server-room'

const identity = (val: any) => val

test('server-room reducer should manage room state', () => {
  const serverRoom = createServerRoom(identity)
  expect(serverRoom(undefined, {type: 'something'})).toEqual({
    confirmed: undefined,
    lastUpdatedAt: 0,
    members: {}
  })
})
