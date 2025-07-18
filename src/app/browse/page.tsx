"use server";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ChefHat, Clock, Users, Star, Heart, ShoppingCart } from "lucide-react";

export default async function Browse() {
  return (
    <>
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
                {/* {filteredRecipes.length} recipes */}
              </Badge>
            </div>

            {/* Desktop Search Bar - on same row as header */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-4 top-3.5 text-gray-400" />
                <Input
                  placeholder="Search recipes by name..."
                  // value={searchQuery}
                  // onChange={(e) => setSearchQuery(e.target.value)}
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
            {/* {filteredRecipes.length} recipes */}
          </Badge>
        </div>

        {/* Mobile Search Bar and Filters - on same row */}
        <div className="flex md:hidden gap-3 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3.5 text-gray-400" />
              <Input
                placeholder="Search recipes..."
                // value={searchQuery}
                // onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 text-sm bg-white/80 backdrop-blur-sm border-0 shadow-lg"
              />
            </div>
          </div>

          {/* Mobile filters button with integrated clear functionality */}
          {/* <Sheet open={false} onOpenChange={() => {}}>
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
          </Sheet> */}
        </div>

        <div className="grid lg:grid-cols-6 gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block lg:col-span-2">
            <Card className="sticky top-32 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                {/* <FiltersContent /> */}
              </CardContent>
            </Card>
          </div>

          {/* Recipe Grid */}
          <div className="md:col-span-3 lg:col-span-4">
            {/* {filteredRecipes.length === 0 ? ( */}
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
                  // onClick={clearAllFilters}
                  variant="outline"
                  className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
            {/* ) : ( */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* {filteredRecipes.map((recipe) => ( */}
              <Card
                // key={recipe.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="w-full h-full bg-surface-soft flex items-center justify-center">
                    <ChefHat className="h-16 w-16 text-brand-secondary" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 text-gray-800 hover:bg-white">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {/* {recipe.rating} */}
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
                      {/* {recipe.title} */}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {/* {recipe.time} mins */}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {/* {recipe.difficulty} */}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {/* {recipe.tags.slice(0, 3).map((tag) => ( */}
                      <Badge
                        // key={tag}
                        variant="secondary"
                        className="text-xs bg-surface-soft text-text-soft"
                      >
                        {/* {tag} */}
                      </Badge>
                      {/* ))} */}
                      {/* {recipe.tags.length > 3 && ( */}
                      <Badge
                        variant="secondary"
                        className="text-xs bg-surface-soft text-text-soft"
                      >
                        {/* +{recipe.tags.length - 3} more */}
                      </Badge>
                      {/* )} */}
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* ))} */}
            </div>
            {/* )} */}
          </div>
        </div>
      </div>
    </>
  );
}
