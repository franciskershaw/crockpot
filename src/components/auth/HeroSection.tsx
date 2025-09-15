import { Button } from "@/components/ui/button";
import { ChefHat, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
          Your Personal
          <span className="text-gradient-brand"> Recipe Assistant</span>
        </h1>

        <p className="text-xl leading-relaxed text-muted-foreground">
          Discover recipes, plan your meals, and generate smart shopping lists.
          Streamline your cooking routine with Crockpot.
        </p>

        {/* Key benefits */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Curated recipe collection</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Smart meal planning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Auto shopping lists</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          size="lg"
          className="bg-gradient-brand hover:bg-brand-primary shadow-lg h-14 px-8 text-lg font-semibold"
          asChild
        >
          <Link href="/recipes">
            <ChefHat className="h-6 w-6 mr-2" />
            Browse Recipes
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
