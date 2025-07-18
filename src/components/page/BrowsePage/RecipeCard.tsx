import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Clock, Users } from "lucide-react";
import Image from "next/image";

export interface RecipeCardProps {
  recipe: {
    id: string;
    name: string;
    timeInMinutes: number;
    image?: { url?: string | null; filename?: string | null } | null;
    approved: boolean;
    serves: number;
    createdAt: string;
    updatedAt: string;
    categories?: { id: string; name: string }[];
    tags?: string[];
  };
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden cursor-pointer">
      <div className="relative h-48 overflow-hidden">
        <div className="w-full h-full bg-surface-soft flex items-center justify-center">
          {recipe.image?.url ? (
            <div className="absolute inset-0">
              <Image
                src={recipe.image.url}
                alt={recipe.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
              />
            </div>
          ) : (
            <ChefHat className="h-16 w-16 text-brand-secondary" />
          )}
        </div>
      </div>
      <CardContent className="p-6">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-brand-primary transition-colors">
            {recipe.name}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {recipe.timeInMinutes} mins
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Serves {recipe.serves}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {(recipe.categories ?? []).slice(0, 3).map((cat) => (
              <Badge
                key={cat.id}
                variant="secondary"
                className="text-xs bg-surface-soft text-text-soft"
              >
                {cat.name}
              </Badge>
            ))}
            {recipe.categories && recipe.categories.length > 3 && (
              <Badge
                variant="secondary"
                className="text-xs bg-surface-soft text-text-soft"
              >
                +{recipe.categories.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
