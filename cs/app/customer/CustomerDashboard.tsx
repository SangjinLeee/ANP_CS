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

export function CustomerDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setIsLoading(true);
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
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter((complaint) =>
    complaint.product.toLowerCase().includes(search.toLowerCase()) ||
    complaint.customer.toLowerCase().includes(search.toLowerCase()) ||
    complaint.lotNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Customer Complaint Dashboard</h1>
        
        {/* Search Input */}
        <div className="mb-6">
          <Input
            placeholder="Search by product, customer, or lot number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        {/* Complaints Table */}
        {isLoading ? (
          <p>Loading complaints...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredComplaints.length === 0 ? (
          <p>No complaints found.</p>
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
                  <TableCell>{complaint.dateOfProduction}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
