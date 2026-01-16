"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clock } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const tiers = [
  {
    name: "Free",
    price: "£0",
    period: "forever",
    description:
      "Start your cooking journey with essential meal planning tools",
    features: [
      "Add to weekly menu and favourites",
      "Automated and editable shopping lists",
      "5 recipe creations",
      "Find recipes by ingredients and categories",
    ],
    cta: "Get Started Free",
    ctaVariant: "default" as const,
    available: true,
  },
  {
    name: "Premium",
    price: "£4.99",
    period: "per month",
    description:
      "Unlock your creativity with more recipes and custom ingredients",
    features: [
      "Everything in Free",
      "25 recipe creations",
      "Custom ingredients",
      "Advanced meal planner",
    ],
    cta: "Coming Soon",
    ctaVariant: "outline" as const,
    available: false,
  },
  {
    name: "Pro",
    price: "£9.99",
    period: "per month",
    description: "Experience the future of cooking with AI-powered features",
    features: [
      "Everything in Premium",
      "Unlimited recipe creations",
      "AI recipe generation",
      "Smart meal suggestions",
    ],
    cta: "Coming Soon",
    ctaVariant: "outline" as const,
    available: false,
  },
];

export default function PricingCarousel() {
  const scrollToAuth = () => {
    const authElement = document.querySelector("[data-auth-section]");
    if (authElement) {
      authElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Carousel className="w-full max-w-sm">
      <CarouselContent>
        {tiers.map((tier, index) => (
          <CarouselItem key={index}>
            <div className="px-4">
              <Card
                className={`relative h-full flex flex-col hover:shadow-lg transition-all duration-300 ${
                  !tier.available ? "opacity-75" : ""
                }`}
              >
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground">
                      /{tier.period}
                    </span>
                  </div>
                  <CardDescription className="mt-2">
                    {tier.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 flex flex-col flex-grow">
                  <ul className="space-y-3 mb-8 flex-grow">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full h-12 mt-auto"
                    variant={tier.ctaVariant}
                    disabled={!tier.available}
                    onClick={tier.available ? scrollToAuth : undefined}
                  >
                    {tier.available ? (
                      tier.cta
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="h-4 w-4" />
                        {tier.cta}
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0" />
      <CarouselNext className="right-0" />
    </Carousel>
  );
}
