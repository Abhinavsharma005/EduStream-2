
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Video, VideoOff, MonitorUp, LogOut, Loader2, Users, MessageSquare, BarChart2, HelpCircle } from "lucide-react";
import { PollView } from "@/components/meet/PollView";
import { QuizView } from "@/components/meet/QuizView";
import { cn } from "@/lib/utils";

import {
    LiveKitRoom,
    RoomAudioRenderer,
    useLocalParticipant,
    useTracks,
    ParticipantTile,
    useConnectionState,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";

interface Message {
    sender: string;
    text: string;
    time: string;
    isSelf: boolean;
}

export default function MeetPage() {
    const { id: rawRoomId } = useParams();
    const roomId = Array.isArray(rawRoomId) ? rawRoomId[0] : rawRoomId;
    const router = useRouter();

    // Chat State

    // ... State ... (Partial replacement would be tricky, replacing component body or large chunk)
    // I will replace the component logic carefully.

    // ... inside MeetPage ...
    const [activeTab, setActiveTab] = useState<"chat" | "poll" | "quiz">("chat");
    const [polls, setPolls] = useState<any[]>([]); // Define Type properly ideally
    const [quizzes, setQuizzes] = useState<any[]>([]);

    // Unread counts (red dots)
    const [unread, setUnread] = useState({ chat: 0, poll: 0, quiz: 0 });

    // ... inside connectSocket ... 
    // Need to insert listeners.

    // ... inside render ... 
    // Sidebar structure replacement.

    // Let's do it in chunks.

    // Chunk 1: State injection
    // Chunk 2: Listener injection
    // Chunk 3: Render replacement

    // I will return to task loop to do this via multi_replace or sequential, 
    // but the Prompt here is strictly asking for ReplaceFileContent.
    // I will assume I can do large replace.

    // Actually, I can use `multi_replace_file_content` again which is safer.
    // I will cancel this call and use `multi_replace_file_content` in next step.

    // WAIT, I must return SOMETHING or error. 
    // I will just return the State Injection here to start.
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMsg, setInputMsg] = useState("");
    const [participantCount, setParticipantCount] = useState(0);

    // LiveKit State
    const [token, setToken] = useState("");
    const [serverUrl, setServerUrl] = useState(process.env.NEXT_PUBLIC_LIVEKIT_URL || "");
    const [user, setUser] = useState<{ id: string, name: string, role: string } | null>(null);

    useEffect(() => {
        // 1. Fetch User Identity
        fetch("/api/auth/me")
            .then(res => res.json())
            .then(userData => {
                if (userData.user) {
                    setUser({ id: userData.user._id, name: userData.user.name, role: userData.user.role });

                    // 2. Session check (optional but good)
                    fetch(`/api/sessions/${roomId}`)
                        .then(res => res.json())
                        .then(sessionData => {
                            if (sessionData.session) {
                                // 3. Get LiveKit Token
                                fetch(`/api/livekit/get-token?room=${roomId}&username=${userData.user.name}`)
                                    .then(res => res.json())
                                    .then(data => {
                                        setToken(data.token);
                                        if (data.serverUrl) setServerUrl(data.serverUrl);
                                    });

                                // 4. Connect Chat Socket
                                connectSocket(userData.user._id, userData.user.name, roomId as string);
                            }
                        });
                } else {
                    router.push("/authpage?mode=login");
                }
            })
            .catch(() => router.push("/authpage?mode=login"));

        return () => {
            if (socket) socket.disconnect();
        };
    }, [roomId, router]);

    const connectSocket = (userId: string, userName: string, rId: string) => {
        const newSocket = io({
            path: "/socket.io",
        });

        setSocket(newSocket);
        newSocket.emit("join-room", rId, userId);

        newSocket.on("update-participant-count", (count: number) => {
            setParticipantCount(count);
        });

        // --- Poll & Quiz Listeners ---
        newSocket.on("sync-room-state", (data: { polls: any[], quizzes: any[] }) => {
            setPolls(data.polls || []);
            setQuizzes(data.quizzes || []);
        });

        newSocket.on("new-poll", (poll: any) => {
            setPolls(prev => [...prev, poll]);
            if (activeTab !== "poll") setUnread(prev => ({ ...prev, poll: prev.poll + 1 }));
        });

        newSocket.on("update-poll-results", (data: { poll: any }) => {
            setPolls(prev => prev.map(p => p.id === data.poll.id ? data.poll : p));
        });

        newSocket.on("new-quiz", (quiz: any) => {
            setQuizzes(prev => [...prev, quiz]);
            if (activeTab !== "quiz") setUnread(prev => ({ ...prev, quiz: prev.quiz + 1 }));
        });

        newSocket.on("update-quiz-results", (data: { quizId: string, answers: any }) => {
            setQuizzes(prev => prev.map(q => q.id === data.quizId ? { ...q, answers: data.answers } : q));
            // Optional: if teacher, maybe show dot? 
        });

        newSocket.on("new-message", (data: any) => {
            setMessages((prev) => [...prev, {
                sender: data.sender || "Unknown",
                text: data.message,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isSelf: data.senderId === userId
            }]);
            if (activeTab !== "chat") setUnread(prev => ({ ...prev, chat: prev.chat + 1 }));
        });
    };

    const sendMessage = () => {
        if (!inputMsg.trim() || !socket || !user) return;
        socket.emit("send-message", {
            roomId,
            message: inputMsg,
            sender: user.name,
            senderId: user.id
        });
        setInputMsg("");
    };

    const endSession = async () => {
        if (confirm("Are you sure you want to end this session for everyone? Passcode: END")) {
            // Verify intent (simple confirm is OK for now)
            try {
                await fetch(`/api/sessions/${roomId}/end`, { method: "POST" });
                // Disconnect socket/livekit if needed, but router push is usually enough
                if (socket) socket.disconnect();
                router.push("/dashboard/teacher");
            } catch (e) {
                console.error("Failed to end session", e);
                alert("Failed to end session");
            }
        }
    };

    const leaveSession = () => {
        if (user?.role === "teacher") router.push("/dashboard/teacher");
        else router.push("/dashboard/student");
    };

    if (!user || !token || !serverUrl) return <div className="flex h-screen items-center justify-center text-white bg-black">Loading Session...</div>;

    const isTeacher = user.role === "teacher";

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
            <LiveKitRoom
                video={isTeacher}
                audio={isTeacher}
                token={token}
                serverUrl={serverUrl}
                data-lk-theme="default"
                className="flex-1 flex flex-col relative"
                onDisconnected={leaveSession}
            >
                <div className="flex-1 flex flex-col relative">
                    {/* Main Video Area */}
                    <div className="flex-1 relative bg-gray-900 flex items-center justify-center p-4">
                        <VideoLayout isTeacher={isTeacher} />
                        <RoomAudioRenderer />

                        {/* Connection Status Badge */}
                        <div className="absolute top-4 left-4 bg-black/50 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 z-50 backdrop-blur-sm border border-white/10">
                            <ConnectionStatusIndicator />
                        </div>
                    </div>

                    {/* Custom Controls */}
                    <CustomControlBar isTeacher={isTeacher} onLeave={leaveSession} onEndSession={endSession} />
                </div>
            </LiveKitRoom>

            {/* Sidebar Tabs */}
            <div className="w-80 bg-gray-950 border-l border-gray-800 flex flex-col z-50 transition-all duration-300">
                {/* Tab Headers */}
                <div className="flex border-b border-gray-800 bg-gray-900/50">
                    <button
                        onClick={() => { setActiveTab("chat"); setUnread(p => ({ ...p, chat: 0 })); }}
                        className={`flex-1 p-3 flex justify-center items-center relative transition-colors ${activeTab === "chat" ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/5' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}`}
                    >
                        <MessageSquare className="h-5 w-5" />
                        {unread.chat > 0 && <span className="absolute top-2 right-6 h-2 w-2 rounded-full bg-red-500 animate-pulse ring-2 ring-gray-900" />}
                    </button>
                    <button
                        onClick={() => { setActiveTab("quiz"); setUnread(p => ({ ...p, quiz: 0 })); }}
                        className={`flex-1 p-3 flex justify-center items-center relative transition-colors ${activeTab === "quiz" ? 'text-purple-400 border-b-2 border-purple-500 bg-purple-500/5' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}`}
                    >
                        <HelpCircle className="h-5 w-5" />
                        {unread.quiz > 0 && <span className="absolute top-2 right-6 h-2 w-2 rounded-full bg-red-500 animate-pulse ring-2 ring-gray-900" />}
                    </button>
                    <button
                        onClick={() => { setActiveTab("poll"); setUnread(p => ({ ...p, poll: 0 })); }}
                        className={`flex-1 p-3 flex justify-center items-center relative transition-colors ${activeTab === "poll" ? 'text-green-400 border-b-2 border-green-500 bg-green-500/5' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}`}
                    >
                        <BarChart2 className="h-5 w-5" />
                        {unread.poll > 0 && <span className="absolute top-2 right-6 h-2 w-2 rounded-full bg-red-500 animate-pulse ring-2 ring-gray-900" />}
                    </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden relative">
                    {/* Chat View */}
                    <div className={cn("absolute inset-0 flex flex-col transition-transform duration-300", activeTab === "chat" ? "translate-x-0" : activeTab === "quiz" ? "-translate-x-full" : "-translate-x-full")}>
                        <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-gray-900/30">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-xs tracking-wide uppercase text-gray-400">Live Chat</h3>
                                <div className="flex items-center gap-1.5 ml-2 bg-gray-800 px-2 py-0.5 rounded-full text-[10px] text-gray-400 border border-gray-700">
                                    <Users className="h-3 w-3" />
                                    <span>{participantCount}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 && <div className="flex flex-col items-center justify-center h-full text-gray-600 text-sm gap-2 opacity-50">
                                <MessageSquare className="h-8 w-8" />
                                <p>No messages yet</p>
                            </div>}
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                                    <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${msg.isSelf ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
                                        {!msg.isSelf && <p className="text-[10px] font-bold mb-1 opacity-70 uppercase tracking-wider text-blue-300">{msg.sender}</p>}
                                        <p className="leading-snug">{msg.text}</p>
                                    </div>
                                    <span className="text-[10px] text-gray-500 mt-1 px-1">{msg.time}</span>
                                </div>
                            ))}
                        </div>

                        <div className="p-3 border-t border-gray-800 bg-gray-900/50">
                            <div className="flex gap-2 relative">
                                <Input
                                    value={inputMsg}
                                    onChange={e => setInputMsg(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                    placeholder="Type a message..."
                                    className="bg-gray-800 border-gray-700 text-white focus:ring-blue-500 rounded-full pl-4 pr-10 h-10 text-sm"
                                />
                                <Button onClick={sendMessage} size="icon" className="absolute right-1 top-1 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-500 transition-all">
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="ml-0.5"><path d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.7517L3.06812 6.0317C3.1575 6.18469 3.32057 6.27972 3.5 6.27972H7.5C7.77614 6.27972 8 6.50358 8 6.77972C8 7.05586 7.77614 7.27972 7.5 7.27972H3.5C3.32057 7.27972 3.1575 7.37475 3.06812 7.52775L0.568117 11.8077C0.458794 11.9949 0.482813 12.2314 0.627577 12.393C0.772341 12.5546 1.00481 12.6044 1.20308 12.5163L14.2031 6.73632C14.408 6.64523 14.5424 6.44465 14.5424 6.21972C14.5424 5.99479 14.408 5.79421 14.2031 5.70312L1.20308 1.04312Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Quiz View */}
                    <div className={cn("absolute inset-0 transition-transform duration-300 bg-gray-950", activeTab === "quiz" ? "translate-x-0" : activeTab === "chat" ? "translate-x-full" : "-translate-x-full")}>
                        <QuizView
                            quizzes={quizzes}
                            isTeacher={isTeacher}
                            onCreateQuiz={(q, o, c) => socket?.emit("create-quiz", { roomId, question: q, options: o, correctIndex: c })}
                            onAnswer={(qid, oid) => socket?.emit("answer-quiz", { roomId, quizId: qid, optionIndex: oid, studentName: user?.name })}
                        />
                    </div>

                    {/* Poll View */}
                    <div className={cn("absolute inset-0 transition-transform duration-300 bg-gray-950", activeTab === "poll" ? "translate-x-0" : "translate-x-full")}>
                        <PollView
                            polls={polls}
                            isTeacher={isTeacher}
                            onCreatePoll={(q, o) => socket?.emit("create-poll", { roomId, question: q, options: o })}
                            onVote={(pid, oid) => socket?.emit("vote-poll", { roomId, pollId: pid, optionIndex: oid })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function VideoLayout({ isTeacher }: { isTeacher: boolean }) {
    // UseTracks logic:
    // We request all camera and screen share tracks.
    // We do NOT filter by subscription because we want to see local tracks if we are the teacher.
    const tracks = useTracks(
        [Track.Source.Camera, Track.Source.ScreenShare],
        { onlySubscribed: false }
    );

    // LOGIC FIX:
    // We want to show the "active" presentation or speaker.
    // Prioritize Screen Share. Then Camera.
    // Since we enforced permissions on the backend, only the teacher has tracks.
    // So any track we find is valid to show.

    const videoTrack = tracks.find(t => t.source === Track.Source.ScreenShare) ||
        tracks.find(t => t.source === Track.Source.Camera);

    return (
        <div className="w-full h-full flex items-center justify-center">
            {videoTrack ? (
                <div className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-800 bg-black relative group">
                    <ParticipantTile
                        trackRef={videoTrack}
                        className="w-full h-full object-cover"
                        disableSpeakingIndicator={true}
                    />
                    {/* Overlay Name */}
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-sm font-medium text-white/90">
                        {videoTrack.participant.name || videoTrack.participant.identity}
                        {videoTrack.source === Track.Source.ScreenShare && " (Screen)"}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-gray-500 gap-4">
                    <div className="h-24 w-24 rounded-full bg-gray-800 flex items-center justify-center animate-pulse">
                        <Video className="h-8 w-8 opacity-50" />
                    </div>
                    <p>Waiting for teacher's stream...</p>
                </div>
            )}
        </div>
    );
}

function ConnectionStatusIndicator() {
    const connectionState = useConnectionState();

    if (connectionState === "connected") {
        return <><span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> LIVE</>;
    } else if (connectionState === "connecting" || connectionState === "reconnecting") {
        return <><Loader2 className="h-3 w-3 animate-spin text-yellow-500" /> Connecting...</>;
    } else {
        return <><span className="h-2 w-2 rounded-full bg-gray-500" /> {connectionState}</>;
    }
}

function CustomControlBar({ isTeacher, onLeave, onEndSession }: { isTeacher: boolean, onLeave: () => void, onEndSession?: () => void }) {
    const { localParticipant } = useLocalParticipant();

    // We maintain local state for UI responsiveness, but ultimately control via localParticipant
    const [micOn, setMicOn] = useState(false);
    const [camOn, setCamOn] = useState(false);
    const [screenOn, setScreenOn] = useState(false);

    useEffect(() => {
        if (!localParticipant) return;

        // Sync initial state
        setMicOn(localParticipant.isMicrophoneEnabled);
        setCamOn(localParticipant.isCameraEnabled);
        setScreenOn(localParticipant.isScreenShareEnabled);

        // Listen for track changes (optional, but good for robust sync)
        // Note: For production use, useTrackMuted events are better, but basic state sync on render/action is okay for now.
    }, [localParticipant]);

    const toggleMic = async () => {
        if (!localParticipant) return;
        const newState = !micOn;
        try {
            await localParticipant.setMicrophoneEnabled(newState);
            setMicOn(newState);
        } catch (e) {
            console.error(e);
        }
    };

    const toggleCam = async () => {
        if (!localParticipant) return;
        const newState = !camOn;
        try {
            await localParticipant.setCameraEnabled(newState);
            setCamOn(newState);
        } catch (e) {
            console.error(e);
        }
    };

    const toggleScreen = async () => {
        if (!localParticipant) return;
        const newState = !screenOn;
        try {
            await localParticipant.setScreenShareEnabled(newState);
            setScreenOn(newState);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="h-20 flex justify-center items-center gap-6 bg-gray-950 border-t border-gray-800">
            {isTeacher ? (
                <>
                    <Button
                        variant={micOn ? "secondary" : "destructive"}
                        size="icon"
                        onClick={toggleMic}
                        className={`rounded-full h-14 w-14 transition-all duration-200 ${micOn ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                        {micOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                    </Button>
                    <Button
                        variant={camOn ? "secondary" : "destructive"}
                        size="icon"
                        onClick={toggleCam}
                        className={`rounded-full h-14 w-14 transition-all duration-200 ${camOn ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                        {camOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                    </Button>
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={toggleScreen}
                        className={`rounded-full h-14 w-14 transition-all duration-200 ${screenOn ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white'}`}
                    >
                        <MonitorUp className="h-6 w-6" />
                    </Button>
                    <div className="w-px h-8 bg-gray-800 mx-2" />

                    {/* LEAVE BUTTON */}
                    <Button variant="ghost" className="px-6 rounded-full h-12 font-medium text-gray-300 hover:text-white hover:bg-gray-800" onClick={onLeave}>
                        <LogOut className="mr-2 h-5 w-5" /> Leave
                    </Button>

                    {/* END SESSION BUTTON */}
                    <Button variant="destructive" className="px-8 rounded-full h-12 font-medium bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/20" onClick={onEndSession}>
                        End Session
                    </Button>
                </>
            ) : (
                <div className="flex items-center gap-4">
                    <div className="text-gray-500 text-sm flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-full">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                        </span>
                        Viewing as Student
                    </div>
                    <Button variant="secondary" className="px-6 rounded-full h-10 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors border border-gray-700/50" onClick={onLeave}>
                        <LogOut className="mr-2 h-4 w-4" /> Leave
                    </Button>
                </div>
            )}
        </div>
    );
}
