
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ExternalLink, Calendar, Copy } from "lucide-react";
import { UserAvatar } from "../UserAvatar";

// Colors from prompt
const CARD_COLORS = [
    "#e5f1ff", // Blueish
    "#d9fced", // Greenish
    "#fff1e5", // Orangeish
    "#f5e5ff", // Purplish
    "#ffe2eb", // Pinkish
    "#fef9ce", // Yellowish
];

export function SessionCard({ session, isTeacher }: { session: any, isTeacher: boolean }) {
    const getRandomColor = (id: string) => {
        const index = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % CARD_COLORS.length;
        return CARD_COLORS[index];
    };

    const bgColor = getRandomColor(session._id);
    const status = session.status === "LIVE" ? "Live" : session.status === "SCHEDULED" ? "Scheduled" : "Ended";

    // Dynamic status check based on time if needed, but using stored status for now.
    // Actually, we should probably compute "Live" if within time window even if status says scheduled?
    // Let's trust the prop for now, or computing it here:
    const now = new Date();
    const start = new Date(session.startTime);
    const end = new Date(start.getTime() + session.duration * 60000);

    let computedStatus = "SCHEDULED";
    // Priority: If time is passed, it is ENDED for students view regardless of DB status (unless manually kept live? No, user strict about duration)
    // Actually, for teacher, they might extend it. But user request specifically asked for auto transition.

    if (now >= end) {
        computedStatus = "ENDED";
    } else if (now >= start) {
        computedStatus = "LIVE";
    } else {
        computedStatus = "SCHEDULED";
    }

    // Fallback/Override if DB says explicitly defined
    if (session.status === "ENDED") computedStatus = "ENDED";

    return (
        <Card
            className="border-0 shadow-sm hover:shadow-md transition-shadow"
            style={{ backgroundColor: bgColor }}
        >
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        {!isTeacher && (
                            <UserAvatar
                                name={session.hostId?.name || "Instructor"}
                                image={(session.hostId as any)?.profile}
                                className="h-8 w-8"
                            />
                        )}
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Instructor</p>
                            <p className="text-sm font-bold text-gray-800 leading-tight">{session.hostId?.name || "You"}</p>
                        </div>
                    </div>
                    {computedStatus === "LIVE" && <Badge variant="destructive" className="animate-pulse">LIVE</Badge>}
                    {computedStatus === "SCHEDULED" && <Badge variant="secondary" className="bg-white/50 text-gray-700">Scheduled</Badge>}
                    {computedStatus === "ENDED" && <Badge variant="outline" className="bg-gray-200/50 text-gray-500">Ended</Badge>}
                </div>
                <CardTitle className="mt-2 text-xl font-bold text-gray-900/80">{session.topic}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-700 mb-4 line-clamp-2">{session.description}</p>
                <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(session.startTime).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({session.duration} min)</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-2 flex justify-between">
                {isTeacher ? (
                    <div className="flex gap-2 w-full">
                        <Button className="flex-1 bg-white/50 text-black hover:bg-white/80" variant="ghost"
                            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/meet/${session._id}`)}>
                            <Copy className="h-4 w-4 mr-2" /> Copy Link
                        </Button>
                        {computedStatus !== "ENDED" && (
                            <Button className="flex-1" onClick={() => window.open(`/meet/${session._id}`, '_blank')}>
                                Open Session
                            </Button>
                        )}
                    </div>
                ) : (
                    <Button
                        className="w-full"
                        disabled={computedStatus === "ENDED" || computedStatus === "SCHEDULED"}
                        variant={computedStatus === "ENDED" ? "secondary" : "default"}
                        onClick={() => computedStatus === "LIVE" && window.open(`/meet/${session._id}`, '_blank')}
                    >
                        {computedStatus === "LIVE" ? "Join Now" : computedStatus === "ENDED" ? "End Session" : "Join (Scheduled)"}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
