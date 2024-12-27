import { NextResponse } from 'next/server';
import { RowDataPacket, OkPacket } from 'mysql2';
import pool from '@/lib/mysql';

// GET: 특정 Complaint 조회
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // params 확인
    if (!params?.id) {
      return NextResponse.json({ error: 'Missing "id" parameter' }, { status: 400 });
    }

    const { id } = params;

    // 데이터베이스에서 특정 Complaint 조회
    const [rows]: [RowDataPacket[]] = await pool.query(
      'SELECT * FROM complaints WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: `Complaint with id=${id} not found` }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('GET error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to fetch complaint', details: errorMessage },
      { status: 500 }
    );
  }
}

// PATCH: 특정 Complaint 업데이트
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // params 확인
    if (!params?.id) {
      return NextResponse.json({ error: 'Missing "id" parameter' }, { status: 400 });
    }

    const { id } = params;
    const body = await request.json();
    const { status }: { status: string } = body;

    // 필수 필드 확인
    if (!status) {
      return NextResponse.json({ error: 'Missing "status" field' }, { status: 400 });
    }

    // 데이터베이스에서 특정 Complaint 업데이트
    const [result]: [OkPacket] = await pool.query(
      'UPDATE complaints SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: `Complaint with id=${id} not found` }, { status: 404 });
    }

    return NextResponse.json({ message: `Complaint with id=${id} updated successfully` }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('PATCH error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to update complaint', details: errorMessage },
      { status: 500 }
    );
  }
}
