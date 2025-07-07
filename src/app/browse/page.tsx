"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  ChefHat,
  Clock,
  Users,
  Star,
  Search,
  Heart,
  ShoppingCart,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Mock data for recipes
const mockRecipes = [
  {
    id: 1,
    title: "Mediterranean Chickpea Stew",
    time: 25,
    difficulty: "Easy",
    rating: 4.8,
    tags: ["Vegetarian", "Quick", "Healthy"],
    categories: ["Mediterranean", "Vegetarian"],
    ingredients: ["chickpeas", "tomatoes", "onions", "garlic"],
  },
  {
    id: 2,
    title: "Honey Garlic Salmon",
    time: 20,
    difficulty: "Medium",
    rating: 4.9,
    tags: ["Seafood", "Protein", "Gluten-Free"],
    categories: ["Seafood", "Asian"],
    ingredients: ["salmon", "honey", "garlic", "soy sauce"],
  },
  {
    id: 3,
    title: "Creamy Mushroom Risotto",
    time: 35,
    difficulty: "Medium",
    rating: 4.7,
    tags: ["Vegetarian", "Comfort Food", "Italian"],
    categories: ["Italian", "Vegetarian"],
    ingredients: ["arborio rice", "mushrooms", "parmesan", "white wine"],
  },
  {
    id: 4,
    title: "Thai Green Curry",
    time: 30,
    difficulty: "Medium",
    rating: 4.6,
    tags: ["Thai", "Spicy", "Coconut"],
    categories: ["Thai", "Asian"],
    ingredients: ["green curry paste", "coconut milk", "chicken", "basil"],
  },
  {
    id: 5,
    title: "Classic Caesar Salad",
    time: 15,
    difficulty: "Easy",
    rating: 4.5,
    tags: ["Salad", "Quick", "Classic"],
    categories: ["Salad", "American"],
    ingredients: ["romaine lettuce", "parmesan", "croutons", "caesar dressing"],
  },
  {
    id: 6,
    title: "Beef Bourguignon",
    time: 120,
    difficulty: "Hard",
    rating: 4.9,
    tags: ["French", "Slow Cook", "Comfort Food"],
    categories: ["French", "Beef"],
    ingredients: ["beef chuck", "red wine", "mushrooms", "pearl onions"],
  },
];

// Expanded categories with more realistic options
const allCategories = [
  "Mediterranean",
  "Asian",
  "Italian",
  "Thai",
  "French",
  "American",
  "Mexican",
  "Indian",
  "Japanese",
  "Greek",
  "Chinese",
  "Korean",
  "Middle Eastern",
  "Spanish",
  "German",
  "British",
  "Vietnamese",
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Keto",
  "Paleo",
  "Low-Carb",
  "Seafood",
  "Beef",
  "Chicken",
  "Pork",
  "Lamb",
  "Turkey",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
  "Appetizer",
  "Soup",
  "Salad",
  "Pasta",
  "Rice",
  "Bread",
  "Pizza",
];

// Expanded ingredients with more realistic options
const allIngredients = [
  "chicken",
  "beef",
  "salmon",
  "tuna",
  "shrimp",
  "pork",
  "lamb",
  "turkey",
  "chickpeas",
  "lentils",
  "black beans",
  "kidney beans",
  "tofu",
  "eggs",
  "mushrooms",
  "tomatoes",
  "onions",
  "garlic",
  "bell peppers",
  "carrots",
  "broccoli",
  "spinach",
  "kale",
  "avocado",
  "cucumber",
  "zucchini",
  "rice",
  "pasta",
  "quinoa",
  "bread",
  "flour",
  "oats",
  "potatoes",
  "cheese",
  "milk",
  "yogurt",
  "butter",
  "cream",
  "parmesan",
  "mozzarella",
  "olive oil",
  "coconut oil",
  "soy sauce",
  "vinegar",
  "honey",
  "sugar",
  "salt",
  "pepper",
  "basil",
  "oregano",
  "thyme",
  "rosemary",
  "cilantro",
  "ginger",
  "turmeric",
  "paprika",
  "cumin",
  "chili powder",
  "garlic powder",
];

interface FilterSectionProps {
  title: string;
  items: string[];
  selectedItems: string[];
  onItemChange: (item: string, checked: boolean) => void;
  searchPlaceholder: string;
}

