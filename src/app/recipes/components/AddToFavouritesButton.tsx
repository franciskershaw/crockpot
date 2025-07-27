"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState } from "react";

const AddToFavouritesButton = () => {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    // TODO: Add server action to update favorites
  };
  return (
    <Button
      size="sm"
      variant="ghost"
      className={`h-8 w-8 p-0 rounded-full bg-white/90 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-200 ${
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
