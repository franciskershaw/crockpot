"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useAddToFavouritesMutation,
  useRemoveFromFavouritesMutation,
  useGetFavourites,
} from "@/hooks/useFavourites";

const AddToFavouritesButton = ({
  recipeId,
  favourited,
}: {
  recipeId: string;
  favourited?: boolean;
}) => {
  const [isFavorited, setIsFavorited] = useState(favourited ?? false);
  const addToFavouritesMutation = useAddToFavouritesMutation();
  const removeFromFavouritesMutation = useRemoveFromFavouritesMutation();
  const { favourites } = useGetFavourites();

  useEffect(() => {
    setIsFavorited(favourites?.some((fav) => fav.id === recipeId) ?? false);
  }, [favourites, recipeId]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    if (isFavorited) {
      removeFromFavouritesMutation.mutate({ recipeId });
    } else {
      addToFavouritesMutation.mutate({ recipeId });
    }
  };

  return (
    <Button
      size="sm"
      variant="ghost"
      className={`h-8 w-8 p-0 rounded-full bg-white/90 border-0 shadow-sm hover:shadow-md transition-all duration-200 ${
        isFavorited
          ? "text-red-500 hover:text-red-600"
          : "text-gray-600 hover:text-red-500"
      }`}
      onClick={handleFavoriteClick}
    >
      <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
      <span className="sr-only">
        {isFavorited ? "Remove from favorites" : "Add to favorites"}
      </span>
    </Button>
  );
};

export default AddToFavouritesButton;
