
import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
    {
        hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        topic: { type: String, required: true },
        description: { type: String },
        startTime: { type: Date, required: true },
        duration: { type: Number, required: true }, // in minutes
        status: {
            type: String,
            enum: ["SCHEDULED", "LIVE", "ENDED"],
            default: "SCHEDULED",
        },
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

export default mongoose.models.Session || mongoose.model("Session", SessionSchema);
