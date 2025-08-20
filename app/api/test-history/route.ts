// app/api/test-history/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // In a real app, you would fetch this from your database
    const testHistory = [
      {
        id: 'LBS12345',
        testName: 'CBC',
        lab: 'Dr. Lal Path Lab, Sion',
        date: '15 Jan 2024',
        status: 'Pending',
      },
      {
        id: 'LBS12346',
        testName: 'Lipid Panel',
        lab: 'Apollo, Sion',
        date: '28 Feb 2024',
        status: 'Completed',
      },
      {
        id: 'LBS12347',
        testName: 'Urinalysis',
        lab: 'Metropolis, Wadala',
        date: '10 May 2024',
        status: 'Completed',
      },
      {
        id: 'LBS12348',
        testName: 'Thyroid Panel',
        lab: 'True Path, Sion',
        date: '22 Jul 2025',
        status: 'Completed',
      },
      {
        id: 'LBS12349',
        testName: 'Glucose Test',
        lab: 'Pathofarm, Wadala',
        date: '05 Sep 2025',
        status: 'Payment Error',
      },
    ];

    return NextResponse.json({ testHistory });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
