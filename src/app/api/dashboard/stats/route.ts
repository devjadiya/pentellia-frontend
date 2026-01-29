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
    // 1. ASSET COUNTS
    const assetsCountRes = await query(
      `SELECT COUNT(*) FROM assets WHERE user_uid = $1`,
      [uid]
    );
    const totalAssets = parseInt(assetsCountRes.rows[0].count || "0");

    // 2. SCAN COUNTS
    const totalScansRes = await query(
      `SELECT COUNT(*) FROM scans WHERE user_uid = $1`,
      [uid]
    );
    const totalScans = parseInt(totalScansRes.rows[0].count || "0");

    // 3. ACTIVE SCANS (Running/Queued)
    const activeScansRes = await query(
      `SELECT COUNT(*) FROM scans WHERE user_uid = $1 AND status IN ('running', 'queued')`,
      [uid]
    );
    const activeScans = parseInt(activeScansRes.rows[0].count || "0");

    // 4. FAILED SCANS (Last 24h)
    const failedScansRes = await query(
      `SELECT COUNT(*) FROM scans WHERE user_uid = $1 AND status = 'failed' AND created_at > NOW() - INTERVAL '24 HOURS'`,
      [uid]
    );
    const failedScans24h = parseInt(failedScansRes.rows[0].count || "0");

    // 5. RECENT SCANS LIST
    const recentScansRes = await query(
      `
      SELECT s.id, s.target, s.status, s.created_at, t.name as tool_name, t.id as tool_id
      FROM scans s 
      LEFT JOIN tools t ON s.tool_id = t.id
      WHERE s.user_uid = $1 
      ORDER BY s.created_at DESC 
      LIMIT 5
    `,
      [uid]
    );

    // 6. REAL CHART DATA (Scans per Day)
    // Since we don't have a 'findings' table yet, we will graph "Scans Performed" instead of "Vulnerabilities"
    // so the chart shows real activity.
    const scansTrendRes = await query(
      `
      SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as date, COUNT(*) as count
      FROM scans
      WHERE user_uid = $1 AND created_at > NOW() - INTERVAL '7 DAYS'
      GROUP BY date
      ORDER BY date ASC
    `,
      [uid]
    );

    const exposureTrend = scansTrendRes.rows.map((row) => ({
      date: row.date,
      scans: parseInt(row.count),
    }));

    return NextResponse.json({
      success: true,
      kpi: {
        totalAssets,
        totalScans,
        activeScans,
        failedScans24h,
        // Set these to 0 for now as we don't have a 'findings' table to count them yet
        openCritical: 0,
        openHigh: 0,
      },
      charts: {
        exposureTrend, // Shows Scans per day (Real Data)
        findingsTrend: [], // Empty until finding storage is implemented
      },
      recentScans: recentScansRes.rows,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
