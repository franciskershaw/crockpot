import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, ShoppingBasket, ChefHat } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discover Recipes",
    description:
      "Browse thousands of recipes with smart filters. Find exactly what you're looking for by ingredients, cooking time, or cuisine type.",
    color: "bg-blue-500",
  },
  {
    number: "02",
    icon: Calendar,
    title: "Plan Your Meals",
    description:
      "Add recipes to your weekly menu. Crockpot helps you organize your meals and ensures variety in your cooking.",
    color: "bg-green-500",
  },
  {
    number: "03",
    icon: ShoppingBasket,
    title: "Generate Shopping List",
    description:
      "Automatically create organized shopping lists from your meal plan. Ingredients are grouped by category for easy shopping.",
    color: "bg-purple-500",
  },
  {
    number: "04",
    icon: ChefHat,
    title: "Cook & Enjoy",
    description:
      "Follow step-by-step instructions, adjust serving sizes, and cook with confidence. Save your favorites for next time.",
    color: "bg-orange-500",
  },
];

export default function HowItWorksSection() {
  return (
    <>
      <div className="text-center">
        <h2 id="how-it-works" className="text-3xl lg:text-4xl font-bold mb-4">
          How it works
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get started in minutes and transform your cooking routine with our
          simple 4-step process.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          return (
            <div key={index} className="relative">
              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent z-0" />
              )}

              <Card className="relative z-10 h-full text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-8 pb-8">
                  <div className="flex flex-col items-center">
                    {/* Step number badge */}
                    <Badge
                      variant="secondary"
                      className="mb-4 text-sm font-semibold px-3 py-1"
                    >
                      {step.number}
                    </Badge>

                    {/* Icon */}
                    <div
                      className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mb-6`}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </>
  );
}
