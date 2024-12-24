import {config} from "dotenv"
config()

import OpenAI from "openai";
const openai = new OpenAI( {apiKey: process.env.OPENAI_API_KEY} );

const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        {
            role: "user",
            content: "Write a haiku about recursion in programming.",
        },
    ],
});

console.log(completion.choices[0].message.content);