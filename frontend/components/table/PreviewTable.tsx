interface PreviewTableProps {
  rows: Record<string, string>[];
}

export default function PreviewTable({
  rows,
}: PreviewTableProps) {
  if (rows.length === 0) return null;

  const headers = Object.keys(rows[0]);

  return (
    <div className="mt-8 overflow-x-auto rounded-xl border bg-white shadow">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="border px-4 py-3 text-left"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.slice(0, 10).map((row, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td
                  key={header}
                  className="border px-4 py-2"
                >
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t bg-gray-50 p-3 text-sm text-gray-500">
        Showing first {Math.min(rows.length, 10)} of {rows.length} rows
      </div>
    </div>
  );
}