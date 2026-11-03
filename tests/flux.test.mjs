import { test, mock } from 'node:test'
import { Client } from '@gradio/client'
import assert from 'node:assert/strict'
import { createApp } from '../server/index.mjs'
import { fluxPrompt } from '../server/flux.mjs'
const data = Buffer.from([137,80,78,71,13,10,26,10]).toString('base64')
const image = { mimeType: 'image/png', data }
const body = { provider: 'flux', apiKey: 'hf_testsecret', photos: Object.fromEntries(['Front','Back','Left','Right'].map(v => [v, image])), hairstyle: { kind: 'preset', id: 'short-side-part' }, preferences: { length: 'short', texture: 'wavy', color: 'natural' } }
async function request(fluxProvider, payload = body) {
  const server = createApp({ fluxProvider, provider: () => { throw Error('Must not call Gemini') } })
  await new Promise(r => server.listen(0, '127.0.0.1', r))
  const origin = `http://127.0.0.1:${server.address().port}`
  try {
    const response = await fetch(origin + '/api/generate', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    return { status: response.status, body: await response.json() }
  } finally { await new Promise(r => server.close(r)) }
}
test('FLUX receives validated front photo and returns preview without Gemini', async () => {
  const result = await request(async (draft, token) => {
    assert.equal(token, body.apiKey)
    assert.equal(draft.photos.Front.type, 'image/png')
    assert.match(fluxPrompt(draft), /Short Side Part/)
    assert.match(fluxPrompt(draft), /ONE front-facing/)
    return image
  })
  assert.deepEqual(result, { status: 200, body: image })
})
test('FLUX accepts empty token for anonymous public queue execution', async () => {
  const result = await request(async (draft, token) => {
    assert.equal(token, '')
    return image
  }, { ...body, apiKey: '' })
  assert.deepEqual(result, { status: 200, body: image })
})
test('FLUX routes specific angle request and returns view tag', async () => {
  for (const view of ['Left', 'Right', 'Back']) {
    const result = await request(async (draft, token, options) => {
      assert.equal(options?.view, view)
      assert.match(fluxPrompt(draft, view), new RegExp(view.toLowerCase()))
      return image
    }, { ...body, view })
    assert.deepEqual(result, { status: 200, body: { ...image, view } })
  }
})
test('FLUX quota and auth errors never echo secrets or inputs', async () => {
  for (const [message, status, pattern] of [['quota exceeded hf_testsecret',429,/quota/],['401 hf_testsecret',502,/authorize/],['unexpected hf_testsecret',502,/could not complete/]]) {
    const result = await request(async () => { throw Error(message) })
    assert.equal(result.status,status)
    assert.match(result.body.error,pattern)
    assert.doesNotMatch(JSON.stringify(result),/hf_testsecret/)
  }
})
test('rejects unsupported providers, invalid tokens and malformed output', async () => {
  const never = () => { assert.fail('Provider must not run') }
  assert.equal((await request(never, {...body, provider:'other'})).status,400)
  assert.equal((await request(never, {...body, apiKey:'bad'})).status,400)
  assert.equal((await request(async () => ({mimeType:'image/png',data:'aGVsbG8='}))).status,502)
})

const { generateFlux } = await import('../server/flux.mjs')
const draft = { ...body, photos: { Front: new File([Buffer.from(data,'base64')], 'front.png', {type:'image/png'}) } }
test('FLUX adapter submits front plus reference once and closes the client', async () => {
  let calls = 0, closed = false
  const output = await generateFlux(draft, body.apiKey, {
    connect: async (space, options) => {
      assert.equal(options.token, body.apiKey)
      assert.equal(space, 'black-forest-labs/FLUX.2-klein-4B')
      return { close: () => { closed = true }, predict: async (endpoint, args) => {
        calls++
        assert.equal(endpoint, '/infer')
        assert.equal(args.input_images.length, 2)
        assert.equal(args.num_inference_steps,4)
        return { data: [{url:'https://black-forest-labs-flux-2-klein-4b.hf.space/gradio_api/file=result.png'}] }
      } }
    },
    download: async (url, options) => {
      assert.equal(options.redirect,'error')
      return new Response(Buffer.from(data,'base64'),{headers:{'content-type':'image/png'}})
    },
  })
  assert.deepEqual(output,image)
  assert.equal(calls,1)
  assert.equal(closed,true)
})
test('FLUX rejects off-host download URLs and times out without retrying', async () => {
  let closed = false
  await assert.rejects(generateFlux(draft, body.apiKey, {
    connect: async () => ({close:()=>{closed=true}, predict: async () => ({data:[{url:'http://127.0.0.1/private'}]})}),
    download: () => {assert.fail('Must not fetch untrusted host')},
  }), /Unexpected output location/)
  assert.equal(closed,true)
  closed=false
  await assert.rejects(generateFlux(draft, body.apiKey, {
    connect: async () => ({close:()=>{closed=true},predict:()=>new Promise(()=>{})}), timeoutMs:20,
  }), /Timeout/)
  assert.equal(closed,true)
})

// Exercise the real static connect method: replacing it in tests hid its required `this` binding.
test('default connector preserves the Gradio Client class context', async () => {
  let initialized = false
  const init = mock.method(Client.prototype, 'init', async function () {
    initialized = true
    this.predict = async () => ({ data: [{ url: 'https://black-forest-labs-flux-2-klein-4b.hf.space/gradio_api/file=test.png' }] })
    this.close = () => {}
  })
  try {
    const result = await generateFlux(draft, body.apiKey, {
      download: async () => new Response(Buffer.from(data, 'base64'), { headers: { 'content-type': 'image/png' } }),
    })
    assert.equal(initialized, true)
    assert.deepEqual(result, image)
  } finally { init.mock.restore() }
})

test('each preset sends its own catalog image and style instructions without conflicting preferences', async () => {
  const { readFile } = await import('node:fs/promises')
  for (const [id, path, name] of [
    ['short-side-part','side-part-reference.png','Short Side Part'],
    ['pompadour','pompadour.jpg','The Flow'],
  ]) {
    const selected = { ...draft, hairstyle: {kind:'preset',id}, preferences:{length:'short',texture:'coily',color:'blonde'} }
    const expected = await readFile(new URL(`../public/hairstyles/${path}`, import.meta.url))
    await generateFlux(selected, body.apiKey, {
      connect: async () => ({close:()=>{}, predict:async (_, args) => {
        assert.equal(args.input_images.length,2)
        assert.deepEqual(Buffer.from(await args.input_images[1].image.arrayBuffer()),expected)
        assert.ok(args.prompt.includes(name))
        assert.doesNotMatch(args.prompt,/coily|blonde/)
        if (id === 'pompadour') {
          assert.match(args.prompt,/centre part/)
          assert.doesNotMatch(args.prompt,/side part|low taper/i)
        }
        return {data:[{url:'https://black-forest-labs-flux-2-klein-4b.hf.space/gradio_api/file=test.png'}]}
      }}), download:async()=>new Response(Buffer.from(data,'base64'),{headers:{'content-type':'image/png'}}),
    })
  }
})
test('custom hairstyle sends only the user photo with no preset instructions', async () => {
  await generateFlux({...draft,hairstyle:{kind:'custom',description:'A chin-length curly bob'}},body.apiKey,{
    connect:async()=>({close:()=>{},predict:async(_,args)=>{
      assert.equal(args.input_images.length,1)
      assert.match(args.prompt,/chin-length curly bob/)
      assert.doesNotMatch(args.prompt,/side part|low taper|Image 2/i)
      return {data:[{url:'https://black-forest-labs-flux-2-klein-4b.hf.space/gradio_api/file=test.png'}]}
    }}),download:async()=>new Response(Buffer.from(data,'base64'),{headers:{'content-type':'image/png'}}),
  })
})
