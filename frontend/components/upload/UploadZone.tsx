"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export default function UploadZone({
  onFileSelect,
}: UploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "text/csv": [".csv"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`rounded-2xl border-2 border-dashed p-16 cursor-pointer transition ${
        isDragActive
          ? "border-green-600 bg-green-50"
          : "border-gray-300 bg-white"
      }`}
    >
      <input {...getInputProps()} />

      <div className="text-center">
        <div className="mb-4 text-6xl">📄</div>

        <h2 className="text-2xl font-semibold">
          Upload CSV
        </h2>

        <p className="mt-4 text-gray-500">
          {isDragActive
            ? "Drop the CSV here..."
            : "Drag & Drop CSV or Click to Browse"}
        </p>
      </div>
    </div>
  );
}