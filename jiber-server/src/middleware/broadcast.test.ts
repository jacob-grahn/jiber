import { broadcast } from './broadcast'
import { DocStream } from '../doc-stream'
import { Action } from '../action'
import { SEND_TO_CONNECTION } from '../constants'

test('send action to all doc subscribers', () => {
  const doc = new DocStream('test-doc')
  const sent: any[] = []
  doc.join('one')
  doc.join('two')
  doc.join('three')
  doc.on(SEND_TO_CONNECTION, (connectionId: string, message: string) => {
    sent.push([connectionId, message])
  })
  const server: any = {
    getDoc: (docId: string) => docId === 'fun' ? doc : undefined
  }
  const next = () => { /* do nothing */ }
  const action = new Action({ doc: 'fun' })
  const link = broadcast(server)(next)
  const expectedMessage = JSON.stringify(action)

  link(action)

  expect(sent.length).toBe(3)
  expect(sent[0]).toEqual(['one', expectedMessage])
  expect(sent[1]).toEqual(['two', expectedMessage])
  expect(sent[2]).toEqual(['three', expectedMessage])
})
