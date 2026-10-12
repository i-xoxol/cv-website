import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    commit: process.env.DEPLOYMENT_COMMIT || 'development',
    release: process.env.DEPLOYMENT_RELEASE || 'development',
  }, { headers: { 'Cache-Control': 'no-store' } });
}
