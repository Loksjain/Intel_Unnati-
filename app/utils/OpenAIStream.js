import { createParser } from 'eventsource-parser'

export async function OpenAIStream(payload) {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      method: 'POST',
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errorBody = await res.json()
      throw new Error(`OpenAI API Error [${res.status}]: ${JSON.stringify(errorBody)}`)
    }

    const stream = new ReadableStream({
      async start(controller) {
        const parser = createParser(event => {
          if (event.type === 'event') {
            const data = event.data
            if (data === '[DONE]') {
              controller.close()
              return
            }
            try {
              const json = JSON.parse(data)
              const text = json.choices[0].delta?.content || ''
              controller.enqueue(encoder.encode(text))
            } catch (e) {
              controller.error(e)
            }
          }
        })

        for await (const chunk of res.body) {
          parser.feed(decoder.decode(chunk))
        }
      }
    })

    return stream

  } catch (error) {
    console.error('OpenAI Stream Error:', error)
    throw new Error(`API request failed: ${error.message}`)
  }
}