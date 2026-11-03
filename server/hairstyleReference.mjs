import { readFile } from 'node:fs/promises'
import { hairstyles } from '../src/data/hairstyles.ts'

export async function hairstyleReference(choice, view) {
  if (choice.kind !== 'preset') return null
  const style = hairstyles.find(item => item.id === choice.id)
  if (!style) throw new Error('Unknown hairstyle')
  // Resolve only catalog-owned assets, never a request-supplied path or URL.
  const path = (view && style.referenceViews?.[view]) || style.referenceSrc || style.src
  const bytes = await readFile(new URL(`../public${path}`, import.meta.url))
  return { bytes, mimeType: path.endsWith('.png') ? 'image/png' : 'image/jpeg' }
}
