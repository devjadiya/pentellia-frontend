import { NextRequest, NextResponse } from "next/server";
import { query } from "@/config/db";
import { adminAuth } from "@/config/firebaseAdmin";
import { cookies } from "next/headers";

async function getUid() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("__session")?.value;
  if (!sessionCookie) return null;
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decoded.uid;
  } catch (e) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const uid = await getUid();
  if (!uid)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Fetch last 20 logins
    const text = `
      SELECT id, ip_address, location, user_agent, login_at
      FROM login_history
      WHERE user_uid = $1
      ORDER BY login_at DESC
      LIMIT 20
    `;

    const res = await query(text, [uid]);

    return NextResponse.json({ success: true, history: res.rows });
  } catch (error) {
    console.error("Fetch History Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
