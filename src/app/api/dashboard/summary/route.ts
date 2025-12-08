import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));

  const summaryData = {
    attackSurfaceStats: [
      { label: 'IP Addresses', value: '1,234' },
      { label: 'Hostnames', value: '567' },
      { label: 'Open Ports', value: '8,910' },
      { label: 'Protocols', value: '12' },
      { label: 'Services', value: '345' },
      { label: 'Technologies', value: '67' },
      { label: 'Exposed Assets', value: '89' },
      { label: 'New This Week', value: '13' },
    ],
    vulnerabilitySummary: {
      critical: 45,
      high: 123,
      medium: 345,
      low: 567,
    },
  };

  return NextResponse.json(summaryData);
}

    