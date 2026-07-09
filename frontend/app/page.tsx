"use client";

import { useState } from "react";

import UploadZone from "@/components/upload/UploadZone";
import UploadButton from "@/components/upload/UploadButton";
import PreviewTable from "@/components/table/PreviewTable";
import ResultsTable from "@/components/dashboard/ResultsTable";

import { parseCSV, uploadCSV } from "@/services/csv.service";

import {
  CSVRow,
  CRMRecord,
  ImportResponse,
} from "@/types/crm";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  const [rows, setRows] = useState<CSVRow[]>([]);

  const [crmRecords, setCRMRecords] =
    useState<CRMRecord[]>([]);

  const [loading, setLoading] =
    useState(false);

  async function handleFileSelect(selectedFile: File) {
    setFile(selectedFile);

    const parsed = await parseCSV(selectedFile);

    setRows(parsed);

    setCRMRecords([]);
  }

  async function handleImport() {
    if (!file) return;

    setLoading(true);

    try {
      const response: ImportResponse =
        await uploadCSV(file);

      setCRMRecords(response.crmRecords);
    } catch (err) {
      console.error(err);

      alert("Import failed.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-100">

      <section className="mx-auto max-w-7xl px-6 py-16">

        <h1 className="mb-4 text-center text-5xl font-bold">
          GrowEasy AI CSV Importer
        </h1>

        <p className="mb-10 text-center text-gray-600">
          Upload CSV → Preview → AI Import
        </p>

        <UploadZone
          onFileSelect={handleFileSelect}
        />

        {file && (
          <div className="mt-8 rounded-xl bg-white p-5 shadow">

            <p className="font-semibold">
              📄 {file.name}
            </p>

            <p className="text-gray-500">
              {(file.size / 1024).toFixed(2)} KB
            </p>

            <UploadButton
              loading={loading}
              disabled={!file}
              onClick={handleImport}
            />
          </div>
        )}

        <PreviewTable rows={rows} />

        <ResultsTable records={crmRecords} />

      </section>

    </main>
  );
}