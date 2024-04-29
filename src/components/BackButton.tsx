"use client";

import { ChevronLeft } from "lucide-react"
import { Button } from "./ui/Button"
import { useRouter } from "next/navigation"

const BackButton = () => {
    const router = useRouter();
    return (
        <Button onClick={() => router.back()} variant='ghost' size='sm'>
            <ChevronLeft className="w-7 h-7 text-foreground" />
        </Button>
    )
}

export default BackButton;