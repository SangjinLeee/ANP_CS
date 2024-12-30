'use client';

import { useState } from 'react';

export default function CustomerPage() {
  const [formData, setFormData] = useState({
    lot_number: '',
    description: '',
    report_type: 'CCR',
    report_date: '',
    status: 'pending',
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        alert('Report created successfully!');
      } else {
        alert('Failed to create report');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <input
        type="text"
        placeholder="Lot Number"
        value={formData.lot_number}
        onChange={(e) => setFormData({ ...formData, lot_number: e.target.value })}
        required
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
      />
      <input
        type="date"
        value={formData.report_date}
        onChange={(e) => setFormData({ ...formData, report_date: e.target.value })}
        required
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Submit
      </button>
    </form>
  );
}
