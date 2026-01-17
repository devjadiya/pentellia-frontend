import { NextRequest, NextResponse } from "next/server";
import { query } from "@/config/db";
import { adminAuth } from "@/config/firebaseAdmin";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const uid = await getUid();
  if (!uid) return new NextResponse(null, { status: 401 });

  const res = await query("SELECT avatar FROM users WHERE uid = $1", [uid]);

  if (res.rows.length === 0 || !res.rows[0].avatar) {
    return new NextResponse(null, { status: 404 });
  }

  const buffer = res.rows[0].avatar;

  // Return raw image data, browsers handle this natively and fast
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png", // Or detect mime type dynamically
      "Cache-Control": "public, max-age=86400", // Cache it for 24h!
    },
  });
}

// Helper getUid...
async function getUid() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("__session")?.value;
  if (!sessionCookie) return null;
  try {
    return (await adminAuth.verifySessionCookie(sessionCookie, false)).uid;
  } catch {
    return null;
  }
}
