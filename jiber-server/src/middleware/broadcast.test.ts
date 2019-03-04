import { broadcast } from './broadcast'
import { DocStream } from '../doc-stream'
import { Packet } from '../packet'
import { SEND_TO_CONNECTION } from '../constants'

test('send packet to all doc subscribers', () => {
  const doc = new DocStream()
  const sent: any[] = []
  doc.join('one')
  doc.join('two')
  doc.join('three')
  doc.on(SEND_TO_CONNECTION, (connectionId: string, message: string) => {
    sent.push([connectionId, message])
  })
  const server: any = {
    docs: {
      fun: doc
    }
  }
  const next = () => { /* do nothing */ }
  const packet = new Packet({ payload: '123', doc: 'fun' })
  const link = broadcast(server)(next)
  const expectedMessage = JSON.stringify(packet)

  link(packet)

  expect(sent.length).toBe(3)
  expect(sent[0]).toEqual(['one', expectedMessage])
  expect(sent[1]).toEqual(['two', expectedMessage])
  expect(sent[2]).toEqual(['three', expectedMessage])
})
