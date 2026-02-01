
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Session from "@/models/Session";
import User from "@/models/User"; // Ensure User model is registered

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        // await params is required in Next.js 15+, but let's check version. 16.1.6
        // In Next 15+, params is a promise?
        // "Runtime error: params should be awaited"
        // Safe to await it.
        const { id } = await params;

        const session = await Session.findById(id).populate("hostId", "name");

        if (!session) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        return NextResponse.json({ session }, { status: 200 });
    } catch (error) {
        console.error("Get session error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
