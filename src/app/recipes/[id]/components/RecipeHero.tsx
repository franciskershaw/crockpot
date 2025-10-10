import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat } from "lucide-react";
import { Recipe } from "@/data/types";
import { Session } from "next-auth";
import RecipeDetailActions from "./RecipeDetailActions";

interface RecipeHeroProps {
  recipe: Recipe;
  session: Session | null;
}

export function RecipeHero({ recipe, session }: RecipeHeroProps) {
  return (
    <div className="relative">
      {recipe.image?.url ? (
        <div className="relative h-[60vh] sm:h-[70vh] w-full">
          <Image
            src={recipe.image.url}
            alt={recipe.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={85}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ) : (
        <div className="h-[50vh] bg-gradient-to-br from-orange-400 to-red-500" />
      )}

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

            {/* Categories and Actions */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
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
              <div className="flex-shrink-0">
                {session && (
                  <RecipeDetailActions recipe={recipe} session={session} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
