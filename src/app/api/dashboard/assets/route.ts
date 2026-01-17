import { NextRequest, NextResponse } from "next/server";
import { query } from "@/config/db";
import { adminAuth } from "@/config/firebaseAdmin";
import { cookies } from "next/headers";

// Helper: Get Current User UID from Session
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

// GET: Fetch Assets (Pagination implemented)
export async function GET(req: NextRequest) {
  const uid = await getUid();
  if (!uid)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  try {
    // 1. Get Assets
    const assetsQuery = `
      SELECT * FROM assets 
      WHERE user_uid = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;
    const assetsRes = await query(assetsQuery, [uid, limit, offset]);

    // 2. Get Total Count (for pagination UI)
    const countQuery = `SELECT COUNT(*) FROM assets WHERE user_uid = $1`;
    const countRes = await query(countQuery, [uid]);
    const totalAssets = parseInt(countRes.rows[0].count);

    return NextResponse.json({
      success: true,
      assets: assetsRes.rows,
      pagination: {
        page,
        limit,
        totalAssets,
        totalPages: Math.ceil(totalAssets / limit),
      },
    });
  } catch (error) {
    console.error("Fetch Assets Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch assets" },
      { status: 500 }
    );
  }
}

// POST: Create New Asset
export async function POST(req: NextRequest) {
  const uid = await getUid();
  if (!uid)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, endpoint, context, type } = body;

    // Validation
    if (!name || !endpoint || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const text = `
      INSERT INTO assets (user_uid, name, endpoint, context, type, risk_level, status)
      VALUES ($1, $2, $3, $4, $5, 'Low', 'Active')
      RETURNING *
    `;

    const values = [uid, name, endpoint, context || "", type];
    const res = await query(text, values);

    return NextResponse.json({ success: true, asset: res.rows[0] });
  } catch (error) {
    console.error("Create Asset Error:", error);
    return NextResponse.json(
      { error: "Failed to create asset" },
      { status: 500 }
    );
  }
}

// ... existing imports (NextRequest, NextResponse, query, getUid, etc.)

// DELETE: Remove an asset (Using Query Params)
export async function DELETE(req: NextRequest) {
  const uid = await getUid();
  if (!uid)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // FIX: Get ID from the URL query string (?id=...) instead of params
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Asset ID is required" },
      { status: 400 }
    );
  }

  try {
    // Security: Filter by ID and User UID
    const text = `DELETE FROM assets WHERE id = $1 AND user_uid = $2 RETURNING *`;
    const res = await query(text, [id, uid]);

    if (res.rowCount === 0) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Asset deleted" });
  } catch (error) {
    console.error("Delete Asset Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT: Update an asset
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const uid = await getUid();
  if (!uid)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await Promise.resolve(params);

  try {
    const body = await req.json();

    // Whitelist allowed fields to prevent arbitrary updates
    const allowedFields = [
      "name",
      "endpoint",
      "context",
      "type",
      "risk_level",
      "status",
    ];
    const updates: string[] = [];
    const values: any[] = [];
    let counter = 1;

    // Dynamically build query
    for (const key of Object.keys(body)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = $${counter}`);
        values.push(body[key]);
        counter++;
      }
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    // Add ID and UID to values for the WHERE clause
    values.push(id);
    values.push(uid);

    const text = `
      UPDATE assets 
      SET ${updates.join(", ")}, last_scan = NOW() 
      WHERE id = $${counter} AND user_uid = $${counter + 1}
      RETURNING *
    `;

    const res = await query(text, values);

    if (res.rowCount === 0) {
      return NextResponse.json(
        { error: "Asset not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, asset: res.rows[0] });
  } catch (error) {
    console.error("Update Asset Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
