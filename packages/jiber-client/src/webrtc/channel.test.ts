import { createChannel } from './channel'

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
let calls: any[]

const pc: any = {
  createDataChannel: (name: any, config: any) => {
    calls.push(['createDataChannel', name, config])
    return {
      send: (str: string) => calls.push(['send', str])
    }
  }
}

beforeEach(() => calls = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('set up channel if isInitiator', () => {
  createChannel(pc, true)
  expect(calls).toEqual([
    ['createDataChannel', 'data', { ordered: false, maxRetransmits: 0 }]
  ])
})

test('wait for channel if not isInitiator', () => {
  const channel = createChannel(pc, false)
  pc.ondatachannel({
    channel: {
      send: (str: string) => calls.push(['send', str]),
      readyState: 'open'
    }
  })
  channel.send({ type: 'hello' })
  expect(calls).toEqual([
    ['send', '{"type":"hello"}']
  ])
})
