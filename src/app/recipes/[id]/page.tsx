import { getRecipeById } from "@/actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Users,
  ChefHat,
  Beef,
  Fish,
  Carrot,
  Milk,
  Zap,
  Wine,
  Cookie,
  Package,
  Home,
  Citrus,
} from "lucide-react";

// Helper function to map Font Awesome icon names to Lucide icons based on actual DB data
const getIconComponent = (faIconName: string) => {
  const iconMap: Record<string, typeof Beef> = {
    faDrumstickBite: Beef, // Meat
    faFish: Fish, // Fish
    faCarrot: Carrot, // Veg
    faCheese: Milk, // Dairy
    faPepperHot: Zap, // Herbs and Spices
    faWineGlass: Wine, // Drinks
    faCookieBite: Cookie, // Sweets
    faJar: Package, // Cupboard
    faToiletPaper: Home, // House
    faLemon: Citrus, // Fruit
  };

  return iconMap[faIconName] || Package; // Default fallback icon
};

const RecipePage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const recipe = await getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  // Group ingredients by category for better organization
  const ingredientsByCategory = recipe.ingredients.reduce((acc, ingredient) => {
    const categoryName = ingredient.item?.category?.name || "Other";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(ingredient);
    return acc;
  }, {} as Record<string, typeof recipe.ingredients>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Actions at Top Right */}
      <div className="relative">
        {recipe.image?.url ? (
          <div className="relative h-[60vh] sm:h-[70vh] w-full">
            <Image
              src={recipe.image.url}
              alt={recipe.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ) : (
          <div className="h-[50vh] bg-gradient-to-br from-orange-400 to-red-500" />
        )}

        {/* Actions positioned at top-right of image */}
        <div className="absolute top-4 right-4 z-20">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-3">
              <p className="text-xs text-white text-center">Actions</p>
            </CardContent>
          </Card>
        </div>

        {/* Recipe Info Overlay at Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                {recipe.name}
              </h1>

              {/* Recipe Stats */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4">
                <div className="flex items-center gap-2 text-white/90">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-sm sm:text-base">
                    {recipe.timeInMinutes} mins
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-sm sm:text-base">
                    Serves {recipe.serves}
                  </span>
                </div>
                {recipe.createdBy && (
                  <div className="flex items-center gap-2 text-white/90">
                    <ChefHat className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">
                      By {recipe.createdBy.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Categories */}
              {recipe.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {recipe.categories.map((category) => (
                    <Badge
                      key={category.id}
                      variant="secondary"
                      className="px-2 py-1 text-xs sm:px-3 sm:text-sm bg-white/20 backdrop-blur-sm text-white border-white/30"
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
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
              <div className="space-y-4">
                {Object.entries(ingredientsByCategory).map(
                  ([categoryName, ingredients]) => {
                    const categoryIcon = ingredients[0]?.item?.category?.faIcon;
                    const IconComponent = categoryIcon
                      ? getIconComponent(categoryIcon)
                      : Package;

                    return (
                      <Card key={categoryName}>
                        <CardContent className="p-3 sm:p-4">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                            {categoryName}
                            <span className="text-xs font-normal text-gray-500">
                              ({ingredients.length})
                            </span>
                          </h3>

                          <div className="space-y-2">
                            {ingredients.map((ingredient, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-baseline gap-1 min-w-0 flex-1">
                                  <span className="font-semibold text-sm text-gray-900 shrink-0">
                                    {ingredient.quantity}
                                  </span>
                                  {ingredient.unit && (
                                    <span className="text-xs text-gray-600 shrink-0">
                                      {ingredient.unit.abbreviation}
                                    </span>
                                  )}
                                  <span className="text-sm text-gray-700 truncate">
                                    {ingredient.item?.name}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }
                )}
              </div>
            </TabsContent>

            <TabsContent value="instructions">
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                      Instructions
                    </h2>

                    <div className="space-y-4 sm:space-y-6">
                      {recipe.instructions.map((instruction, index) => (
                        <div key={index} className="flex gap-3 sm:gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1 pt-0.5">
                            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                              {instruction}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Notes Section */}
                {recipe.notes.length > 0 && (
                  <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-amber-900 mb-4">
                        Chef&apos;s Notes
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        {recipe.notes.map((note, index) => (
                          <div key={index} className="flex gap-2 sm:gap-3">
                            <div className="flex-shrink-0 w-1 h-1 bg-amber-500 rounded-full mt-2" />
                            <p className="text-amber-800 leading-relaxed text-sm sm:text-base">
                              {note}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop: Side-by-side Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Ingredients Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Ingredients ({recipe.ingredients.length})
                  </h2>

                  <div className="space-y-6">
                    {Object.entries(ingredientsByCategory).map(
                      ([categoryName, ingredients]) => {
                        const categoryIcon =
                          ingredients[0]?.item?.category?.faIcon;
                        const IconComponent = categoryIcon
                          ? getIconComponent(categoryIcon)
                          : Package;

                        return (
                          <div key={categoryName} className="space-y-3">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                              <IconComponent className="w-5 h-5 text-orange-500" />
                              {categoryName}
                              <span className="text-sm font-normal text-gray-500">
                                ({ingredients.length})
                              </span>
                            </h3>

                            <div className="space-y-2">
                              {ingredients.map((ingredient, index) => (
                                <div
                                  key={index}
                                  className="flex items-baseline gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <span className="font-semibold text-gray-900 min-w-0 flex-shrink-0">
                                    {ingredient.quantity}
                                  </span>
                                  {ingredient.unit && (
                                    <span className="text-sm text-gray-600 flex-shrink-0">
                                      {ingredient.unit.abbreviation}
                                    </span>
                                  )}
                                  <span className="text-gray-700 min-w-0">
                                    {ingredient.item?.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Instructions Main Content */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Instructions
                  </h2>

                  <div className="space-y-6">
                    {recipe.instructions.map((instruction, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-gray-700 leading-relaxed text-lg">
                            {instruction}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notes Section */}
              {recipe.notes.length > 0 && (
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-amber-900 mb-4">
                      Chef&apos;s Notes
                    </h3>
                    <div className="space-y-3">
                      {recipe.notes.map((note, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex-shrink-0 w-1.5 h-1.5 bg-amber-500 rounded-full mt-2" />
                          <p className="text-amber-800 leading-relaxed">
                            {note}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
