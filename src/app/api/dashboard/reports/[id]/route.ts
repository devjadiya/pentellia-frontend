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

// GET: Download PDF
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const uid = await getUid();
  if (!uid)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await Promise.resolve(params);

  try {
    // Fetch the BLOB
    const res = await query(
      `SELECT pdf_blob FROM reports WHERE id = $1 AND user_uid = $2`,
      [id, uid]
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const pdfBuffer = res.rows[0].pdf_blob;

    // Return as a downloadable file
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Report_${id.slice(
          0,
          8
        )}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Download Error:", error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}

// DELETE: Remove Report
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const uid = await getUid();
  if (!uid)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await Promise.resolve(params);

  try {
    const res = await query(
      `DELETE FROM reports WHERE id = $1 AND user_uid = $2 RETURNING id`,
      [id, uid]
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
