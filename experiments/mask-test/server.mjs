import {createServer} from 'node:http'
import {readFile} from 'node:fs/promises'
import {prepare,composite} from './images.mjs'
import {fill} from './provider.mjs'
const host='127.0.0.1',port=8790,origin=`http://${host}:${port}`
let busy=false
function reply(res,status,payload){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(payload))}
function decode(value){if(typeof value!=='string'||value.length>30*1024*1024||!/^[A-Za-z0-9+/]+={0,2}$/.test(value))throw Error('Invalid image data');return Buffer.from(value,'base64')}
createServer(async(req,res)=>{
  res.setHeader('Referrer-Policy','no-referrer')
  if(req.headers.host!==`${host}:${port}`)return reply(res,403,{error:'Open the exact local address printed by the terminal.'})
  if(req.url==='/' && req.method==='GET'){
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});return res.end(await readFile(new URL('./index.html',import.meta.url)))
  }
  if(req.url!=='/generate'||req.method!=='POST')return reply(res,404,{error:'Not found'})
  if(req.headers.origin!==origin || !req.headers['content-type']?.startsWith('application/json'))return reply(res,403,{error:'Use the local test page.'})
  if(busy)return reply(res,409,{error:'A test is already running. Wait for it to finish.'})
  busy=true
  let token='',stage='Input validation'
  try{
    const chunks=[];let size=0
    for await(const chunk of req){size+=chunk.length;if(size>40*1024*1024)throw Error('Photo is too large. Use a smaller file.');chunks.push(chunk)}
    const body=JSON.parse(Buffer.concat(chunks).toString())
    token=body.token
    if(typeof token!=='string'||!/^hf_[A-Za-z0-9]+$/.test(token)||token.length>256)throw Error('Enter a valid Hugging Face token.')
    if(typeof body.prompt!=='string'||body.prompt.trim().length<10||body.prompt.length>1500)throw Error('Use a haircut description between 10 and 1500 characters.')
    const prepared=await prepare(decode(body.photo),decode(body.mask))
    stage='Hugging Face generation'
    const generated=await fill(prepared,token,body.prompt.trim())
    stage='Protected-pixel verification'
    const result=await composite(prepared,generated)
    reply(res,200,{data:result.png.toString('base64'),protectedPixels:result.protectedPixels,changedProtectedPixels:result.changedProtectedPixels,width:result.width,height:result.height})
  }catch(e){
    let detail=typeof e?.message==='string'?e.message:'The provider returned an unspecified error.'
    if(token)detail=detail.replaceAll(token,'[hidden]')
    detail=detail.replace(/hf_[A-Za-z0-9]+/g,'[hidden]').replace(/https?:\/\/\S+/g,'[URL]').replace(/[A-Za-z0-9+/=_-]{80,}/g,'[data]').slice(0,600)
    const quota=/quota|runs limit|429/i.test(detail)
    reply(res,quota?429:502,{error:`${stage}: ${detail}${quota?' Wait for your account allowance to reset.':''}`})
  }finally{busy=false}
}).listen(port,host,()=>console.log(`Separate masked-hair test: ${origin}\nKeep this window open. No changes are made to Relook.`))
