import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  // Force delete the cookie
  cookieStore.set("__session", "", {
    maxAge: -1,
    path: "/",
  });

  return NextResponse.json({ success: true });
}
