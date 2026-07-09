"use client";

import { useState } from "react";

import UploadZone from "@/components/upload/UploadZone";
import PreviewTable from "@/components/table/PreviewTable";

import { parseCSV } from "@/services/csv.service";

import { CSVRow } from "@/types/crm";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  const [rows, setRows] = useState<CSVRow[]>([]);

  const [loading, setLoading] = useState(false);

  async function handleFileSelect(selectedFile: File) {
    setFile(selectedFile);

    setLoading(true);

    try {
      const parsedRows = await parseCSV(selectedFile);

      setRows(parsedRows);
    } catch (err) {
      console.error(err);

      alert("Failed to parse CSV.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-100">

      <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-16">

        <h1 className="mb-4 text-center text-5xl font-bold">
          GrowEasy AI CSV Importer
        </h1>

        <p className="mb-10 text-center text-gray-600">
          Upload a CSV file and preview it before sending it to AI.
        </p>

        <UploadZone
          onFileSelect={handleFileSelect}
        />

        {file && (
          <div className="mt-8 rounded-xl bg-white p-5 shadow">

            <h3 className="font-semibold">
              Selected File
            </h3>

            <p className="mt-2">
               {file.name}
            </p>

            <p className="text-sm text-gray-500">
              {(file.size / 1024).toFixed(2)} KB
            </p>

          </div>
        )}

        {loading && (
          <div className="mt-8 text-center text-lg font-semibold">
            Parsing CSV...
          </div>
        )}

        {rows.length > 0 && (
          <PreviewTable rows={rows} />
        )}

      </section>

    </main>
  );
}