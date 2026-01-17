import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json(
      { error: "Missing URL parameter" },
      { status: 400 }
    );
  }

  try {
    // FIX: Request only the first 30KB (approx 3000 lines)
    // This prevents timeouts/crashes on massive files like rockyou.txt
    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Range: "bytes=0-30000", // <--- THE MAGIC FIX
      },
    });

    if (!res.ok && res.status !== 206) {
      // 206 = Partial Content (Success for Range)
      throw new Error(`Upstream Error: ${res.status}`);
    }

    const text = await res.text();

    return new NextResponse(text, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (error: any) {
    console.error("Proxy Error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}
