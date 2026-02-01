
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const handleLogout = async () => {
        // Determine which dashboard we are in to show appropriate welcome name if possible?
        // For now just general logout
        // We need an API to clear cookie
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/authpage?mode=login");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-900">EduStream</h1>
                    <Button variant="destructive" onClick={handleLogout} size="sm">
                        Logout
                    </Button>
                </div>
            </header>
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