function FilterSection({
  title,
  items,
  selectedItems,
  onItemChange,
  searchPlaceholder,
}: FilterSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const displayItems = showAll ? filteredItems : filteredItems.slice(0, 5);
  const hasMore = filteredItems.length > 5;

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">{title}</Label>

      {/* Search within category */}
      <div className="relative">
        <Search className="h-3 w-3 absolute left-3 top-3 text-gray-400" />
        <Input
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 h-8 text-sm"
        />
      </div>

      {/* Items list with fade effect */}
      <div className="relative">
        <div
          className={`space-y-2 max-h-48 overflow-y-auto ${
            !showAll && hasMore ? "mask-fade-bottom" : ""
          }`}
        >
          {displayItems.map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox
                id={`${title}-${item}`}
                checked={selectedItems.includes(item)}
                onCheckedChange={(checked) =>
                  onItemChange(item, checked as boolean)
                }
                className="h-4 w-4"
              />
              <Label
                htmlFor={`${title}-${item}`}
                className="text-xs font-normal text-gray-600 cursor-pointer capitalize"
              >
                {item}
              </Label>
            </div>
          ))}
        </div>

        {/* Show/Hide toggle */}
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-2 h-6 text-xs text-brand-primary hover:text-brand-tertiary"
          >
            {showAll ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                Show All ({filteredItems.length - 5} more)
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState([0, 120]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter recipes based on current filters
  const filteredRecipes = mockRecipes.filter((recipe) => {
    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategories =
      selectedCategories.length === 0 ||
      selectedCategories.some((cat) => recipe.categories.includes(cat));
    const matchesIngredients =
      selectedIngredients.length === 0 ||
      selectedIngredients.some((ing) => recipe.ingredients.includes(ing));
    const matchesTime =
      recipe.time >= timeRange[0] && recipe.time <= timeRange[1];

    return (
      matchesSearch && matchesCategories && matchesIngredients && matchesTime
    );
  });

  const activeFiltersCount =
    selectedCategories.length +
    selectedIngredients.length +
    (timeRange[0] !== 0 || timeRange[1] !== 120 ? 1 : 0);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };

  const handleIngredientChange = (ingredient: string, checked: boolean) => {
    if (checked) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    } else {
      setSelectedIngredients(
        selectedIngredients.filter((i) => i !== ingredient)
      );
    }
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedIngredients([]);
    setTimeRange([0, 120]);
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Clear all button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-brand-primary hover:text-brand-tertiary"
          >
            Clear All ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Cooking Time */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          Cooking Time: {timeRange[0]}min - {timeRange[1]}min
        </Label>
        <Slider
          value={timeRange}
          onValueChange={setTimeRange}
          max={120}
          min={0}
          step={5}
          className="w-full"
        />
      </div>

      {/* Categories */}
      <FilterSection
        title="Categories"
        items={allCategories}
        selectedItems={selectedCategories}
        onItemChange={handleCategoryChange}
        searchPlaceholder="Search categories..."
      />

      {/* Ingredients */}
      <FilterSection
        title="Key Ingredients"
        items={allIngredients}
        selectedItems={selectedIngredients}
        onItemChange={handleIngredientChange}
        searchPlaceholder="Search ingredients..."
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-warm">
      <div className="container mx-auto px-4 py-6">
        {/* Desktop Sticky Header */}
        <div className="hidden md:block sticky top-16 z-40 bg-surface-warm/95 backdrop-blur-sm -mx-4 px-4 py-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 whitespace-nowrap">
                Browse Recipes
              </h1>
              <Badge
                variant="secondary"
                className="bg-surface-soft text-text-soft shrink-0"
              >
                {filteredRecipes.length} recipes
              </Badge>
            </div>

            {/* Desktop Search Bar - on same row as header */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-4 top-3.5 text-gray-400" />
                <Input
                  placeholder="Search recipes by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base bg-white/80 backdrop-blur-sm border-0 shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header (non-sticky) */}
        <div className="md:hidden flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 whitespace-nowrap">
            Browse Recipes
          </h1>
          <Badge
            variant="secondary"
            className="bg-surface-soft text-text-soft shrink-0"
          >
            {filteredRecipes.length} recipes
          </Badge>
        </div>

        {/* Mobile Search Bar and Filters - on same row */}
        <div className="flex md:hidden gap-3 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3.5 text-gray-400" />
              <Input
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 text-sm bg-white/80 backdrop-blur-sm border-0 shadow-lg"
              />
            </div>
          </div>

          {/* Mobile filters button with integrated clear functionality */}
          <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 h-10 relative"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-brand-primary text-white px-1.5 py-0.5 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="mt-6 px-4">
                <FiltersContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid lg:grid-cols-6 gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block lg:col-span-2">
            <Card className="sticky top-32 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <FiltersContent />
              </CardContent>
            </Card>
          </div>

          {/* Recipe Grid */}
          <div className="md:col-span-3 lg:col-span-4">
            {filteredRecipes.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <ChefHat className="h-16 w-16 mx-auto text-brand-secondary mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No recipes found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search terms to find more
                    recipes.
                  </p>
                  <Button
                    onClick={clearAllFilters}
                    variant="outline"
                    className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
                  <Card
                    key={recipe.id}
                    className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden cursor-pointer"
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
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
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
                            {recipe.time} mins
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {recipe.difficulty}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {recipe.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs bg-surface-soft text-text-soft"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {recipe.tags.length > 3 && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-surface-soft text-text-soft"
                            >
                              +{recipe.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
