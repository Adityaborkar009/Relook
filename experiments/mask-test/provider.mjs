import {Client,handle_file} from '@gradio/client'
export async function fill(prepared,token,prompt,{connect=(...a)=>Client.connect(...a),download=fetch,timeoutMs=240000}={}) {
  let client,timer,expired=false
  const work=async()=>{
    client=await connect('black-forest-labs/FLUX.1-Fill-dev',{token})
    if(expired){client.close();throw Error('Request timed out')}
    const background=handle_file(new Blob([prepared.input],{type:'image/png'}))
    const mask=handle_file(new Blob([prepared.inputMask],{type:'image/png'}))
    const result=await client.predict('/infer',{
      edit_images:{background,layers:[mask],composite:background},prompt,
      seed:42,randomize_seed:false,width:prepared.size.width,height:prepared.size.height,
      guidance_scale:30,num_inference_steps:28,
    })
    if(expired)throw Error('Request timed out')
    const url=new URL(result.data?.[0]?.url)
    if(url.protocol!=='https:'||url.hostname!=='black-forest-labs-flux-1-fill-dev.hf.space'||url.port||url.username||url.password)throw Error('Unexpected provider download address')
    const response=await download(url,{redirect:'error',signal:AbortSignal.timeout(30000)})
    if(!response.ok||!response.body)throw Error(`Result download failed (${response.status})`)
    const chunks=[];let length=0
    for await(const chunk of response.body){length+=chunk.length;if(expired||length>16*1024*1024)throw Error('Result exceeded the download limit');chunks.push(chunk)}
    return Buffer.concat(chunks)
  }
  try{return await Promise.race([work(),new Promise((_,reject)=>{timer=setTimeout(()=>{expired=true;reject(Error('Request timed out. It may still be running at Hugging Face.'))},timeoutMs)})])}
  finally{clearTimeout(timer);client?.close()}
}
