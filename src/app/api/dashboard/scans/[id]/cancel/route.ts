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
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const uid = await getUid();
  if (!uid)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await Promise.resolve(params);

  try {
    // 1. Get External Job ID
    const dbRes = await query(
      `SELECT external_job_id FROM scans WHERE id=$1 AND user_uid=$2`,
      [id, uid]
    );
    if (dbRes.rowCount === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const externalId = dbRes.rows[0].external_job_id;

    // 2. Call External Cancel API
    await fetch(`${process.env.TOOLS_BASE_URL}/cancel/${externalId}`, {
      method: "POST",
      headers: { "X-API-Key": process.env.TOOLS_API_KEY || "" },
    });

    // 3. Update DB Status
    await query(`UPDATE scans SET status='cancelled' WHERE id=$1`, [id]);

    return NextResponse.json({ success: true, message: "Job cancelled" });
  } catch (error) {
    return NextResponse.json({ error: "Cancel failed" }, { status: 500 });
  }
}
