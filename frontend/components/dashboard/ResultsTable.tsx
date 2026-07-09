import { CRMRecord } from "@/types/crm";

interface Props {
  records: CRMRecord[];
}

export default function ResultsTable({ records }: Props) {
  if (records.length === 0) return null;

  return (
    <div className="mt-10 overflow-x-auto rounded-xl border bg-white shadow">
      <table className="min-w-full">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Phone</th>
            <th className="px-4 py-3 text-left">Company</th>
            <th className="px-4 py-3 text-left">Notes</th>
          </tr>
        </thead>

        <tbody>
          {records.map((record, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{record.name}</td>
              <td className="px-4 py-2">{record.email}</td>
              <td className="px-4 py-2">{record.phone}</td>
              <td className="px-4 py-2">{record.company}</td>
              <td className="px-4 py-2">{record.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}