import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export async function GET() {
  try {
    // 데이터 조회
    const [rows] = await pool.query('SELECT * FROM complaints ORDER BY createdAt DESC');
    
    // 디버깅용 로그
    console.log('GET Complaints:', rows);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('GET error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { 
        error: 'Failed to fetch complaints', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, email, lotNumber, product, complaintReport, dateOfProduction } = body;

    // 필수 필드 확인
    if (!customer || !email || !lotNumber || !product || !complaintReport || !dateOfProduction) {
      console.error('POST error: Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 이메일 형식 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('POST error: Invalid email format');
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
      console.error('POST error: Failed to retrieve insertId');
      return NextResponse.json({ error: 'Failed to insert complaint into database' }, { status: 500 });
    }

    // 디버깅용 로그
    console.log('POST Complaints Inserted ID:', result.insertId);

    return NextResponse.json({ id: result.insertId, ...body, status: 'Open' });
  } catch (error) {
    console.error('POST error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { 
        error: 'Failed to create complaint', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}
