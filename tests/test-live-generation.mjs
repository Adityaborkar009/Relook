import { Client, handle_file } from '@gradio/client'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Standalone live generation test for Relook using Hugging Face FLUX Klein 4B.
 * Usage:
 *   node tests/test-live-generation.mjs [path/to/front_photo.jpg] [preset_id] [optional_hf_token]
 */
async function run() {
  const frontPhotoPath = process.argv[2] || path.resolve('..', 'Test images', 'IMG-20261013-WA0016.jpg.jpeg')
  const presetId = process.argv[3] || 'short-side-part'
  const token = process.argv[4] || process.env.HF_TOKEN || undefined

  if (!fs.existsSync(frontPhotoPath)) {
    console.error(`Front photo not found at: ${frontPhotoPath}`)
    process.exit(1)
  }

  const refPath = presetId === 'pompadour'
    ? path.resolve('public', 'hairstyles', 'pompadour.jpg')
    : path.resolve('public', 'hairstyles', 'side-part-reference.png')

  if (!fs.existsSync(refPath)) {
    console.error(`Hairstyle reference not found at: ${refPath}`)
    process.exit(1)
  }

  console.log('--- Relook Live Generation Test ---')
  console.log(`Front Photo: ${frontPhotoPath}`)
  console.log(`Hairstyle: ${presetId} (${refPath})`)
  console.log(`Token: ${token ? 'Authenticated (user token)' : 'Anonymous (ZeroGPU public queue)'}`)

  const frontBytes = fs.readFileSync(frontPhotoPath)
  const frontMime = frontPhotoPath.endsWith('.png') ? 'image/png' : 'image/jpeg'
  const refBytes = fs.readFileSync(refPath)
  const refMime = refPath.endsWith('.png') ? 'image/png' : 'image/jpeg'

  console.log('Connecting to black-forest-labs/FLUX.2-klein-4B...')
  const client = await Client.connect('black-forest-labs/FLUX.2-klein-4B', token ? { token } : undefined)

  const prompt = [
    'Edit image 1 only. Create ONE front-facing hairstyle photograph, not a collage.',
    'Image 2 is the selected hairstyle reference. Match its haircut using the front view as the primary target.',
    'Selected hairstyle: Short Side Part. A compact off-centre side part, short swept top with modest lift, and a gentle low taper. Keep dark coverage on the upper sides.',
    'Match the supplied hairstyle reference image: its length, parting, texture, fringe, volume and side silhouette.',
    'Use only its hair, never its face, skin, beard, head shape or background. Preserve my natural hair color from the original photo; do not copy the reference hair color.',
    'Preserve image 1\'s face, eyes, eyebrows, nose, mouth, jaw width, ears, skin texture, beard, expression, head position, clothing, lighting, background and framing.',
    'Change only scalp hair. No beautification or skin smoothing.',
  ].join(' ')

  const input_images = [
    { image: handle_file(new Blob([frontBytes], { type: frontMime })), caption: null },
    { image: handle_file(new Blob([refBytes], { type: refMime })), caption: null },
  ]

  console.log('Submitting live inference request to ZeroGPU...')
  const startTime = Date.now()
  const result = await client.predict('/infer', {
    prompt,
    input_images,
    mode_choice: 'Distilled (4 steps)',
    seed: 42,
    randomize_seed: false,
    width: 768,
    height: 1024,
    num_inference_steps: 4,
    guidance_scale: 1,
    prompt_upsampling: false,
  })
  client.close()

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log(`Inference completed in ${elapsed}s!`)

  const outputUrl = result.data?.[0]?.url
  console.log(`Result URL: ${outputUrl}`)

  const res = await fetch(outputUrl)
  if (!res.ok) throw new Error(`Download failed with status ${res.status}`)

  const outBuffer = Buffer.from(await res.arrayBuffer())
  const outPath = path.resolve('relook-live-test-output.webp')
  fs.writeFileSync(outPath, outBuffer)
  console.log(`Saved output (${outBuffer.length} bytes) to: ${outPath}`)
}

run().catch((err) => {
  console.error('Test failed:', err)
  process.exit(1)
})
