import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const scanActivity = {
    scanActivityStats: [
      { label: 'Scanned assets', current: 3, total: 5 },
      { label: 'Running scans', current: 1, total: 2 },
      { label: 'Waiting scans', current: 0, total: 1 },
    ],
  };

  return NextResponse.json(scanActivity);
}

    