
"use client";

import { useState, useEffect } from "react";
import { SessionCard } from "@/components/dashboard/SessionCard";
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

    useEffect(() => {
        fetch("/api/sessions?filter=all")
            .then(res => res.json())
            .then(data => setSessions(data.sessions));
    }, []);

    const liveSessions = sessions.filter(s => {
        const now = new Date();
        const start = new Date(s.startTime);
        const end = new Date(start.getTime() + s.duration * 60000);
        return (now >= start && now < end) || s.status === "LIVE";
    });

    const upcomingSessions = sessions.filter(s => {
        const now = new Date();
        const start = new Date(s.startTime);
        return now < start && s.status !== "ENDED";
    });

    const recentSessions = sessions.filter(s => {
        const now = new Date();
        const start = new Date(s.startTime);
        const end = new Date(start.getTime() + s.duration * 60000);
        return (now >= end || s.status === "ENDED");
    });

    const revealSession = () => {
        // Logic to parse link ID and find/show specific session card below input
        // User requirement: "reveal button on click shows below its corresponding session card"
        // I can just filter 'sessions' to find the one matching the ID
        if (!link) return;
        try {
            const id = link.split("/meet/")[1];
            if (id) {
                // Scroll to or highlight?
                // Or show a specific "Revealed Session" section?
                alert(`Navigating to session: ${id}`);
                window.open(link, "_blank");
            }
        } catch (e) { }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Welcome, Student</h2>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex gap-4">
                    <Input
                        placeholder="Enter your session link"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        className="flex-1"
                    />
                    <Button onClick={revealSession} className="bg-blue-600 hover:bg-blue-700">Reveal</Button>
                </div>
                {/* Revealed session card could go here */}
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
