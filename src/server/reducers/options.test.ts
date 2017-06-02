import options, { setOptions } from './options'

test('it should default to some nice values', () => {
  const opts = options(undefined, setOptions({}))
  expect(opts.webSocketPort).toBe(80)
})

test('it should take custom values', () => {
  const customOpts = {
    webSocketPort: 159,
    storage: 'this should be a function, but oh well'
  }
  const opts = options(undefined, setOptions(customOpts))
  expect(opts.webSocketPort).toBe(159)
  expect(opts.storage).toBe('this should be a function, but oh well')
})
