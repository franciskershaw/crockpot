import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BackButtonProps {
  from?: string;
}

export function BackButton({ from = "/recipes" }: BackButtonProps) {
  // Determine button text based on previous page
  const getButtonText = (fromPath: string) => {
    switch (fromPath) {
      case "/recipes":
        return "Back to Recipes";
      case "/your-crockpot":
        return "Back to Your Crockpot";
      default:
        return "Back to Recipes";
    }
  };

  return (
    <div className="absolute top-4 left-4 z-20">
      <Link href={from}>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">{getButtonText(from)}</span>
        </Button>
      </Link>
    </div>
  );
}
