import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Link, Star } from "lucide-react";

const tiers = [
  {
    name: "Free",
    price: "£0",
    period: "forever",
    description: "Perfect for getting started with meal planning",
    features: [
      "Browse curated recipes",
      "Create meal plans",
      "Generate shopping lists",
      "Save favorite recipes",
      "Basic filtering and search",
    ],
    cta: "Get Started Free",
    ctaVariant: "default" as const,
    popular: false,
    available: true,
  },
  {
    name: "Premium",
    price: "£4.99",
    period: "per month",
    description: "For home cooks who want to share their recipes",
    features: [
      "Everything in Free",
      "Create and share custom recipes",
      "Add custom ingredients",
      "Advanced recipe analytics",
      "Priority support",
    ],
    cta: "Coming Soon",
    ctaVariant: "outline" as const,
    popular: true,
    available: false,
  },
  {
    name: "Pro",
    price: "£9.99",
    period: "per month",
    description: "For serious cooking enthusiasts and professionals",
    features: [
      "Everything in Premium",
      "AI-powered recipe suggestions",
      "Nutritional analysis",
      "Bulk recipe import/export",
      "Advanced meal planning tools",
      "White-label options",
    ],
    cta: "Coming Soon",
    ctaVariant: "outline" as const,
    popular: false,
    available: false,
  },
];

export default function PricingSection() {
  return (
    <>
      <div className="text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
          Choose your plan
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start free and upgrade when you&apos;re ready for more features.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
        {tiers.map((tier, index) => (
          <Card
            key={index}
            className={`relative h-full ${
              tier.popular
                ? "border-brand-primary shadow-lg scale-105"
                : "hover:shadow-lg"
            } transition-all duration-300 ${
              !tier.available ? "opacity-75" : ""
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-brand text-white px-4 py-1">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">{tier.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className="text-muted-foreground">/{tier.period}</span>
              </div>
              <CardDescription className="mt-2">
                {tier.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full h-12"
                variant={tier.ctaVariant}
                disabled={!tier.available}
                asChild={tier.available}
              >
                {tier.available ? (
                  <Link href="/recipes">{tier.cta}</Link>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="h-4 w-4" />
                    {tier.cta}
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          All plans include access to our growing recipe collection and core
          meal planning features.
        </p>
      </div>
    </>
  );
}
