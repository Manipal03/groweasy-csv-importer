import { CRMRecord } from "../schemas/crmRecord.schema";

export interface ValidationResult {
  validRecords: CRMRecord[];
  invalidRecords: CRMRecord[];
  duplicateRecords: CRMRecord[];
}

export function validateRecords(
  records: CRMRecord[]
): ValidationResult {

  const validRecords: CRMRecord[] = [];
  const invalidRecords: CRMRecord[] = [];
  const duplicateRecords: CRMRecord[] = [];

  const seenEmails = new Set<string>();

  for (const record of records) {

    const email = record.email.trim().toLowerCase();

    const hasAnyValue =
      record.name ||
      record.email ||
      record.phone ||
      record.company ||
      record.notes;

    if (!hasAnyValue) {
      invalidRecords.push(record);
      continue;
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      invalidRecords.push(record);
      continue;
    }

    if (email && seenEmails.has(email)) {
      duplicateRecords.push(record);
      continue;
    }

    if (email) {
      seenEmails.add(email);
    }

    validRecords.push(record);
  }

  return {
    validRecords,
    invalidRecords,
    duplicateRecords,
  };
}