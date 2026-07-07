import { z } from "zod";

export const crmRecordSchema = z.object({
  name: z.string().default(""),
  email: z.string().default(""),
  phone: z.string().default(""),
  company: z.string().default(""),
  notes: z.string().default("")
});

export type CRMRecord = z.infer<typeof crmRecordSchema>;