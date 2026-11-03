import {test} from 'node:test'
import assert from 'node:assert/strict'
import sharp from 'sharp'
import {prepare,composite,dimensions} from './images.mjs'
import {fill} from './provider.mjs'
async function fixture(){
 const width=96,height=128
 const original=await sharp({create:{width,height,channels:3,background:{r:40,g:80,b:120}}}).png().toBuffer()
 const mask=Buffer.alloc(width*height)
 for(let y=10;y<40;y++)for(let x=20;x<65;x++)mask[y*width+x]=255
 const png=await sharp(mask,{raw:{width,height,channels:1}}).png().toBuffer()
 return {original,mask:png,prepared:await prepare(original,png)}
}
test('composites at original dimensions with exact protected pixels after PNG encoding',async()=>{
 const {prepared}=await fixture()
 const generated=await sharp({create:{...prepared.size,channels:3,background:{r:240,g:180,b:30}}}).png().toBuffer()
 const result=await composite(prepared,generated)
 assert.equal(result.width,96);assert.equal(result.height,128)
 assert.equal(result.changedProtectedPixels,0)
 assert.equal(result.protectedPixels,96*128-30*45)
 const pixels=await sharp(result.png).raw().toBuffer()
 for(let i=0;i<prepared.binary.length;i++)if(!prepared.binary[i])assert.deepEqual(pixels.subarray(i*3,i*3+3),prepared.base.subarray(i*3,i*3+3))
 assert.deepEqual([...pixels.subarray((20*96+40)*3,(20*96+40)*3+3)],[240,180,30])
})
test('rejects blank, excessive or wrong-size masks and unexpected generated dimensions',async()=>{
 const {original,prepared}=await fixture()
 const mk=(width,height,color)=>sharp({create:{width,height,channels:3,background:color}}).png().toBuffer()
 await assert.rejects(prepare(original,await mk(96,128,'black')),/Paint the hair/)
 await assert.rejects(prepare(original,await mk(96,128,'white')),/half/)
 await assert.rejects(prepare(original,await mk(96,96,'black')),/match/)
 await assert.rejects(composite(prepared,original),/unexpected dimensions/)
 assert.throws(()=>dimensions(100,1000),/normal portrait/)
})
test('sends a real mask to Fill once with correct dimensions and closes the client',async()=>{
 const {prepared}=await fixture();let calls=0,closed=false
 const result=await fill(prepared,'hf_test','short side-part',{
 connect:async(space,options)=>{
 assert.equal(space,'black-forest-labs/FLUX.1-Fill-dev');assert.equal(options.token,'hf_test')
 return {close:()=>closed=true,predict:async(endpoint,args)=>{
 calls++;assert.equal(endpoint,'/infer');assert.equal(args.edit_images.layers.length,1)
 assert.deepEqual(Buffer.from(await args.edit_images.layers[0].arrayBuffer()),prepared.inputMask)
 assert.deepEqual(Buffer.from(await args.edit_images.background.arrayBuffer()),prepared.input)
 assert.equal(args.width,768);assert.equal(args.height,1024)
 return {data:[{url:'https://black-forest-labs-flux-1-fill-dev.hf.space/gradio_api/file=result.png'}]}
 }}},download:async(_,opts)=>{assert.equal(opts.redirect,'error');return new Response('mock-result')}
 })
 assert.equal(result.toString(),'mock-result');assert.equal(calls,1);assert.equal(closed,true)
})
test('rejects an untrusted output URL before fetching',async()=>{
 const {prepared}=await fixture()
 await assert.rejects(fill(prepared,'hf_test','short side-part',{
 connect:async()=>({close:()=>{},predict:async()=>({data:[{url:'http://127.0.0.1/private'}]})}),
 download:()=>assert.fail('Must not fetch'),
 }),/Unexpected provider/)
})
