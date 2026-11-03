import sharp from 'sharp'
const options = {limitInputPixels: 20_000_000}
export function dimensions(width,height) {
  const ratio=width/height
  if(ratio<9/16 || ratio>16/9) throw Error('Use a photo with a normal portrait or landscape shape, not a panorama.')
  return ratio>1 ? {width:1024,height:Math.floor(Math.round(1024/ratio)/8)*8} : {width:Math.floor(Math.round(1024*ratio)/8)*8,height:1024}
}
export async function prepare(original,mask) {
  const {data:base,info}=await sharp(original,options).rotate().toColourspace('srgb').removeAlpha().raw().toBuffer({resolveWithObject:true})
  const m=await sharp(mask,options).metadata()
  if(m.width!==info.width||m.height!==info.height) throw Error('The mask must match the photo dimensions. Reload your photo and paint again.')
  const binary=await sharp(mask,options).removeAlpha().greyscale().threshold(128).raw().toBuffer()
  const count=binary.reduce((n,v)=>n+(v===255),0)
  if(!count) throw Error('Paint the hair before generating.')
  if(count>binary.length*0.5) throw Error('More than half the photo is selected. Clear the mask and paint only the hair.')
  const size=dimensions(info.width,info.height)
  const raw={width:info.width,height:info.height,channels:3}
  const input=await sharp(base,{raw}).resize(size.width,size.height,{fit:'fill'}).png().toBuffer()
  const inputMask=await sharp(binary,{raw:{...raw,channels:1}}).resize(size.width,size.height,{kernel:'nearest',fit:'fill'}).png().toBuffer()
  return {base,binary,raw,size,input,inputMask}
}
export async function composite(prepared,generated) {
  const meta=await sharp(generated,options).metadata()
  if(meta.width!==prepared.size.width || meta.height!==prepared.size.height) throw Error('The provider returned unexpected dimensions. No image was composited.')
  const pixels=await sharp(generated,options).toColourspace('srgb').removeAlpha().resize(prepared.raw.width,prepared.raw.height,{fit:'fill'}).raw().toBuffer()
  // Feather inward only. Pixels outside the binary mask always come from the original.
  const soft=await sharp(prepared.binary,{raw:{...prepared.raw,channels:1}}).blur(1.5).greyscale().raw().toBuffer()
  const output=Buffer.from(prepared.base)
  let protectedPixels=0
  for(let i=0;i<prepared.binary.length;i++) {
    if(prepared.binary[i]===0) {protectedPixels++;continue}
    const weight=soft[i]/255
    for(let c=0;c<3;c++) output[i*3+c]=Math.round(prepared.base[i*3+c]*(1-weight)+pixels[i*3+c]*weight)
  }
  const png=await sharp(output,{raw:prepared.raw}).png().toBuffer()
  const decoded=await sharp(png).removeAlpha().raw().toBuffer()
  let changedProtectedPixels=0
  for(let i=0;i<prepared.binary.length;i++) if(prepared.binary[i]===0 && [0,1,2].some(c=>decoded[i*3+c]!==prepared.base[i*3+c])) changedProtectedPixels++
  if(changedProtectedPixels) throw Error('Pixel-preservation check failed; result withheld.')
  return {png,protectedPixels,changedProtectedPixels,width:prepared.raw.width,height:prepared.raw.height}
}
