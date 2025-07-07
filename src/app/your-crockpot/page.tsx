"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChefHat,
  Heart,
  ShoppingCart,
  Clock,
  Users,
  Star,
  Plus,
  Trash2,
} from "lucide-react";

// Mock data for user's content
const mockFavorites = [
  {
    id: 1,
    title: "Mediterranean Chickpea Stew",
    time: 25,
    difficulty: "Easy",
    rating: 4.8,
    tags: ["Vegetarian", "Quick", "Healthy"],
  },
  {
    id: 2,
    title: "Honey Garlic Salmon",
    time: 20,
    difficulty: "Medium",
    rating: 4.9,
    tags: ["Seafood", "Protein", "Gluten-Free"],
  },
];

const mockMyRecipes = [
  {
    id: 3,
    title: "Grandma's Apple Pie",
    time: 90,
    difficulty: "Medium",
    rating: 4.7,
    tags: ["Dessert", "Family Recipe", "Comfort Food"],
  },
];

const mockMenu = [
  {
    id: 1,
    recipe: mockFavorites[0],
    servings: 4,
    date: "2024-01-15",
  },
  {
    id: 2,
    recipe: mockFavorites[1],
    servings: 2,
    date: "2024-01-16",
  },
];

export default function YourCrockpotPage() {
  const [activeTab, setActiveTab] = useState("menu");

  const handleAddToMenu = (recipe: any) => {
    alert(`Added ${recipe.title} to your menu!`);
  };

  const handleRemoveFromMenu = (menuItem: any) => {
    alert(`Removed ${menuItem.recipe.title} from your menu!`);
  };

  const RecipeCard = ({ recipe, showActions = true, menuItem = null }: any) => (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
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
        {menuItem && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-brand-primary text-white">
              {menuItem.servings} servings
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-brand-primary transition-colors">
            {recipe.title}
          </h3>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {recipe.time} mins
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {recipe.difficulty}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {recipe.tags.slice(0, 3).map((tag: string) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs bg-surface-soft text-text-soft"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {showActions && (
            <div className="flex gap-2 mt-4">
              {activeTab !== "menu" && (
                <Button
                  size="sm"
                  onClick={() => handleAddToMenu(recipe)}
                  className="flex-1 bg-gradient-brand hover:bg-brand-primary text-white"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Menu
                </Button>
              )}
              {menuItem && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemoveFromMenu(menuItem)}
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ title, description, actionText, onAction }: any) => (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-12 text-center">
        <ChefHat className="h-16 w-16 mx-auto text-brand-secondary mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        {actionText && (
          <Button
            onClick={onAction}
            className="bg-gradient-brand hover:bg-brand-primary text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            {actionText}
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-surface-warm">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Crockpot
          </h1>
          <p className="text-gray-600">
            Manage your recipes, favorites, and meal planning
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
            <TabsTrigger
              value="menu"
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-white"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Menu ({mockMenu.length})
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-white"
            >
              <Heart className="h-4 w-4 mr-2" />
              Favorites ({mockFavorites.length})
            </TabsTrigger>
            <TabsTrigger
              value="my-recipes"
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-white"
            >
              <ChefHat className="h-4 w-4 mr-2" />
              My Recipes ({mockMyRecipes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Shopping List Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Shopping List
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm text-gray-600">
                        Auto-generated from your menu:
                      </div>
                      <div className="space-y-2">
                        <div className="p-3 bg-surface-soft rounded-lg">
                          <div className="font-medium text-sm">Proteins</div>
                          <div className="text-sm text-gray-600">
                            Salmon (2 portions), Chickpeas (1 can)
                          </div>
                        </div>
                        <div className="p-3 bg-surface-soft rounded-lg">
                          <div className="font-medium text-sm">Vegetables</div>
                          <div className="text-sm text-gray-600">
                            Onions (2), Tomatoes (4), Garlic (1 head)
                          </div>
                        </div>
                        <div className="p-3 bg-surface-soft rounded-lg">
                          <div className="font-medium text-sm">Pantry</div>
                          <div className="text-sm text-gray-600">
                            Honey, Soy sauce, Olive oil
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        Export List
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Menu Items */}
              <div className="lg:col-span-3">
                {mockMenu.length === 0 ? (
                  <EmptyState
                    title="No recipes in your menu"
                    description="Add some recipes to your weekly menu to generate a shopping list."
                    actionText="Browse Recipes"
                    onAction={() => (window.location.href = "/browse")}
                  />
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {mockMenu.map((menuItem) => (
                      <RecipeCard
                        key={menuItem.id}
                        recipe={menuItem.recipe}
                        menuItem={menuItem}
                        showActions={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            {mockFavorites.length === 0 ? (
              <EmptyState
                title="No favorite recipes yet"
                description="Start building your collection by hearting recipes you love."
                actionText="Browse Recipes"
                onAction={() => (window.location.href = "/browse")}
              />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockFavorites.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    showActions={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-recipes">
            {mockMyRecipes.length === 0 ? (
              <EmptyState
                title="No recipes created yet"
                description="Share your culinary creations with the community."
                actionText="Add Recipe"
                onAction={() => alert("Add Recipe functionality coming soon!")}
              />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockMyRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    showActions={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
