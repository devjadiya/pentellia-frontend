import { cookies } from "next/headers";
import { ApiError } from "@/utils/ApiError";
import { adminAuth } from "@/config/firebaseAdmin";

interface AuthUser{
    id : string ;
    email : string;
}

export const authenticate =
    <T>(handler: (user: AuthUser) => Promise<T>) =>
        async () => {
            const token = (await cookies()).get("__session")?.value;

            if (!token) {
                throw new ApiError(401, "Unauthorized");
            }

            const decoded = await adminAuth.verifySessionCookie(token, true);

            const user: AuthUser = {
                id: decoded.uid,
                email: decoded.email!,
            };

            return handler(user);
        };
