import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lot_number, description, report_type, report_date, status } = body;

    const query = `
      INSERT INTO reports (lot_number, description, report_type, report_date, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [lot_number, description, report_type, report_date, status];

    const [result] = await pool.query<ResultSetHeader>(query, values); // 타입 지정

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM reports ORDER BY report_date DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}
