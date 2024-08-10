import { NextResponse } from "next/server"
import OpenAI from "openai";


export async function POST(req){
  const openai = new OpenAI();
  const data = await req.json()
  const systemPrompt = `
    You are a helpful recipe generator, that can generate a recipe based on a provided list of items`
  const completion = await openai.chat.completions.create({
    messages:[{role:'system',content:systemPrompt},...data],
    model:'gpt-4o-mini',
    stream:true,
  })
  {/**return NextResponse.json(
    {message: completion.choices[0].message.content},
  {status:200},
  )*/}

  const stream = new ReadableStream({
    async start(controller){
        const encoder = new TextEncoder()
        try{
            for await (const chunk of completion){
                const content = chunk.choices[0]?.delta?.content
                if(content){
                    const text = encoder.encode(content)
                    controller.enqueue(text)
                }
            }
        } catch (err) {
            controller.error(err)
        }
        finally{
            controller.close()
        }
    },
})
return new NextResponse(stream)



}

