import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET() {
  try {
    // 데이터 조회
    const [rows] = await pool.query('SELECT * FROM complaints ORDER BY createdAt DESC');
    console.log('GET Complaints:', rows); // 디버깅용 로그
    return NextResponse.json(rows);
  } catch (error) {
    console.error('GET error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch complaints', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, email, lotNumber, product, complaintReport, dateOfProduction } = body;

    // 필수 필드 확인
    if (!customer || !email || !lotNumber || !product || !complaintReport || !dateOfProduction) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 이메일 형식 유효성 검사 (선택 사항)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const query = `
      INSERT INTO complaints (customer, email, lotNumber, product, complaintReport, dateOfProduction, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, 'Open', NOW())
    `;
    const values = [customer, email, lotNumber, product, complaintReport, dateOfProduction];

    // 데이터 삽입
    const [result]: any = await pool.query(query, values);

    // 삽입 결과 확인
    if (!result.insertId) {
      throw new Error('Failed to retrieve insertId from database.');
    }

    console.log('POST Complaints Inserted ID:', result.insertId); // 디버깅용 로그
    return NextResponse.json({ id: result.insertId, ...body, status: 'Open' });
  } catch (error) {
    console.error('POST error:', error.message);
    return NextResponse.json({ error: 'Failed to create complaint', details: error.message }, { status: 500 });
  }
}
