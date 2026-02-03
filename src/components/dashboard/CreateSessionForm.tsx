
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 

const schema = z.object({
    topic: z.string().min(3),
    description: z.string().optional(),
    date: z.string(), 
    hours: z.string().regex(/^\d+$/),
    minutes: z.string().regex(/^\d+$/),
});

type FormData = z.infer<typeof schema>;

export default function CreateSessionForm({ onSessionCreated }: { onSessionCreated: () => void }) {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            hours: "1",
            minutes: "0",
        }
    });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const res = await fetch("/api/sessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                reset();
                onSessionCreated();
            } else {
                alert("Failed to create session");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle className="text-lg">Create new session</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Topic</Label>
                        <Input placeholder="e.g. JavaScript Utils" {...register("topic")} />
                    </div>

                    <div className="space-y-2">
                        <Label>Description (optional)</Label>
                        <Input placeholder="Brief description..." {...register("description")} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Start Time</Label>
                            <Input type="datetime-local" {...register("date")} required />
                        </div>
                        <div className="flex gap-2">
                            <div className="space-y-2 flex-1">
                                <Label>Hours</Label>
                                <Input type="number" min="0" {...register("hours")} />
                            </div>
                            <div className="space-y-2 flex-1">
                                <Label>Minutes</Label>
                                <Input type="number" min="0" max="59" {...register("minutes")} />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                        {loading ? "Creating..." : "Create"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
