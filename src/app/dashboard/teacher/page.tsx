
"use client";

import { useState, useEffect } from "react";
import CreateSessionForm from "@/components/dashboard/CreateSessionForm";
import { SessionCard } from "@/components/dashboard/SessionCard";

interface Session {
    _id: string;
    topic: string;
    description: string;
    startTime: string;
    duration: number;
    status: string;
    hostId: { name: string } | string;
}

export default function TeacherDashboard() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [userName, setUserName] = useState("Teacher");

    const fetchSessions = async () => {
        const res = await fetch("/api/sessions?filter=all");
        if (res.ok) {
            const data = await res.json();
            setSessions(data.sessions);
        }
    };

    useEffect(() => {
        fetchSessions();
        fetch("/api/auth/me")
            .then(res => res.json())
            .then(data => {
                if (data.user) setUserName(data.user.name);
            });
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Welcome, {userName}</h2>
            </div>

            <CreateSessionForm onSessionCreated={fetchSessions} />

            <div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-2 w-2 rounded-full bg-teal-400" />
                    <h3 className="text-xl font-semibold text-gray-800">Your sessions</h3>
                </div>

                {sessions.length === 0 ? (
                    <p className="text-gray-500">No sessions created yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sessions.map((session) => (
                            <SessionCard key={session._id} session={session} isTeacher={true} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
