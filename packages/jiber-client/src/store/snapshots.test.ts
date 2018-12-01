/* global test, expect */

import { Snapshots } from './snapshots'

test('retrieve most recent snapshot that is <= to <time>', () => {
  const snapshots = new Snapshots()
  snapshots.save('one', 1000)
  snapshots.save('two', 2000)
  snapshots.save('three', 3000)
  expect(snapshots.retrieve(2050)).toEqual({ state: 'two', time: 2000 })
  expect(snapshots.retrieve(3000)).toEqual({ state: 'three', time: 3000 })
  expect(snapshots.retrieve(4001)).toEqual({ state: 'three', time: 3000 })
  expect(snapshots.retrieve(-100)).toEqual({ state: undefined, time: 0 })
})

test('return undefined state if there are no snapshots', () => {
  const snapshots = new Snapshots()
  expect(snapshots.retrieve(2050).state).toBe(undefined)
})

test('prune old snapshots', () => {
  const snapshots = new Snapshots()
  snapshots.save('one', 1000)
  snapshots.save('two', 2000)
  snapshots.save('three', 3000)
  snapshots.prune(2999)
  expect(snapshots.retrieve(2999)).toEqual({ state: undefined, time: 0 })
  expect(snapshots.retrieve(3000)).toEqual({ state: 'three', time: 3000 })
})

test('retrieve time of most recent snapshot', () => {
  const snapshots = new Snapshots()
  snapshots.save('one', 1000)
  snapshots.save('two', 2000)
  expect(snapshots.mostRecent()).toBe(2000)
})
