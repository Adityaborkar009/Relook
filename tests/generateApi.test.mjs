import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createApp } from '../server/index.mjs'
import { hairstyles } from '../src/data/hairstyles.ts'
import { createServer as createVite } from 'vite'
import viteConfig from '../vite.config.ts'

const png = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0]).toString('base64')
const jpeg = Buffer.from([255, 216, 255, 217]).toString('base64')
const photo = { mimeType: 'image/png', data: png }
const payload = {
  apiKey: 'private-test-key',
  photos: { Front: photo, Back: photo, Left: photo, Right: photo },
  hairstyle: { kind: 'preset', id: hairstyles[0].id },
  preferences: { length: 'short', texture: 'wavy', color: 'natural' },
}

async function withServer(provider, action) {
  const server = createApp({ provider })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const origin = `http://127.0.0.1:${server.address().port}`
  try { await action(origin) } finally { await new Promise(resolve => server.close(resolve)) }
}

const send = (origin, body, headers = {}) => fetch(`${origin}/api/generate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Origin: origin, ...headers },
  body: JSON.stringify(body),
})

test('sends four ordered reference images with a stateless request and transient key', async () => {
  let called = false
  await withServer(async (url, options) => {
    called = true
    assert.equal(url, 'https://generativelanguage.googleapis.com/v1beta/interactions')
    assert.equal(options.headers['x-goog-api-key'], payload.apiKey)
    const request = JSON.parse(options.body)
    assert.equal(request.store, false)
    assert.equal(request.model, 'gemini-3.1-flash-image')
    // Regression: requesting PNG output is invalid in ImageResponseFormat,
    // even though the same API supports PNG reference inputs.
    assert.equal(request.response_format.mime_type, 'image/jpeg')
    // Google's live endpoint rejects an explicit image delivery mode.
    assert.equal(Object.hasOwn(request.response_format, 'delivery'), false)
    const images = request.input.filter(item => item.type === 'image')
    assert.deepEqual(images.slice(0, 4).map(item => item.data), [png, png, png, png])
    assert.equal(images.length, 5)
    assert.equal(images[4].mime_type, 'image/png')
    assert.notEqual(images[4].data, png)
    assert.match(request.input.at(-1).text, /FRONT, BACK, LEFT, RIGHT/)
    return { ok: true, json: async () => ({ steps: [{ type: 'model_output', content: [{ type: 'image', mime_type: 'image/jpeg', data: jpeg }] }] }) }
  }, async origin => {
    const response = await send(origin, payload)
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('cache-control'), 'no-store')
    assert.deepEqual(await response.json(), { mimeType: 'image/jpeg', data: jpeg })
  })
  assert.equal(called, true)
})

test('rejects incomplete, forged, and cross-origin requests before calling provider', async () => {
  await withServer(() => { throw Error('Provider must not be called') }, async origin => {
    const missing = await send(origin, { ...payload, photos: { Front: photo, Back: photo, Left: photo } })
    assert.equal(missing.status, 400)
    assert.match((await missing.json()).error, /right photo/)
    const forged = await send(origin, { ...payload, photos: { ...payload.photos, Front: { ...photo, data: Buffer.from('not a photo').toString('base64') } } })
    assert.equal(forged.status, 400)
    const crossOrigin = await send(origin, payload, { Origin: 'https://elsewhere.example' })
    assert.equal(crossOrigin.status, 403)
  })
})

test('redacts provider failure details and rejects responses without an image', async () => {
  await withServer(async () => ({ ok: false, status: 403, json: async () => ({ error: { code: 'permission_denied', message: `Secret: ${payload.apiKey}` } }) }), async origin => {
    const response = await send(origin, payload)
    assert.equal(response.status, 502)
    const body = await response.json()
    assert.equal(body.providerStatus, 403)
    assert.equal(body.providerCode, 'permission_denied')
    assert.doesNotMatch(JSON.stringify(body), /private-test-key/)
  })
  await withServer(async () => ({ ok: true, json: async () => ({ steps: [{ type: 'model_output', content: [{ type: 'text', text: 'No image' }] }] }) }), async origin => {
    const response = await send(origin, payload)
    assert.equal(response.status, 502)
    assert.match((await response.json()).error, /did not return an image/)
  })
})

test('distinguishes a missing billing prerequisite from an invalid request', async () => {
  for (const [code, expected] of [['failed_precondition', /paid API access/], ['invalid_request', /could not accept/]]) {
    await withServer(async () => ({ ok: false, status: 400, json: async () => ({ error: { code, message: `Do not echo ${payload.apiKey}` } }) }), async origin => {
      const response = await send(origin, payload)
      const body = await response.json()
      assert.equal(response.status, 502)
      assert.equal(body.providerStatus, 400)
      assert.equal(body.providerCode, code)
      assert.match(body.error, expected)
      assert.equal(body.providerDetail, 'Do not echo [redacted]')
      assert.doesNotMatch(JSON.stringify(body), /private-test-key/)
    })
  }
})

test('preserves the actionable provider reason without key, photo, or custom text', async () => {
  const description = 'Private hairstyle description'
  const body = { ...payload, hairstyle: { kind: 'custom', description } }
  await withServer(async () => ({ ok: false, status: 400, json: async () => ({ error: {
    code: 'invalid_request',
    message: `Image generation is not supported for this project. Key: ${payload.apiKey}; photo: ${png}; prompt: ${description}`,
  } }) }), async origin => {
    const result = await (await send(origin, body)).json()
    assert.match(result.providerDetail, /Image generation is not supported for this project/)
    assert.ok(!JSON.stringify(result).includes(payload.apiKey))
    assert.ok(!JSON.stringify(result).includes(png))
    assert.ok(!JSON.stringify(result).includes(description))
  })
})

test('understands Google gateway error arrays and non-JSON failures', async () => {
  await withServer(async () => ({ ok: false, status: 403, json: async () => [{ error: { code: 403, status: 'PERMISSION_DENIED', message: 'Unregistered caller.' } }] }), async origin => {
    const result = await (await send(origin, payload)).json()
    assert.equal(result.providerCode, 'permission_denied')
    assert.equal(result.providerDetail, 'Unregistered caller.')
  })
  await withServer(async () => ({ ok: false, status: 503, json: async () => { throw new SyntaxError('HTML response') } }), async origin => {
    const response = await send(origin, payload)
    assert.equal(response.status, 502)
    assert.equal((await response.json()).providerStatus, 503)
  })
})

test('Vite forwards the browser host for same-origin generation requests', async () => {
  await withServer(() => { throw Error('Provider must not be called') }, async apiOrigin => {
    const vite = await createVite({
      ...viteConfig,
      configFile: false,
      server: { ...viteConfig.server, port: 0, proxy: { '/api': { ...viteConfig.server.proxy['/api'], target: apiOrigin } } },
    })
    try {
      await vite.listen()
      const origin = `http://localhost:${vite.httpServer.address().port}`
      const response = await send(origin, {})
      assert.equal(response.status, 400)
      assert.match((await response.json()).error, /API key/)
      assert.equal((await send(origin, {}, { Origin: 'https://elsewhere.example' })).status, 403)
    } finally { await vite.close() }
  })
})
