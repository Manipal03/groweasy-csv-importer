import Groq from "groq-sdk";

import { crmRecordSchema, CRMRecord } from "../schemas/crmRecord.schema";
import { retry } from "../utils/retry";

/**
 * Create a Groq client only when needed
 */
function getGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing.");
  }

  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
}

/**
 * Temporary endpoint to verify Groq connection
 */
export async function testGroqConnection(): Promise<string | null> {
  const groq = getGroqClient();

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

/**
 * Convert CSV rows into CRM Records using Groq
 */
export async function extractCRMRecords(
  rows: Record<string, string>[]
): Promise<CRMRecord[]> {

  //  Create Groq client here
  const groq = getGroqClient();

  const prompt = `
You are an expert CRM data extraction assistant.

Your task is to normalize CSV rows into CRM records.

Return ONLY valid JSON.

The response MUST be a JSON array.

Each object MUST have exactly these keys:

name
email
phone
company
notes

Rules:
- Use lowercase keys only.
- Never use Name, Email, Phone.
- Missing values must be empty strings.
- Do not include extra fields.
- Do not explain.
- Do not use markdown.
- Return only the JSON array.

CSV:

${JSON.stringify(rows)}
`;

  const completion = await retry(async () => {
    return await groq.chat.completions.create({
      model: process.env.MODEL || "llama-3.3-70b-versatile",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0,
    });
  });

  const content = completion.choices[0].message.content;

  if (!content) {
    throw new Error("Empty AI response.");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Groq returned invalid JSON.");
  }

  const records = Array.isArray(parsed)
    ? parsed
    : (parsed as { records?: unknown[] }).records;

  if (!records) {
    throw new Error("Groq response does not contain records.");
  }

  return records.map((record) =>
    crmRecordSchema.parse(record)
  );
}