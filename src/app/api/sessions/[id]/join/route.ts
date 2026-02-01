
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Session from "@/models/Session";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);
        await connectDB();

        const session = await Session.findById(id);
        if (!session) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        // Add user to participants if not already there
        // (Using $addToSet to avoid duplicates)
        await Session.findByIdAndUpdate(id, {
            $addToSet: { participants: payload.userId }
        });

        return NextResponse.json({ message: "Joined session", session }, { status: 200 });

    } catch (error) {
        console.error("Join session error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
