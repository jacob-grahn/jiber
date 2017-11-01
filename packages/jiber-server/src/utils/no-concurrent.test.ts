import { noConcurrent } from './no-concurrent'

test('pass params on to inner function', async () => {
  let params: any = {}
  const func = (name: string, age: number) => {
    params.name = name
    params.age = age
    return Promise.resolve()
  }
  const ncFunc = noConcurrent(func)
  await ncFunc('sue', 100)
  expect(params).toEqual({ name: 'sue', age: 100 })
})

test('calls while the function is working should run later', async () => {
  let callCount = 0
  let resolve = () => { /* do nothing */ }
  const promise = new Promise((_resolve) => { resolve = _resolve })
  const func = () => {
    callCount++
    return promise
  }
  const ncFunc = noConcurrent(func)

  expect(callCount).toBe(0)

  /* tslint:disable */
  ncFunc()
  ncFunc()
  ncFunc()
  /* tslint:enable */
  expect(callCount).toBe(1)

  resolve()
  await new Promise(resolve => setTimeout(resolve, 1))                          // need to wait a tiny bit for the promise to resolve
  expect(callCount).toBe(2)
})

test('different params can run concurrently', () => {
  let names: string[] = []
  const func = (name: string) => {
    names.push(name)
    return new Promise(resolve => setTimeout(resolve, 1000))
  }
  const ncFunc = noConcurrent(func)
  /* tslint:disable */
  ncFunc('sue')
  ncFunc('bob')
  /* tslint:enable */
  expect(names).toEqual(['sue', 'bob'])
})

test('deferred calls should be called with the same params', async () => {
  let calledWith = ''
  let resolve = () => { /* do nothing */ }
  const promise = new Promise((_resolve) => { resolve = _resolve })
  const func = (param1: string, param2: string) => {
    calledWith += param1 + param2
    return promise
  }
  const ncFunc = noConcurrent(func)

  /* tslint:disable */
  ncFunc('some', 'params')
  ncFunc('some', 'params')
  /* tslint:enable */
  expect(calledWith).toBe('someparams')

  resolve()
  await new Promise(resolve => setTimeout(resolve, 1))                          // need to wait a tiny bit for the promise to resolve
  expect(calledWith).toBe('someparamssomeparams')
})
