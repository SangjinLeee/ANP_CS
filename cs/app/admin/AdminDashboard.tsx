'use client';

import { useState, useEffect } from 'react';

export function AdminDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // 데이터를 가져오는 로직을 여기에 추가합니다.
    console.log('Admin Dashboard mounted');
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* 추가 UI 요소를 여기에 추가 */}
    </div>
  );
}

