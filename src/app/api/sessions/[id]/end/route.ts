
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Session from "@/models/Session";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// POST: End a session
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);

        // Extra check: Only teacher can end session
        if (payload.role !== "teacher") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await connectDB();

        // Verify host owns this session
        const session = await Session.findOne({ _id: id, hostId: payload.userId });
        if (!session) {
            return NextResponse.json({ error: "Session not found or not authorized" }, { status: 404 });
        }

        session.status = "ENDED";
        await session.save();

        return NextResponse.json({ message: "Session ended successfully" }, { status: 200 });

    } catch (error) {
        console.error("End session error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
