import { hairstyles } from '../data/hairstyles.ts'
import type { GenerationRequest } from './generationRequest.ts'

export function hairstyleInstruction(request: GenerationRequest): string {
  if (request.hairstyle.kind === 'custom') return `Requested haircut: ${request.hairstyle.description}. Preserve natural hair color unless the description explicitly requests a color change.`
  const id = request.hairstyle.id
  const style = hairstyles.find(item => item.id === id)
  if (!style) throw new Error('Choose an available hairstyle before building a prompt.')
  return `Selected hairstyle: ${style.name}. ${style.description} Match the supplied hairstyle reference image: its length, parting, texture, fringe, volume and side silhouette. Use only its hair, never its face, skin, beard, head shape or background. Preserve my natural hair color from the original photo; do not copy the reference hair color.`
}

export function buildPrompt(request: GenerationRequest): string {
  return [
    'Create a realistic hairstyle visualization using the four original photos in order: FRONT, BACK, LEFT, RIGHT.',
    'Use each original photo for its matching view. Return one clearly labelled four-panel result.',
    request.hairstyle.kind === 'preset' ? 'The fifth image is the selected hairstyle reference, not another identity photo.' : '',
    hairstyleInstruction(request),
    'Preserve the original facial features, skin texture, head shape, beard, expression, clothing, lighting and background. Change only scalp hair. No beautification or face slimming.',
    'Apply the requested hairstyle consistently across all four angles.',
  ].filter(Boolean).join('\n\n')
}
