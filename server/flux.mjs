import { Client, handle_file } from '@gradio/client'
import { hairstyleReference } from './hairstyleReference.mjs'
import { hairstyleInstruction } from '../src/domain/buildPrompt.ts'

const SPACE = 'black-forest-labs/FLUX.2-klein-4B'
const OUTPUT_HOST = 'black-forest-labs-flux-2-klein-4b.hf.space'
const MAX_OUTPUT = 16 * 1024 * 1024

export function fluxPrompt(draft, view = 'Front') {
  const viewPrompts = {
    Front: `Edit image 1 only. Create ONE front-facing hairstyle photograph, not a collage. ${draft.hairstyle.kind === 'preset' ? 'Image 2 is the selected hairstyle reference. Match its haircut using the front view as the primary target.' : ''} ${hairstyleInstruction(draft)} EXACT IDENTITY & EXPRESSION LOCK: Keep image 1's exact smiling expression, exact lip contour, exact mouth curve, exact eye shape, eyelids, gaze direction, nose bridge, cheek fullness, natural skin pores, and exact beard and mustache. Do not flatten the smile into a neutral expression. Retain 100% of image 1's face below the forehead. Change strictly scalp hair. No beautification or skin smoothing.`,
    Back: `Edit image 1 only. Create ONE back-of-head hairstyle photograph, not a collage. ${draft.hairstyle.kind === 'preset' ? 'Image 2 is the selected hairstyle reference. Match its haircut using the back view as the target: clean low taper at the neckline, natural hair coverage, neat shape.' : ''} ${hairstyleInstruction(draft)} EXACT GEOMETRY LOCK: Preserve image 1 ears, neck width, head position, collar, clothing, lighting, background and framing. Change strictly scalp hair.`,
    Left: `Edit image 1 only. Create ONE left profile hairstyle photograph, not a collage. ${draft.hairstyle.kind === 'preset' ? 'Image 2 is the selected hairstyle reference. Match its haircut using the left side view as the target: gentle low taper above and around the ear.' : ''} ${hairstyleInstruction(draft)} EXACT PROFILE LOCK: Preserve image 1 face, eye socket, nose profile, cheek, ear shape, jawline, beard texture, neck, head position, clothing, lighting, background and framing. Change strictly scalp hair. No beautification or face changes.`,
    Right: `Edit image 1 only. Create ONE right profile hairstyle photograph, not a collage. ${draft.hairstyle.kind === 'preset' ? 'Image 2 is the selected hairstyle reference. Match its haircut using the right side view as the target: gentle low taper above and around the ear.' : ''} ${hairstyleInstruction(draft)} EXACT PROFILE LOCK: Preserve image 1 face, eye socket, nose profile, cheek, ear shape, jawline, beard texture, neck, head position, clothing, lighting, background and framing. Change only scalp hair. No beautification or face changes.`,
  }
  return viewPrompts[view] || viewPrompts.Front
}

export async function generateFlux(draft, token, { connect = (...args) => Client.connect(...args), download = fetch, timeoutMs = 240_000, view = 'Front' } = {}) {
  let client
  let expired = false
  let timer
  const work = async () => {
    client = await connect(SPACE, { token })
    if (expired) { client.close(); throw new Error('Timeout') }
    const targetPhoto = draft.photos[view] || draft.photos.Front
    const input_images = [{ image: handle_file(targetPhoto), caption: 'Original user portrait: preserve exact face, smile, eyes, nose, mouth, beard, expression and lighting' }]
    const reference = await hairstyleReference(draft.hairstyle, view)
    if (reference) {
      input_images.push({ image: handle_file(new Blob([reference.bytes], { type: reference.mimeType })), caption: 'Hairstyle reference: scalp hair, fade, and fringe shape only' })
    }
    const result = await client.predict('/infer', {
      prompt: fluxPrompt(draft, view), input_images, mode_choice: 'Distilled (4 steps)',
      seed: 42, randomize_seed: false, width: 768, height: 1024,
      num_inference_steps: 4, guidance_scale: 1, prompt_upsampling: false,
    })
    if (expired) throw new Error('Timeout')
    const url = new URL(result.data?.[0]?.url)
    if (url.protocol !== 'https:' || url.hostname !== OUTPUT_HOST || url.port || url.username || url.password) throw new Error('Unexpected output location')
    const response = await download(url, { redirect: 'error', signal: AbortSignal.timeout(30_000) })
    if (!response.ok || !response.body) throw new Error('Image download failed')
    const mimeType = response.headers.get('content-type')?.split(';')[0]
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(mimeType)) throw new Error('Unexpected image type')
    const chunks = []
    let size = 0
    for await (const chunk of response.body) {
      size += chunk.length
      if (expired || size > MAX_OUTPUT) throw new Error('Output limit exceeded')
      chunks.push(chunk)
    }
    return { mimeType, data: Buffer.concat(chunks).toString('base64') }
  }
  try {
    return await Promise.race([work(), new Promise((_, reject) => {
      timer = setTimeout(() => { expired = true; reject(new Error('Timeout')) }, timeoutMs)
    })])
  } finally {
    clearTimeout(timer)
    client?.close()
  }
}
