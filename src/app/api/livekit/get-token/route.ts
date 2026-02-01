
import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const room = req.nextUrl.searchParams.get("room");
    const username = req.nextUrl.searchParams.get("username");

    if (!room) {
        return NextResponse.json(
            { error: 'Missing "room" query parameter' },
            { status: 400 }
        );
    }
    if (!username) {
        return NextResponse.json(
            { error: 'Missing "username" query parameter' },
            { status: 400 }
        );
    }

    try {
        // Support both Next.js public naming and standard LiveKit naming
        const apiKey = process.env.LIVEKIT_API_KEY;
        const apiSecret = process.env.LIVEKIT_API_SECRET;
        const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || process.env.LIVEKIT_URL;

        console.log("Debug: Generating LiveKit Token");
        console.log("Debug: Room:", room, "Username:", username);
        console.log("Debug: Keys present - API Key:", !!apiKey, "Secret:", !!apiSecret, "URL:", !!wsUrl);

        if (!apiKey || !apiSecret || !wsUrl) {
            console.error("Error: Missing LiveKit Environment Variables");
            console.error(`Status: API_KEY=${!!apiKey}, API_SECRET=${!!apiSecret}, URL=${!!wsUrl}`);
            return NextResponse.json(
                { error: "Server misconfigured: Missing LiveKit keys" },
                { status: 500 }
            );
        }

        const at = new AccessToken(apiKey, apiSecret, { identity: username });

        // Determine Role Permissions
        // Ideally, the frontend should verify auth status, but here we can check if username *looks* like a teacher 
        // or rely on a "role" query param if we added it. 
        // For now, let's assume "Teacher" in name => Teacher.
        // A more robust way would be to fetch the user from DB here using a session cookie, but for now:
        const isTeacher = username.toLowerCase().includes("teacher");

        at.addGrant({
            roomJoin: true,
            room: room,
            canPublish: isTeacher,
            canSubscribe: true,
            canPublishData: true
        });

        const token = await at.toJwt();
        console.log(`Debug: Token generated for ${username} (Teacher? ${isTeacher})`);

        return NextResponse.json({ token, serverUrl: wsUrl });
    } catch (error) {
        console.error("Error generating LiveKit token:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
