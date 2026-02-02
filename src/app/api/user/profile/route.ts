
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);

        await connectDB();

        const formData = await req.formData();
        const name = formData.get("name") as string;
        const file = formData.get("file") as File | null;
        const deleteProfile = formData.get("deleteProfile") === "true";

        const updateData: any = {};
        if (name) updateData.name = name;

        if (deleteProfile) {
            updateData.profile = "";
        } else if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Upload via stream
            const uploadResult: any = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "edustream_profiles" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(buffer);
            });

            updateData.profile = uploadResult.secure_url;
        }

        const updatedUser = await User.findByIdAndUpdate(
            payload.userId,
            updateData,
            { new: true }
        ).select("-password");

        return NextResponse.json({ user: updatedUser }, { status: 200 });

    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
