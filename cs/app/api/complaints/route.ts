import { NextResponse } from 'next/server';
import { RowDataPacket, OkPacket } from 'mysql2';
import pool from '@/lib/mysql';

// GET: Fetch all complaints
export async function GET(): Promise<NextResponse> {
  try {
    // MySQL 쿼리 실행
    const [rows]: [RowDataPacket[]] = await pool.query(`
      SELECT 
        report_id AS id,
        lot_number AS lotNumber,
        description AS complaintReport,
        report_date AS dateOfProduction,
        report_type AS product,
        status
      FROM reports
      WHERE report_type = 'CCR'
      ORDER BY report_date DESC
    `);

    // 데이터가 없는 경우 처리
    if (rows.length === 0) {
      return NextResponse.json(
        { message: 'No complaints found', complaints: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('GET error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to fetch complaints', details: errorMessage },
      { status: 500 }
    );
  }
}

// POST: Insert a new complaint
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // 요청 데이터 파싱
    const body = await request.json();
    const {
      customer,
      email,
      lotNumber,
      product,
      complaintReport,
      dateOfProduction,
    }: {
      customer: string;
      email: string;
      lotNumber: string;
      product: string;
      complaintReport: string;
      dateOfProduction: string;
    } = body;

    // 필수 필드 검증
    if (
      !customer?.trim() ||
      !email?.trim() ||
      !lotNumber?.trim() ||
      !product?.trim() ||
      !complaintReport?.trim() ||
      !dateOfProduction
    ) {
      return NextResponse.json(
        { error: 'Missing or invalid required fields' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // MySQL INSERT 쿼리 실행
    const query = `
      INSERT INTO reports (lot_number, report_type, description, report_date, status)
      VALUES (?, 'CCR', ?, ?, 'report received')
    `;
    const values = [lotNumber, complaintReport, dateOfProduction];

    const [result]: [OkPacket] = await pool.query(query, values);

    // 데이터 삽입 성공 여부 확인
    if (result.affectedRows === 0) {
      throw new Error('Failed to insert the complaint.');
    }

    return NextResponse.json({
      success: true,
      message: 'Complaint created successfully',
      data: {
        id: result.insertId,
        lotNumber,
        product,
        complaintReport,
        dateOfProduction,
        status: 'report received',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('POST error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to create complaint', details: errorMessage },
      { status: 500 }
    );
  }
}
