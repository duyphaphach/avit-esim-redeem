import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  
  if (!code) {
    return NextResponse.json({ error: 'Code is required' }, { status: 400 });
  }

  // MOCK IMPLEMENTATION (since backend is not available yet)
  // Replace with actual fetch to BACKEND_URL
  
  // Simulate network delay
  await new Promise(r => setTimeout(r, 1000));

  if (code.toUpperCase() === 'INVALID999') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (code.toUpperCase() === 'EXPIRED999') {
    return NextResponse.json({ error: 'Expired' }, { status: 410 });
  }

  if (code.toUpperCase() === 'FULL999') {
    return NextResponse.json({
      code: 'FULL999',
      productName: 'Mock Full Japan 10GB/15 Days',
      dateOfUse: '2025-01-01T00:00:00Z',
      total: 3,
      redeemed: 3,
      remaining: 0,
      history: [
        { date: '2024-12-01T10:00:00Z', quantity: 2, email: 'jo***@gmail.com' },
        { date: '2024-12-05T14:30:00Z', quantity: 1, email: 'jo***@gmail.com' }
      ]
    }, { status: 200 });
  }

  // Success mock
  return NextResponse.json({
    code: code.toUpperCase(),
    productName: 'Mock Europe 30GB/30 Days',
    dateOfUse: '2026-12-31T00:00:00Z',
    total: 3,
    redeemed: 1,
    remaining: 2,
    history: [
      { date: '2024-10-15T08:20:00Z', quantity: 1, email: 'te***@example.com' }
    ]
  });
}
