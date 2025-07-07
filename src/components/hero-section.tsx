"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";

export default function HeroSection() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
          Cook with
          <span className="text-gradient-brand">
            {" "}
            Confidence
          </span>
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Discover thousands of recipes, plan your meals effortlessly,
          and generate smart shopping lists. Transform the way you cook
          with Crockpot.
        </p>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <Button
          size="lg"
          className="bg-gradient-brand hover:bg-brand-primary text-white shadow-lg"
          onClick={() => router.push("/browse")}
        >
          <ChefHat className="h-5 w-5 mr-2" />
          Start Cooking
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="border-gray-300 hover:bg-gray-50"
        >
          Learn More
        </Button>
      </div>
    </div>
  );
} 