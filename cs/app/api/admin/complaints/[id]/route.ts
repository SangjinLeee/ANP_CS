import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // params 확인
    if (!params || !params.id) {
      console.error('GET error: Missing "id" parameter');
      return NextResponse.json({ error: 'Missing "id" parameter' }, { status: 400 });
    }

    const { id } = params;

    // 데이터베이스 조회
    const [rows]: [any[], any] = await pool.query('SELECT * FROM complaints WHERE id = ?', [id]);

    if (!Array.isArray(rows) || rows.length === 0) {
      console.warn(`GET warning: Complaint with id=${id} not found`);
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    console.info(`GET success: Complaint retrieved for id=${id}`);
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('GET error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to fetch complaint', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // params 확인
    if (!params || !params.id) {
      console.error('PATCH error: Missing "id" parameter');
      return NextResponse.json({ error: 'Missing "id" parameter' }, { status: 400 });
    }

    const { id } = params;
    const body = await request.json();
    const { status } = body;

    // 필수 필드 확인
    if (!status) {
      console.error('PATCH error: Missing "status" field');
      return NextResponse.json({ error: 'Missing "status" field' }, { status: 400 });
    }

    // 데이터베이스 업데이트
    const [result]: any = await pool.query('UPDATE complaints SET status = ? WHERE id = ?', [status, id]);

    if (!result || result.affectedRows === 0) {
      console.warn(`PATCH warning: Complaint with id=${id} not found`);
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    console.info(`PATCH success: Complaint with id=${id} updated to status=${status}`);
    return NextResponse.json({ message: 'Complaint updated successfully' });
  } catch (error) {
    console.error('PATCH error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to update complaint', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
