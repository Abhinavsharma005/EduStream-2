
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    // Paths that require authentication
    if (pathname.startsWith("/dashboard")) {
        if (!token) {
            return NextResponse.redirect(new URL("/authpage?mode=login", req.url));
        }

        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            const userRole = payload.role as string;

            // Role-based redirection
            if (pathname.startsWith("/dashboard/teacher") && userRole !== "teacher") {
                return NextResponse.redirect(new URL("/dashboard/student", req.url));
            }
            if (pathname.startsWith("/dashboard/student") && userRole !== "student") {
                return NextResponse.redirect(new URL("/dashboard/teacher", req.url));
            }
        } catch (err) {
            // Invalid token
            return NextResponse.redirect(new URL("/authpage?mode=login", req.url));
        }
    }

    // Redirect authenticated users away from auth page
    if (pathname.startsWith("/authpage")) {
        if (token) {
            try {
                const { payload } = await jwtVerify(token, JWT_SECRET);
                const userRole = payload.role as string;
                if (userRole === "teacher") {
                    return NextResponse.redirect(new URL("/dashboard/teacher", req.url));
                } else if (userRole === "student") {
                    return NextResponse.redirect(new URL("/dashboard/student", req.url));
                }
            } catch (err) {
                // Token invalid, let them proceed to auth page
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/authpage"],
};
