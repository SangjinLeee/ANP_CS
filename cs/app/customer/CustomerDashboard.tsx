'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Complaint {
  id: number;
  customer: string;
  product: string;
  lotNumber: string;
  complaintReport: string;
  dateOfProduction: string; // ISO 형식 문자열
}

export function CustomerDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/complaints');
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data: Complaint[] = await response.json();
        if (Array.isArray(data)) {
          setComplaints(data);
        } else {
          setComplaints([]);
        }
      } catch (err) {
        setError('Failed to fetch complaints. Please try again later.');
        console.error('Fetch complaints error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter((complaint) =>
    [complaint.product, complaint.customer, complaint.lotNumber]
      .filter(Boolean) // 필드가 null/undefined가 아니도록 필터
      .some((field) => field.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Customer Complaint Dashboard</h1>

        {/* 검색 입력 필드 */}
        <div className="mb-6">
          <Input
            placeholder="Search by product, customer, or lot number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* 로딩, 에러 및 데이터 상태 처리 */}
        {isLoading ? (
          <div className="text-center">
            <p>Loading complaints...</p>
            <div className="loader mt-2"></div>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : filteredComplaints.length === 0 ? (
          <p className="text-center">No complaints found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Lot Number</TableHead>
                <TableHead>Complaint</TableHead>
                <TableHead>Date of Production</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell>{complaint.customer}</TableCell>
                  <TableCell>{complaint.product}</TableCell>
                  <TableCell>{complaint.lotNumber}</TableCell>
                  <TableCell>{complaint.complaintReport}</TableCell>
                  <TableCell>
                    {new Date(complaint.dateOfProduction).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
