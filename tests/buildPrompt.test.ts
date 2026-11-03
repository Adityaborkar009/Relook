import assert from 'node:assert/strict'
import test from 'node:test'
import { buildPrompt } from '../src/domain/buildPrompt.ts'
import type { GenerationRequest } from '../src/domain/generationRequest.ts'

const photo = (name: string) => new File(['image'], name, { type: 'image/jpeg' })
const request = (): GenerationRequest => ({
  photos: {
    Front: photo('private-front.jpg'),
    Back: photo('private-back.jpg'),
    Left: photo('private-left.jpg'),
    Right: photo('private-right.jpg'),
  },
  hairstyle: { kind: 'preset', id: 'pompadour' },
})

test('builds a four-view prompt without including photo names or bytes', () => {
  const prompt = buildPrompt(request())
  assert.match(prompt, /The Flow/)
  assert.match(prompt, /FRONT, BACK, LEFT, RIGHT/)
  assert.match(prompt, /Preserve my natural hair color/)
  assert.doesNotMatch(prompt, /private-front|image bytes/)
})

test('uses the custom description without preset instructions', () => {
  const input = request()
  input.hairstyle = { kind: 'custom', description: 'A layered bob with soft bangs and brown hair' }
  const prompt = buildPrompt(input)
  assert.match(prompt, /A layered bob with soft bangs/)
  assert.match(prompt, /brown hair/)
  assert.doesNotMatch(prompt, /The Flow/)
})

test('rejects an unknown preset even if called without request validation', () => {
  const input = request()
  input.hairstyle = { kind: 'preset', id: 'missing' }
  assert.throws(() => buildPrompt(input), /available hairstyle/)
})
