
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
    name: string;
    image?: string;
    className?: string;
    onClick?: () => void;
}

export function UserAvatar({ name, image, className, onClick }: UserAvatarProps) {
    const initials = name
        ? name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()
        : "U";

    return (
        <Avatar className={cn("cursor-pointer border border-gray-200 shadow-sm", className)} onClick={onClick}>
            <AvatarImage src={image} alt={name} className="object-cover" />
            <AvatarFallback className="bg-blue-600 text-white font-medium">
                {initials}
            </AvatarFallback>
        </Avatar>
    );
}
