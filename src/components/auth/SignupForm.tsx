
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["student", "teacher"]),
});

type FormData = z.infer<typeof schema>;

export default function SignupForm() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { isSubmitting, errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            alert("Signup failed");
            return;
        }

        const result = await res.json();
        router.push(
            result.role === "student"
                ? "/dashboard/student"
                : "/dashboard/teacher"
        );
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Create account</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Full name</Label>
                            <Input placeholder="Enter your name" {...register("name")} />
                        </div>

                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select onValueChange={(v) => setValue("role", v as any)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="student">Student</SelectItem>
                                    <SelectItem value="teacher">Teacher</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input placeholder="Enter your email" {...register("email")} />
                    </div>

                    <div className="space-y-2">
                        <Label>Password</Label>
                        <Input
                            type="password"
                            placeholder="Enter your password"
                            {...register("password")}
                        />
                    </div>

                    <Button className="w-full" disabled={isSubmitting}>
                        Register
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="justify-center text-sm">
                Already have an account?
                <button
                    onClick={() => router.push("/authpage?mode=login")}
                    className="ml-1 text-blue-600 underline"
                >
                    Login
                </button>
            </CardFooter>
        </Card>
    );
}
