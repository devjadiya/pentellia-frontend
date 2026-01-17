// src/app/api/profile/route.ts (or wherever this file is)
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/config/db";
import { adminAuth } from "@/config/firebaseAdmin";
import { cookies } from "next/headers";

async function getUid() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("__session")?.value;
  if (!sessionCookie) return null;
  try {
    // PERFORMANCE FIX: Set checkRevoked to false.
    // This removes the external network call to Firebase on every request.
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, false);
    return decoded.uid;
  } catch (e) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const start = Date.now(); // Debug timing
  const uid = await getUid();

  if (!uid)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // PERFORMANCE FIX: Do NOT select 'avatar' here.
    // Fetching binary blobs converts 50ms queries into 2000ms queries.
    const text = `
      SELECT first_name, last_name, email, company, size, role, country, timezone, verified_domain
      FROM users WHERE uid = $1
    `;
    const res = await query(text, [uid]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const u = res.rows[0];

    // NOTE: If you really need the avatar, create a separate API route: /api/user/avatar
    // Or prefer using a cloud storage URL (S3/Firebase) instead of binary in DB.

    const userData = {
      firstName: u.first_name || "",
      lastName: u.last_name || "",
      email: u.email || "",
      // avatar: "/api/user/avatar", // <--- Load this lazily via <img> tag
      company: u.company || "",
      size: u.size || "",
      role: u.role || "",
      country: u.country || "",
      timezone: u.timezone || "",
      verifiedDomain: u.verified_domain || "",
    };

    console.log(`Profile fetch took: ${Date.now() - start}ms`);
    return NextResponse.json({ success: true, user: userData });
  } catch (error) {
    console.error("Fetch Profile Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
