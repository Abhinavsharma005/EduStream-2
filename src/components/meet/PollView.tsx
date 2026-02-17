
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Check, BarChart3 } from "lucide-react";

interface PollOption {
    text: string;
    votes: number;
}

interface Poll {
    id: string;
    question: string;
    options: PollOption[];
    active: boolean;
}

interface PollViewProps {
    polls: Poll[];
    isTeacher: boolean;
    onCreatePoll: (question: string, options: string[]) => void;
    onVote: (pollId: string, optionIndex: number) => void;
}

export function PollView({ polls, isTeacher, onCreatePoll, onVote }: PollViewProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [votedPolls, setVotedPolls] = useState<Set<string>>(new Set());

    const addOption = () => setOptions([...options, ""]);
    const updateOption = (idx: number, txt: string) => {
        const newOpts = [...options];
        newOpts[idx] = txt;
        setOptions(newOpts);
    };

    const handleCreate = () => {
        const validOptions = options.filter(o => o.trim());
        if (question.trim() && validOptions.length >= 2) {
            onCreatePoll(question, validOptions);
            setIsCreating(false);
            setQuestion("");
            setOptions(["", ""]);
        }
    };

    const handleVote = (pollId: string, idx: number) => {
        if (votedPolls.has(pollId)) return;
        onVote(pollId, idx);
        setVotedPolls(prev => new Set(prev).add(pollId));
    };

    return (
        <div className="h-full flex flex-col p-4 space-y-4 overflow-y-auto">
            {isTeacher && !isCreating && (
                <Button onClick={() => setIsCreating(true)} className="w-full bg-green-600 hover:bg-green-500">
                    <Plus className="mr-2 h-4 w-4" /> Create New Poll
                </Button>
            )}

            {isCreating && (
                <Card className="bg-gray-800 border-gray-700 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">New Poll</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Input
                            placeholder="Poll Question"
                            className="bg-gray-900 border-gray-600"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        {options.map((opt, idx) => (
                            <Input
                                key={idx}
                                placeholder={`Option ${idx + 1}`}
                                className="bg-gray-900 border-gray-600 h-8 text-sm"
                                value={opt}
                                onChange={(e) => updateOption(idx, e.target.value)}
                            />
                        ))}
                        <Button variant="outline" size="sm" onClick={addOption} className="w-full border-dashed border-gray-600 text-gray-400 hover:text-white hover:bg-gray-800">
                            + Add Option
                        </Button>
                        <div className="flex gap-2 pt-2">
                            <Button size="sm" variant="ghost" className="flex-1" onClick={() => setIsCreating(false)}>Cancel</Button>
                            <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-500" onClick={handleCreate}>Launch</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-4">
                {polls.slice().reverse().map((poll) => {
                    const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0);
                    const hasVoted = votedPolls.has(poll.id);

                    return (
                        <Card key={poll.id} className="bg-gray-800 border-gray-700 text-white">
                            <CardHeader className="pb-2 pt-4">
                                <CardTitle className="text-base leading-tight">{poll.question}</CardTitle>
                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                    <BarChart3 className="h-3 w-3" /> {totalVotes} votes
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {poll.options.map((opt, idx) => {
                                    const percent = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                                    return (
                                        <div key={idx} className="space-y-1">
                                            <div
                                                className={`relative rounded-md overflow-hidden border ${hasVoted || isTeacher ? 'border-gray-600 cursor-default' : 'border-gray-600 hover:border-blue-500 cursor-pointer'} transition-colors`}
                                                onClick={() => !isTeacher && !hasVoted && handleVote(poll.id, idx)}
                                            >
                                                {/* Background Bar */}
                                                {(hasVoted || isTeacher) && (
                                                    <div className="absolute top-0 left-0 bottom-0 bg-blue-900/40 transition-all duration-500" style={{ width: `${percent}%` }} />
                                                )}

                                                <div className="relative p-2 flex justify-between items-center z-10">
                                                    <span className="text-sm font-medium">{opt.text}</span>
                                                    {(hasVoted || isTeacher) && (
                                                        <span className="text-xs font-bold text-blue-300">{percent}%</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {hasVoted && <p className="text-center text-xs text-green-400 mt-2">Check ✓ Voted</p>}
                            </CardContent>
                        </Card>
                    );
                })}
                {polls.length === 0 && !isCreating && (
                    <div className="text-center text-gray-500 py-8 text-sm">No active polls</div>
                )}
            </div>
        </div>
    );
}
