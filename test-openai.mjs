import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

async function testOpenAI() {
    const prompt = 'Tell me a joke.';
    const payload = {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 1,
        max_tokens: 50,
        stream: false,
        n: 1,
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        method: 'POST',
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('OpenAI API Response:', data);
}

testOpenAI();