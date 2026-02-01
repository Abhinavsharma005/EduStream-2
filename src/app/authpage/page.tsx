
"use client";

import { useSearchParams } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { Suspense } from "react";

function AuthContent() {
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode");

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        EduStream
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Role-based Live Teaching Platform
                    </p>
                </div>
                {mode === "signup" ? <SignupForm /> : <LoginForm />}
            </div>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthContent />
        </Suspense>
    );
}
