import { NextResponse } from "next/server"
import OpenAI from "openai";


export async function POST(req){
  const openai = new OpenAI();
  const data = await req.json()
  const systemPrompt = `
    You are a helpful recipe generator, that can generate a recipe based on a provided list of items`
  const completion = await openai.chat.completions.create({
    messages:[{role:'system',content:systemPrompt},...data],
    model:'gpt-4o-mini'
  })
  return NextResponse.json(
    {message: completion.choices[0].message.content},
  {status:200},
  )
}

