/* global test, expect */

import { swissActionCreators as ac } from './action-creators'

test('set', () => {
  expect(ac.set('path.yay', 'value'))
    .toEqual({ type: 'SET', path: 'path.yay', value: 'value' })
})

test('delete', () => {
  expect(ac.delete('path.yay'))
    .toEqual({ type: 'DELETE', path: 'path.yay' })
})

test('add', () => {
  expect(ac.add('path', 'value'))
    .toEqual({ type: 'ADD', path: 'path', value: 'value' })
})

test('subtract', () => {
  expect(ac.subtract('path.yay', 15))
    .toEqual({ type: 'ADD', path: 'path.yay', value: -15 })
})

test('push', () => {
  expect(ac.push('path.yay', 'value'))
    .toEqual({ type: 'PUSH', path: 'path.yay', value: 'value' })
})

test('pop', () => {
  expect(ac.pop('path.yay'))
    .toEqual({ type: 'SPLICE', path: 'path.yay', start: -1, count: 1, items: [] })
})

test('shift', () => {
  expect(ac.shift('path.yay'))
    .toEqual({ type: 'SPLICE', path: 'path.yay', start: 0, count: 1, items: [] })
})

test('unshift', () => {
  expect(ac.unshift('path.yay', 'value'))
    .toEqual({ type: 'SPLICE', path: 'path.yay', start: 0, count: 0, items: ['value'] })
})

test('splice', () => {
  expect(ac.splice('path.yay', 4, 5, 'more', 'items'))
    .toEqual({ type: 'SPLICE', path: 'path.yay', start: 4, count: 5, items: ['more', 'items'] })
})
