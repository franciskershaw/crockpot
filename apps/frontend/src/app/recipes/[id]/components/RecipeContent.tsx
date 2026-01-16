"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IngredientsSection } from "./IngredientsSection";
import { InstructionsSection } from "./InstructionsSection";
import { NotesSection } from "./NotesSection";
import { Recipe } from "@/data/types";

interface RecipeContentProps {
  recipe: Recipe;
}

export function RecipeContent({ recipe }: RecipeContentProps) {
  return (
    <>
      {/* Mobile and Tablet: Use Tabs */}
      <div className="lg:hidden">
        <Tabs defaultValue="ingredients" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ingredients" className="text-sm sm:text-base">
              Ingredients ({recipe.ingredients.length})
            </TabsTrigger>
            <TabsTrigger value="instructions" className="text-sm sm:text-base">
              Instructions ({recipe.instructions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ingredients">
            <IngredientsSection
              ingredients={recipe.ingredients}
              originalServes={recipe.serves}
              recipeId={recipe.id}
            />
          </TabsContent>

          <TabsContent value="instructions">
            <div className="space-y-6">
              <InstructionsSection
                instructions={recipe.instructions}
                isMobile
              />
              <NotesSection notes={recipe.notes} isMobile />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop: Side-by-side Layout */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="sticky top-8">
            <IngredientsSection
              ingredients={recipe.ingredients}
              originalServes={recipe.serves}
              recipeId={recipe.id}
            />
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="space-y-6">
            <InstructionsSection instructions={recipe.instructions} />
            <NotesSection notes={recipe.notes} />
          </div>
        </div>
      </div>
    </>
  );
}
