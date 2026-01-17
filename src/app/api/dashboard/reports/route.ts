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

// GET: Fetch List of Reports (Pagination)
export async function GET(req: NextRequest) {
  const uid = await getUid();
  if (!uid)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  try {
    // 1. Fetch Reports Metadata (JOIN with Scans & Tools)
    // NOTE: We do NOT fetch 'pdf_blob' here to keep the list lightweight
    const text = `
      SELECT 
        r.id, 
        r.created_at, 
        s.target, 
        t.name as tool_name 
      FROM reports r
      JOIN scans s ON r.scan_id = s.id
      LEFT JOIN tools t ON s.tool_id = t.id
      WHERE r.user_uid = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const res = await query(text, [uid, limit, offset]);

    // 2. Get Total Count
    const countRes = await query(
      `SELECT COUNT(*) FROM reports WHERE user_uid = $1`,
      [uid]
    );
    const total = parseInt(countRes.rows[0].count);

    return NextResponse.json({
      success: true,
      reports: res.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Fetch Reports Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST: Save PDF (We already implemented this previously, keeping it here for reference)
export async function POST(req: NextRequest) {
  const uid = await getUid();
  if (!uid)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("pdf") as File;
    const scanId = formData.get("scanId") as string;

    if (!file || !scanId) {
      return NextResponse.json(
        { error: "Missing file or scanId" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const insertQuery = `
      INSERT INTO reports (user_uid, scan_id, pdf_blob)
      VALUES ($1, $2, $3)
      RETURNING id
    `;

    await query(insertQuery, [uid, scanId, buffer]);

    return NextResponse.json({
      success: true,
      message: "Report saved successfully",
    });
  } catch (error) {
    console.error("Save PDF Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
