import { Card, CardContent } from "@/components/ui/card";
import { Search, ShoppingCart, Filter, Heart } from "lucide-react";

const features = [
  {
    icon: <Search className="h-6 w-6" />,
    title: "Smart Recipe Discovery",
    description:
      "Find recipes by ingredients you have, dietary preferences, or cooking time",
  },
  {
    icon: <ShoppingCart className="h-6 w-6" />,
    title: "Auto Shopping Lists",
    description:
      "Automatically generate organized shopping lists from your meal plans",
  },
  {
    icon: <Filter className="h-6 w-6" />,
    title: "Advanced Filtering",
    description:
      "Filter by cuisine, diet, difficulty, time, and more to find perfect recipes",
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Personal Recipe Collection",
    description:
      "Save favorites and create your own recipes to share with the community",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 lg:py-24 bg-surface-warm">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Why Choose Crockpot?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We&apos;ve built the ultimate cooking companion to make your
            culinary journey effortless and enjoyable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center border-0 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6 space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-surface-soft text-brand-primary">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 