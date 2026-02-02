
"use client";

import { useState, useEffect } from "react";
import CreateSessionForm from "@/components/dashboard/CreateSessionForm";
import { SessionCard } from "@/components/dashboard/SessionCard";
import { ProfileMenu } from "@/components/ProfileMenu";

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
    const [currentUser, setCurrentUser] = useState<any>(null);

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
                if (data.user) setCurrentUser(data.user);
            });
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-gradient-to-r 
from-blue-50/90 
via-indigo-50/70 
to-violet-50/80 
dark:from-[#0f172a] 
dark:via-[#1e1b4b] 
dark:to-[#312e81]
 p-4 rounded-xl shadow-sm border dark:border-gray-800 transition-all">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        
                        <span>Welcome, {currentUser?.name || "Teacher"}</span>
                        <span className="text-3xl">🧑‍🏫</span>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your sessions and students</p>
                </div>
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
