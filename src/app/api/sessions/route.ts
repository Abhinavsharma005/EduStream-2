
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Session from "@/models/Session";
import { jwtVerify } from "jose"; 
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// POST: Create a new session
export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (payload.role !== "teacher") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { topic, description, date, hours, minutes } = await req.json();

        await connectDB();

        // Calculate start time and duration
        const startTime = new Date(date); 
        

        const duration = (parseInt(hours || "0") * 60) + parseInt(minutes || "0");

        const newSession = await Session.create({
            hostId: payload.userId,
            topic,
            description,
            startTime,
            duration,
            status: "SCHEDULED", // Default
        });

        return NextResponse.json({ message: "Session created", session: newSession }, { status: 201 });
    } catch (error: any) {
        console.error("Create session error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// GET: List sessions (Filter by role/user)
export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        // If no token, maybe public access? But dashboard is protected.
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.userId;
        const role = payload.role;

        await connectDB();

        let sessions;

        const url = new URL(req.url);
        const filter = url.searchParams.get("filter"); // live, upcoming, recent, or all

        // Logic for Teacher: "Your Sessions" (all created by them)
        if (role === "teacher") {
            sessions = await Session.find({ hostId: userId }).sort({ startTime: -1 });
        } else {
            // Only show sessions where the student is a participant
            sessions = await Session.find({ participants: userId }).populate("hostId", "name profile").sort({ startTime: -1 });
        }

        return NextResponse.json({ sessions }, { status: 200 });

    } catch (error) {
        console.error("Get sessions error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
