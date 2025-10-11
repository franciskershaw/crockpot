import { Suspense } from "react";
import CreateRecipeFormWithAuth from "./components/CreateRecipeFormWithAuth";
import CreateRecipeFormSkeleton from "./components/CreateRecipeFormSkeleton";

export default function NewRecipePage() {
  return (
    <div className="container mx-auto md:px-4 py-6 max-w-4xl">
      {/* Static content - renders immediately */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          Create New Recipe
        </h1>
        <p className="text-gray-600 mt-2">
          Share your culinary creation with the community
        </p>
      </div>

      {/* Data fetching wrapped in Suspense */}
      <Suspense fallback={<CreateRecipeFormSkeleton />}>
        <CreateRecipeFormWithAuth />
      </Suspense>
    </div>
  );
}
