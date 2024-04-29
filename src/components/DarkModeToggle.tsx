"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Toggle } from "./ui/Toggle";
import { useEffect, useState } from "react";

const DarkModeToggle = ({ className = '' }: { className: string }) => {
    const { theme, setTheme } = useTheme();
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <Toggle className={className} size="sm" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun /> : <Moon />}
        </Toggle>
    )
}

export default DarkModeToggle;