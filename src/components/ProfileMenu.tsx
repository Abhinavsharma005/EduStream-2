
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LogOut, Upload, User as UserIcon, Loader2, X } from "lucide-react";
import { UserAvatar } from "./UserAvatar";

interface ProfileMenuProps {
    user: {
        name: string;
        email: string;
        profile?: string;
    };
    onUpdate: (user: any) => void;
}

export function ProfileMenu({ user, onUpdate }: ProfileMenuProps) {
    const router = useRouter();
    const [isEditNameOpen, setIsEditNameOpen] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [newName, setNewName] = useState(user.name);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/authpage?mode=login");
            router.refresh();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const handleUpdateName = async () => {
        if (!newName.trim() || newName === user.name) return;
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", newName);

            const res = await fetch("/api/user/profile", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                onUpdate(data.user);
                setIsEditNameOpen(false);
            }
        } catch (error) {
            console.error("Failed to update name", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleUploadProfile = async () => {
        if (!selectedFile) return;
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            const res = await fetch("/api/user/profile", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                onUpdate(data.user);
                setIsUploadOpen(false);
                setSelectedFile(null);
                setPreviewUrl(null);
            }
        } catch (error) {
            console.error("Failed to upload profile", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveProfile = async () => {
        if (!confirm("Are you sure you want to remove your profile picture?")) return;
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("deleteProfile", "true");

            const res = await fetch("/api/user/profile", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                onUpdate(data.user);
                setIsUploadOpen(false);
                setPreviewUrl(null);
            }
        } catch (error) {
            console.error("Failed to remove profile", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-full pr-4 transition-colors cursor-pointer group">
                        <UserAvatar name={user.name} image={user.profile} className="h-10 w-10 ring-2 ring-offset-2 ring-transparent group-hover:ring-gray-200 transition-all" />
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-30">{user.email}</p>
                        </div>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsEditNameOpen(true)} className="cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Edit Full Name</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsUploadOpen(true)} className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        <span>Upload Profile Picture</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Name Dialog */}
            <Dialog open={isEditNameOpen} onOpenChange={setIsEditNameOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Full Name</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditNameOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateName} disabled={isLoading || !newName.trim()}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Upload Profile Dialog */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload Profile Picture</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex flex-col items-center gap-4">
                            {(previewUrl || user.profile) ? (
                                <div className="relative h-32 w-32">
                                    <UserAvatar name={user.name} image={previewUrl || user.profile} className="h-32 w-32" />
                                    {previewUrl && (
                                        <button
                                            onClick={() => { setPreviewUrl(null); setSelectedFile(null); }}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="h-32 w-32 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
                                    <UserIcon className="h-16 w-16" />
                                </div>
                            )}

                            <div className="w-full">
                                <Label htmlFor="picture" className="sr-only">Picture</Label>
                                <Input
                                    id="picture"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="cursor-pointer"
                                />
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    Supports JPG, PNG, GIF up to 5MB
                                </p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
                        {user.profile && (
                            <Button variant="destructive" onClick={handleRemoveProfile} disabled={isLoading}>
                                Remove Picture
                            </Button>
                        )}
                        <Button onClick={handleUploadProfile} disabled={isLoading || !selectedFile}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Upload & Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
