'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MainPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Debug Navigation Page</h1>
        <p className="text-gray-600">Click a button below to navigate to the respective page.</p>
        <div className="space-x-4">
          <Link href="/admin">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Go to Admin Page
            </Button>
          </Link>
          <Link href="/customer">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Go to Customer Page
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
