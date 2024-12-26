import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log('Params:', params);
    const { id } = params;
    const [rows] = await pool.query('SELECT * FROM complaints WHERE id = ?', [id]);

    console.log('Rows:', rows);
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch complaint', details: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log('Params:', params);
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const [result]: any = await pool.query('UPDATE complaints SET status = ? WHERE id = ?', [status, id]);

    console.log('Update Result:', result);
    if (!result || result.affectedRows === 0) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Complaint updated successfully' });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update complaint', details: error.message }, { status: 500 });
  }
}
