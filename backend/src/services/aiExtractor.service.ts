import Groq from "groq-sdk";

import { crmRecordSchema, CRMRecord } from "../schemas/crmRecord.schema";
import { retry } from "../utils/retry";
import { batchArray } from "../utils/batching";
import { recoverJSON } from "../utils/jsonRecovery";

/**
 * Create Groq client
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
 * AI Extraction Service
 */
export async function extractCRMRecords(
  rows: Record<string, string>[]
): Promise<{
  records: CRMRecord[];
  failedBatches: {
    batchNumber: number;
    reason: string;
  }[];
}> {
  const groq = getGroqClient();

  const batches = batchArray(rows, 25);

  const finalRecords: CRMRecord[] = [];

  const failedBatches: {
    batchNumber: number;
    reason: string;
  }[] = [];

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];

    const prompt =`You are an expert CRM data normalization engine.

Your ONLY task is to convert CSV rows into CRM records.

Return ONLY valid JSON.

Never explain.

Never use markdown.

Every object MUST contain exactly these fields:

[
  {
    "name":"",
    "email":"",
    "phone":"",
    "company":"",
    "notes":""
  }
]

Rules:

• Convert Name, Full Name, Customer Name → name

• Convert Email, Email Address, Mail → email

• Convert Phone, Mobile, Contact Number → phone

• Convert Company, Organization, Employer → company

• Everything else goes into notes.

• Missing values become "".

Never invent data.

Return ONLY JSON.
`;
const userPrompt=`
CSV Data:

${JSON.stringify(batch)}
`;

    try {
      const completion = await retry(async () => {
        return await groq.chat.completions.create({
          model: process.env.MODEL || "llama-3.3-70b-versatile",

          messages: [
            {
              role: "system",
              content: prompt,
            },
            {
              role: "user",
              content: userPrompt,
            }
          ],

          temperature: 0,
        });
      });

      const content = completion.choices[0].message.content;

      if (!content) {
        failedBatches.push({
          batchNumber: i + 1,
          reason: "Empty AI response",
        });
        continue;
      }

      let parsed: unknown;

      try {
        const cleanJSON = recoverJSON(content);
        parsed = JSON.parse(cleanJSON);
      } catch {
        failedBatches.push({
          batchNumber: i + 1,
          reason: "Invalid JSON",
        });
        continue;
      }

      const records = Array.isArray(parsed)
        ? parsed
        : (parsed as { records?: unknown[] }).records;

      if (!records) {
        failedBatches.push({
          batchNumber: i + 1,
          reason: "No records returned",
        });
        continue;
      }

      const validated = records.map((record) =>
        crmRecordSchema.parse(record)
      );

      finalRecords.push(...validated);
    } catch (error) {
      failedBatches.push({
        batchNumber: i + 1,
        reason: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return {
    records: finalRecords,
    failedBatches,
  };
}