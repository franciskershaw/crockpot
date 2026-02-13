"use client";

import { useRouter } from "next/navigation";

import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import useUser from "@/hooks/user/useUser";
import { ROLE } from "@/shared/constants";
import { Recipe } from "@/shared/types";

const EditRecipeButton = ({ recipe }: { recipe: Recipe }) => {
  const router = useRouter();
  const { user } = useUser();

  const hasPermission =
    (user?.role as unknown as string) === ROLE.ADMIN ||
    recipe.createdById === user?._id;

  if (!hasPermission) {
    return null;
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className={`h-8 w-8 p-0 rounded-full bg-white/90 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-200 ${"text-gray-600 hover:text-red-500"}`}
      // direct to the edit page
      onClick={() => {
        router.push(`/recipes/edit/${recipe._id}`);
      }}
    >
      <Pencil className={"h-4 w-4 "} />
      <span className="sr-only">Edit recipe</span>
    </Button>
  );
};

export default EditRecipeButton;
