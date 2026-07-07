import Groq from "groq-sdk";

export async function testGroqConnection(): Promise<string | null> {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const response = await groq.chat.completions.create({
    model: process.env.MODEL || "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: "Reply with exactly: Connection Successful",
      },
    ],
  });

  return response.choices[0].message.content;
}