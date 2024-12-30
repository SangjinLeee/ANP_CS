'use client';

import { useEffect, useState } from 'react';

interface Report {
  id: number;
  lot_number: string;
  description: string;
  report_type: string;
  report_date: string;
  status: string;
}

export default function AdminPage() {
  const [reports, setReports] = useState<Report[]>([]); // 타입 지정
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch('/api/reports');
        const data: Report[] = await response.json(); // 데이터 타입 지정
        setReports(data);
      } catch (err) {
        setError('Failed to fetch reports');
      }
    }
    fetchReports();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!reports.length) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Lot Number</th>
            <th className="border border-gray-300 p-2">Description</th>
            <th className="border border-gray-300 p-2">Type</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td className="border border-gray-300 p-2">{report.lot_number}</td>
              <td className="border border-gray-300 p-2">{report.description}</td>
              <td className="border border-gray-300 p-2">{report.report_type}</td>
              <td className="border border-gray-300 p-2">{report.report_date}</td>
              <td className="border border-gray-300 p-2">{report.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
