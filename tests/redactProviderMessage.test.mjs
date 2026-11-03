import { test } from 'node:test'
import assert from 'node:assert/strict'
import { redactProviderMessage } from '../server/redactProviderMessage.mjs'

test('redacts literal and encoded credentials before bounding the diagnostic', () => {
  const key = 'fake-secret:key/value'
  const message = `Invalid parameter. ${key} ${encodeURIComponent(key)} ${'x'.repeat(1190)} ${key}`
  const result = redactProviderMessage(message, [key])
  assert.match(result, /Invalid parameter/)
  assert.ok(!result.includes(key))
  assert.ok(!result.includes(encodeURIComponent(key)))
  assert.ok(result.length <= 1200)
})

test('removes links, account identifiers, other key-like tokens and long data', () => {
  const result = redactProviderMessage('Bad image. projects/test-project user@example.com https://example.com/?key=secret AQ.fake_token AIzaFakeToken ' + 'A'.repeat(100))
  assert.match(result, /Bad image/)
  for (const value of ['test-project', 'user@example.com', 'key=secret', 'AQ.fake_token', 'AIzaFakeToken', 'A'.repeat(100)]) assert.ok(!result.includes(value))
})

test('omits absent and unusually long messages safely', () => {
  assert.equal(redactProviderMessage(undefined), undefined)
  assert.equal(redactProviderMessage(' '), undefined)
  assert.equal(redactProviderMessage('a'.repeat(17_000)), 'Google returned a long error message; details omitted.')
})
