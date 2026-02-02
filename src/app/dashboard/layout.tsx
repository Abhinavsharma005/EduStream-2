
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

import { useState, useEffect } from "react";
import { ProfileMenu } from "@/components/ProfileMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DashboardFooter } from "@/components/DashboardFooter";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        fetch("/api/auth/me")
            .then(res => res.json())
            .then(data => {
                if (data.user) setCurrentUser(data.user);
            });
    }, []);

    // handleLogout is now handled inside ProfileMenu, but we kept it for safety or if we want to pass it down?
    // ProfileMenu has its own logout logic. We can remove handleLogout here.

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black transition-colors duration-300">
            <header className="bg-white dark:bg-[#101828] shadow-sm sticky top-0 z-10 border-b dark:border-gray-800 transition-colors duration-300">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer transition-colors flex items-center gap-2" onClick={() => router.push("/")}>
                        <GraduationCap className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                        <span>Edu<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">Stream</span></span>
                    </h1>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        {currentUser ? (
                            <ProfileMenu user={currentUser} onUpdate={setCurrentUser} />
                        ) : (
                            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                        )}
                    </div>
                </div>
            </header>
            <main className="flex-1 w-full mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {children}
            </main>
            <DashboardFooter />
        </div>
    );
}
