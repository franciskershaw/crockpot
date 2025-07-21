import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function BackButton() {
  return (
    <div className="absolute top-4 left-4 z-20">
      <Link href="/recipes">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to recipes</span>
        </Button>
      </Link>
    </div>
  );
}
