import { getRecipeById } from "@/actions/recipes";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecipeHero } from "./components/RecipeHero";
import { IngredientsSection } from "./components/IngredientsSection";
import { InstructionsSection } from "./components/InstructionsSection";
import { NotesSection } from "./components/NotesSection";
import { BackButton } from "./components/BackButton";

const RecipePage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  const recipe = await getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Actions */}
      <div className="relative">
        <RecipeHero recipe={recipe} />
        <BackButton />
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Mobile and Tablet: Use Tabs */}
        <div className="lg:hidden">
          <Tabs defaultValue="ingredients" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="ingredients" className="text-sm sm:text-base">
                Ingredients ({recipe.ingredients.length})
              </TabsTrigger>
              <TabsTrigger
                value="instructions"
                className="text-sm sm:text-base"
              >
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
          {/* Ingredients Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <IngredientsSection
                ingredients={recipe.ingredients}
                originalServes={recipe.serves}
                recipeId={recipe.id}
              />
            </div>
          </div>

          {/* Instructions Main Content */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              <InstructionsSection instructions={recipe.instructions} />
              <NotesSection notes={recipe.notes} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
