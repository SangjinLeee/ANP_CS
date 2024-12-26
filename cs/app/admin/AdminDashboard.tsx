'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import '../../styles/admin.css';

interface Complaint {
  id: number;
  customer: string;
  product: string;
  lotNumber: string;
  status: string;
}

export function AdminDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch('/api/complaints');
        if (!response.ok) {
          throw new Error('Failed to fetch complaints');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setComplaints(data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error('Error fetching complaints:', errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter((complaint) =>
    [complaint.product, complaint.customer, complaint.lotNumber]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-4">
      <div className="card bg-white shadow-md rounded-lg p-6">
        <div className="card-header flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Link href="/customer">
            <button className="button">Go to Customer Page</button>
          </Link>
        </div>
        <div className="mb-4">
          <input
            className="input w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Search by product, customer, or lot number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {isLoading ? (
          <p className="text-gray-500 text-center">Loading complaints...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : filteredComplaints.length === 0 ? (
          <p className="text-gray-500 text-center">No complaints found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 border">Customer</th>
                  <th className="px-4 py-2 border">Product</th>
                  <th className="px-4 py-2 border">Lot Number</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{complaint.customer}</td>
                    <td className="px-4 py-2 border">{complaint.product}</td>
                    <td className="px-4 py-2 border">{complaint.lotNumber}</td>
                    <td className="px-4 py-2 border">
                      <span
                        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                          complaint.status === 'Open'
                            ? 'bg-yellow-100 text-yellow-800'
                            : complaint.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
