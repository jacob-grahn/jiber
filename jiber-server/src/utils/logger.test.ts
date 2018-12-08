import * as sinon from 'sinon'
import { logger } from './logger'

let log: sinon.SinonSpy

beforeEach(() => {
  log = sinon.stub(console, 'log')
})

afterEach(() => {
  log.restore()
})

test('default', () => {
  process.env.JIBER_LOG_LEVEL = ''
  logger.error('ow my finger')
  expect(log.getCall(0).args[1]).toEqual('ow my finger')
})

test('debug', () => {
  process.env.JIBER_LOG_LEVEL = 'DEBUG'
  logger.debug('test', 'debug')
  expect(log.getCall(0).args).toEqual(['DEBUG', 'test', 'debug'])
})

test('info', () => {
  process.env.JIBER_LOG_LEVEL = 'INFO'
  logger.debug('test', 'debug')
  expect(log.callCount).toBe(0)
  logger.info('a test')
  expect(log.getCall(0).args[1]).toBe('a test')
})

test('warning', () => {
  process.env.JIBER_LOG_LEVEL = 'WARNING'
  logger.warning('woah')
  expect(log.getCall(0).args[1]).toBe('woah')
})

test('error', () => {
  process.env.JIBER_LOG_LEVEL = 'ERROR'
  logger.debug('test', 'debug')
  logger.info('a test')
  logger.warning('woah')
  logger.error('arrg')
  expect(log.getCall(0).args[1]).toBe('arrg')
})
