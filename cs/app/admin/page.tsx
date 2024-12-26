'use client';

import { AdminDashboard } from './AdminDashboard';
import { CenteredLayout } from '@/components/ui/CenteredLayout';

export default function AdminPage() {
  return (
    <CenteredLayout>
      <AdminDashboard />
    </CenteredLayout>
  );
}
