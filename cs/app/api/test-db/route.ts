import { NextResponse } from 'next/server';
import pool from '@/lib/mysql'; // 데이터베이스 연결 모듈

export async function GET() {
  try {
    const [rows] = await pool.query('SHOW TABLES');
    return NextResponse.json({
      success: true,
      tables: rows,
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to the database' },
      { status: 500 }
    );
  }
}
