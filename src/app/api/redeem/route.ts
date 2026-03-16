import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, quantity, email } = body;

    if (!code || !quantity || !email) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // MOCK IMPLEMENTATION
    // Replace with actual fetch to BACKEND_URL

    await new Promise(r => setTimeout(r, 1500));

    // Generate mock QR codes
    const qrCodes = Array.from({ length: quantity }).map((_, i) => ({
      id: `mock-qr-${Date.now()}-${i}`,
      qrcode: `LPA:1$smdp.plus$mock-activation-code-${Date.now()}-${i}`,
      iccid: `898492233${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`
    }));

    return NextResponse.json({
      success: true,
      qrCodes
    });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
