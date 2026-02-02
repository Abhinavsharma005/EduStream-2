
"use client";

import { useState, useEffect } from "react";
import { SessionCard } from "@/components/dashboard/SessionCard";
import { ProfileMenu } from "@/components/ProfileMenu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Session {
    _id: string;
    topic: string;
    description: string;
    startTime: string;
    duration: number;
    status: string;
    hostId: { name: string };
}

export default function StudentDashboard() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [link, setLink] = useState("");
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        // Fetch User
        fetch("/api/auth/me")
            .then(res => res.json())
            .then(data => {
                if (data.user) setCurrentUser(data.user);
            });

        // Fetch Sessions
        fetch("/api/sessions?filter=all")
            .then(res => res.json())
            .then(data => setSessions(data.sessions || []));
    }, []);

    const now = new Date();

    const liveSessions = sessions.filter(s => {
        const start = new Date(s.startTime);
        const end = new Date(start.getTime() + s.duration * 60000);

        // If manually ended, exclude from Live
        if (s.status === "ENDED") return false;

        // FORCE "Ended" if time is up, even if status says LIVE
        if (now >= end) return false;

        return (now >= start) || s.status === "LIVE";
    });

    const upcomingSessions = sessions.filter(s => {
        const start = new Date(s.startTime);
        // Only future starts
        return now < start && s.status !== "LIVE" && s.status !== "ENDED";
    });

    const recentSessions = sessions.filter(s => {
        const start = new Date(s.startTime);
        const end = new Date(start.getTime() + s.duration * 60000);

        return (now >= end || s.status === "ENDED");
    });

    const revealSession = async () => {
        if (!link) return;
        try {
            // Support full URL or just ID
            const id = link.includes("/meet/") ? link.split("/meet/")[1] : link;
            if (id) {
                // 1. Call Join API to persist in DB
                await fetch(`/api/sessions/${id}/join`, { method: "POST" });

                // 2. Refresh list so it appears in their dashboard
                const res = await fetch("/api/sessions?filter=all");
                const data = await res.json();
                if (data.sessions) setSessions(data.sessions);

                // 3. Open in new tab
                window.open(`/meet/${id}`, "_blank");
            }
        } catch (e) {
            console.error("Failed to join", e);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white dark:bg-[#101828] p-4 rounded-xl shadow-sm border dark:border-gray-800 transition-colors">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {currentUser?.name || "Student"}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome back, get ready to learn!</p>
                </div>
            </div>

            <div className="bg-white dark:bg-[#101828] p-6 rounded-lg shadow-sm border dark:border-gray-800 transition-colors">
                <div className="flex gap-4">
                    <Input
                        placeholder="Enter your session link or ID"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        className="flex-1"
                    />
                    <Button onClick={revealSession} className="bg-blue-600 hover:bg-blue-700">Reveal & Join</Button>
                </div>
            </div>

            {[{ title: "Live Session", data: liveSessions, dotColor: "bg-green-400" },
            { title: "Upcoming Session", data: upcomingSessions, dotColor: "bg-yellow-400" },
            { title: "Recent Session", data: recentSessions, dotColor: "bg-gray-400" }].map((section) => (
                <div key={section.title}>
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`h-2 w-2 rounded-full ${section.dotColor}`} />
                        <h3 className="text-xl font-semibold text-gray-800">{section.title}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {section.data.map(s => (
                            <SessionCard key={s._id} session={s} isTeacher={false} />
                        ))}
                        {section.data.length === 0 && <p className="text-gray-400 text-sm">No sessions.</p>}
                    </div>
                </div>
            ))}
        </div>
    );
}
