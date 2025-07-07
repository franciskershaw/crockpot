import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Clock, Users, Star } from "lucide-react";

const featuredRecipes = [
  {
    id: 1,
    title: "Mediterranean Chickpea Stew",
    time: "25 mins",
    difficulty: "Easy",
    rating: 4.8,
    tags: ["Vegetarian", "Quick", "Healthy"],
  },
  {
    id: 2,
    title: "Honey Garlic Salmon",
    time: "20 mins",
    difficulty: "Medium",
    rating: 4.9,
    tags: ["Seafood", "Protein", "Gluten-Free"],
  },
  {
    id: 3,
    title: "Creamy Mushroom Risotto",
    time: "35 mins",
    difficulty: "Medium",
    rating: 4.7,
    tags: ["Vegetarian", "Comfort Food", "Italian"],
  },
];

export default function FeaturedRecipes() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Trending Recipes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover what&apos;s cooking in our community. From quick weeknight
            dinners to weekend treats.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRecipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="w-full h-full bg-surface-soft flex items-center justify-center">
                  <ChefHat className="h-16 w-16 text-brand-secondary" />
                </div>
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white/90 text-gray-800 hover:bg-white">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {recipe.rating}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-brand-primary transition-colors">
                    {recipe.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {recipe.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {recipe.difficulty}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-surface-soft text-text-soft"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
