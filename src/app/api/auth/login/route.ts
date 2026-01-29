import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/config/firebaseAdmin";
import { UserService } from "@/services/user.service";
import { cookies } from "next/headers";

const userService = new UserService();

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    // 1. Verify Token
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // 2. Parse User Data
    const fullName = decodedToken.name || "";
    const [firstName, ...lastNameParts] = fullName.split(" ");
    const lastName = lastNameParts.join(" ");

    const userData = {
      uid: decodedToken.uid,
      email: decodedToken.email!,
      firstName: firstName || "",
      lastName: lastName || "",
      avatar: decodedToken.picture,
    };

    // 3. Extract Location Data (Headers for Vercel/Proxies)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "";

    // Attempt to get Geo data from headers (Works on Vercel/Cloudflare)
    const country =
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("cf-ipcountry") ||
      undefined;
    const city = req.headers.get("x-vercel-ip-city") || undefined;
    const timezone = req.headers.get("x-vercel-ip-timezone") || undefined;

    const locationData = { ip, country, city, timezone, userAgent };

    // 4. Sync User (Updates Country/Timezone)
    await userService.syncUser(userData, locationData);

    // 5. Log History (Async, non-blocking)
    // We don't await this to speed up the response
    userService
      .logLoginHistory(userData.uid, locationData)
      .catch(console.error);

    // 6. Create Session
    const expiresIn = 60 * 60 * 24 * 7 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    const cookieStore = await cookies();
    cookieStore.set("__session", sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
