import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

// GET: Fetch all complaints from the reports table
export async function GET() {
  try {
    const [rows] = await pool.query(
      `
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
      `
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'No complaints found' }, { status: 404 });
    }

    return NextResponse.json(rows);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('GET error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to fetch complaints', details: errorMessage },
      { status: 500 }
    );
  }
}

// POST: Insert a new complaint into the reports table
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, email, lotNumber, product, complaintReport, dateOfProduction } = body;

    // Validate required fields
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

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const query = `
      INSERT INTO reports (lot_number, report_type, description, report_date, status)
      VALUES (?, 'CCR', ?, ?, 'report received')
    `;
    const values = [lotNumber, complaintReport, dateOfProduction];

    const [result]: any = await pool.query(query, values);

    if (!result?.insertId) {
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('POST error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to create complaint', details: errorMessage },
      { status: 500 }
    );
  }
}
