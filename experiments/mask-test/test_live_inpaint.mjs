import fs from 'node:fs';
import { prepare, composite } from './images.mjs';
import { fill } from './provider.mjs';
import sharp from 'sharp';

async function run() {
  const token = process.env.HF_TOKEN;
  if (!token) {
    console.error('No HF_TOKEN provided');
    process.exit(1);
  }

  console.log('Loading front.jpeg...');
  const photoPath = 'c:/Users/ASUS/Downloads/Test images/front.jpeg';
  const originalBuffer = fs.readFileSync(photoPath);

  // Get metadata
  const meta = await sharp(originalBuffer).metadata();
  console.log('Image dimensions:', meta.width, 'x', meta.height);

  // In front.jpeg (3000x4000):
  // Let's create a realistic hair mask on top of the head
  // Hair region: roughly x: 600..2400, y: 500..1800
  // Let's create an SVG polygon covering the hair
  const svgMask = `
    <svg width="${meta.width}" height="${meta.height}">
      <polygon points="
        700,1650 900,1200 1300,750 1700,750 2100,1200 2300,1650
        2150,1850 1850,1850 1500,1750 1150,1850 850,1850
      " fill="white" />
    </svg>
  `;

  console.log('Generating mask buffer...');
  const maskBuffer = await sharp({
    create: {
      width: meta.width,
      height: meta.height,
      channels: 3,
      background: { r: 0, g: 0, b: 0 }
    }
  })
  .composite([{ input: Buffer.from(svgMask), top: 0, left: 0 }])
  .png()
  .toBuffer();

  console.log('Preparing image and mask with sharp...');
  const prepared = await prepare(originalBuffer, maskBuffer);
  console.log('Prepared size:', prepared.size);

  const prompt = "A realistic photograph of this man with a modern textured fringe haircut, natural dark hair, clean tapered hairline, matte salon texture, soft volume on top. Seamlessly blend the new hair with the unmasked original photograph.";

  console.log('Calling FLUX.1-Fill-dev on Hugging Face with new token...');
  try {
    const generated = await fill(prepared, token, prompt);
    console.log('Generated result buffer length:', generated.length);

    console.log('Compositing result with 100% frozen original face pixels...');
    const result = await composite(prepared, generated);
    console.log(`Protected pixels: ${result.protectedPixels.toLocaleString()}`);
    console.log(`Changed protected pixels: ${result.changedProtectedPixels}`);

    const outPath = 'C:/Users/ASUS/.gemini/antigravity/brain/e83e4643-6987-4fb2-8e76-6d2cfaeb22f8/inpaint_live_result.png';
    fs.writeFileSync(outPath, result.png);
    console.log('SUCCESS! Saved result to:', outPath);
  } catch (err) {
    console.error('FLUX.1-Fill-dev error:', err.message);
  }
}

run();
