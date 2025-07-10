import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
          Cook with
          <span className="text-gradient-brand"> Confidence</span>
        </h1>
        <p className="text-xl leading-relaxed">
          Discover new recipes, plan your meals effortlessly, and generate smart
          shopping lists. Transform the way you cook and meal prep with Crockpot.
        </p>
      </div>

      <div className="text-center md:text-left">
        <Button
          size="lg"
          className="bg-gradient-brand hover:bg-brand-primary shadow-lg"
        >
          <ChefHat className="h-6 w-6" />
          Browse recipes
        </Button>
      </div>
    </div>
  );
}
